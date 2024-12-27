import { UserDao } from '@Dao/user.dao';
import AwsHelper from '@Helpers/aws-helper';
import { ErrorHelper } from '@Helpers/error-helper';
import { ContextWrapper } from '@Helpers/molecular-helper';
import { Address } from '@Models/address';
import { Role } from '@Models/role';
import { User } from '@Models/user';
import { UserAccess } from '@Models/user-access';
import { UserBranch } from '@Models/user-branch';
import { UserRole } from '@Models/user-role';
import { Constants } from '@Utility/constants';
import { Messages } from '@Utility/Messages';
import { Method } from 'moleculer-decorators';
import { BranchHelper } from './branch.helper';
import { UserAddressMapper, UserMapper } from 'src/dto/user.dto';
import { UserRoleType, UserStatusType } from '@Utility/enum';
import { BaseDto } from 'src/dto/base.dto';
import { BaseDao } from '@Dao/base.dao';
import appConfig from '../../../app-config.json';
import { LoginHelper } from './login.helper';

export class UserHelper {
	@Method
	public static setUserDetails(ctx: ContextWrapper, user: User): User {
		user.firstName = ctx.params.firstName;
		user.lastName = ctx.params.lastName;
		user.email = ctx.params.email.toUpperCase();
		user.mobileNumber = ctx.params.mobile;
		user.gender = ctx.params.gender;
		user.createdBy = ctx.meta.userId || Constants.MY_PROFESSOR_BOT;
		user.dob = ctx.params.dob;
		// user.roleId = ctx.params.roleId;
		user.p1Email = ctx.params.p1Email;
		user.p1FirstName = ctx.params.p1FirstName;
		user.p1LastName = ctx.params.p1LastName;
		user.p2Email = ctx.params.p2Email;
		user.p2FirstName = ctx.params.p2FirstName;
		user.p2LastName = ctx.params.p2LastName;
		user.accountStatus = ctx.params.accountStatus || user.accountStatus;
		return user;
	}

	@Method
	public static setAddressDetails(ctx: ContextWrapper, address: Address): Address {
		// address.userId = ctx.params.userId;
		address.zipCode = ctx.params.zipCode;
		address.state = ctx.params.state;
		address.createdBy = ctx.meta.userId || Constants.MY_PROFESSOR_BOT;
		return address;
	}

	@Method
	public static async setUserAccess(ctx: ContextWrapper, userId: string, userAccess: UserAccess): Promise<UserAccess> {
		/* @Question: do we need to hash the password ? */
		userAccess.createdBy = userId.toString();
		userAccess.userId = userId;
		userAccess.password = await LoginHelper.encryptPassword(ctx.params.password);
		return userAccess;
	}

	@Method
	public static setUserRoleDetails(ctx: ContextWrapper, userRole: UserRole) {
		userRole.userId = ctx.params.userId;
		userRole.universityId = ctx.params.universityId;
		userRole.collegeId = ctx.params.collegeId;
		userRole.roleId = ctx.params.roleId;
		return userRole;
	}

	@Method
	public static async getGeneralStudentRole(ctx: ContextWrapper) {
		return await UserDao.getGenericResource(ctx, Role, { where: { name: Constants.Roles.GENERAL_STUDENT } });
	}

	@Method
	public static async setUserProfileInfo(ctx: ContextWrapper, user: User) {
		user.firstName = ctx.params.firstName || user.firstName;
		user.lastName = ctx.params.lastName || user.lastName;
		user.profilePic = await AwsHelper.getS3Url(ctx, appConfig.aws.bucketName, ctx.params.profilePic, Constants.FileTypes.images, 100);
		return user;
	}

	@Method
	public static async handleUserBranch(ctx: ContextWrapper, userId: string) {
		let userBranch: UserBranch = await UserDao.getGenericResource(ctx, UserBranch, { where: { userId: userId } });

		if (userBranch) {
			ErrorHelper.throwError(Messages.USER_ALREADY_ASSIGNED_WITH_BRANCH, 400, Constants.SYSTEM_EXCEPTION_TYPES.UNAUTHORIZED);
		}

		// set userGrade details
		userBranch = BranchHelper.setUserBranchDetails(ctx, userBranch ? userBranch : new UserBranch(), userId);
		userBranch = await UserDao.saveGenericResource(ctx, userBranch);

		return userBranch;
	}

	@Method
	public static async createPartialUser(ctx: ContextWrapper) {
		// save userInfo
		let newUser: User = UserHelper.setUserDetails(ctx, new User());
		newUser.accountStatus = UserStatusType.Active;
		newUser = await BaseDao.saveGenericResource(ctx, newUser);

		// save user access
		const userAccess: UserAccess = await UserHelper.setUserAccess(ctx, newUser.id, new UserAccess());
		await BaseDao.saveGenericResource(ctx, userAccess);

		const user = BaseDto.transformResource(newUser, new UserMapper());
		let userRoleParams = { userId: newUser.id, roleId: ctx.params.roleId };
		const roleName = ctx.params.roleName;

		switch (roleName) {
			case UserRoleType.CollegeAdmin:
			case UserRoleType.Professor:
			case UserRoleType.Student:
				userRoleParams = {
					...userRoleParams,
					...{
						collegeId: ctx.params.collegeId,
						universityId: ctx.params.universityId,
						branchId: ctx.params.branchId,
						semesterId: ctx.params.semesterId,
					},
				};
				break;
			case UserRoleType.GeneralStudent:
				userRoleParams = { ...userRoleParams, ...{ universityId: ctx.params.universityId } };
				break;
			case UserRoleType.CEO:
			case UserRoleType.SuperAdmin:
			case UserRoleType.ChannelPartner:
			default:
				userRoleParams = userRoleParams;
				break;
		}

		//TODO: handle it gracefully
		if (roleName != UserRoleType.CollegeAdmin || roleName != UserRoleType.GeneralStudent) {
			// save address details
			ctx.params.userId = newUser.id;
			let newAddress: Address = UserHelper.setAddressDetails(ctx, new Address());
			newAddress = await BaseDao.saveGenericResource(ctx, newAddress);
			newUser.addressId = newAddress.id;
			newUser = await BaseDao.saveGenericResource(ctx, newUser);
		}

		await ctx.call('user.assignUserRole', { ...userRoleParams });

		return { user };
	}

	@Method
	public static async createCollegeStudent(ctx: ContextWrapper) {
		// create user
		const userInfo: { user: UserMapper; address: UserAddressMapper } = await ctx.call('user.createUser', {
			...ctx.params,
			...{ markAsActive: true },
		});

		// create user role
		await ctx.call('user.assignUserRole', {
			userId: userInfo.user.id,
			universityId: ctx.params.universityId,
			collegeId: ctx.params.collegeId,
			roleId: ctx.params.roleId,
		});

		// create user branch
		await UserHelper.handleUserBranch(ctx, userInfo.user.id);

		// trigger user analytics
		ctx.broadcast('analytics.add', {
			universityId: ctx.params.universityId,
			branchId: ctx.params.branchId,
			semesterId: ctx.params.semesterId,
			collegeId: ctx.params.collegeId,
			userId: userInfo.user.id,
		});

		return userInfo;
	}
}
