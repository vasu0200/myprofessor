import { UserDao } from '@Dao/user.dao';
import { ErrorHelper } from '@Helpers/error-helper';
import { UserHelper } from '@Helpers/service-helpers/user.helper';
import { ImportEntity } from '@Models/import';
import { Role } from '@Models/role';
import { UserBranch } from '@Models/user-branch';
import { UserRole } from '@Models/user-role';
import { ImportType, OtpSourceType, UserRoleType, UserStatusType } from '@Utility/enum';
import { Messages } from '@Utility/Messages';
import { Action } from 'moleculer-decorators';
import { BaseDao } from 'src/dao/base.dao';
import { BaseDto } from 'src/dto/base.dto';
import { UserAddressMapper, UserDto, UserMapper, UserSearchViewMapper, UserParentViewMapper } from 'src/dto/user.dto';
import { ContextWrapper } from 'src/helpers/molecular-helper';
import { Address } from 'src/model/address';
import { User } from 'src/model/user';
import { UserAccess } from 'src/model/user-access';
import { Constants } from 'src/utility/constants';
import AuthSchema from './auth';
import async from 'async';
import SystemHelper from '@Helpers/system-helpers';
import { Otp } from '@Models/otp';
import { College } from '@Models/college';
const appConfig = require('../app-config.json');

export default class UserService extends AuthSchema {
	public static USER_PARAMS = {
		firstName: Constants.ParamValidator.name,
		lastName: Constants.ParamValidator.name,
		email: { type: 'email' },
		mobile: { type: 'string', max: 20 },
		gender: { type: 'string' },
		state: { type: 'string' },
		zipCode: { type: 'string' },
		password: { type: 'string', min: 3, max: 16, optional: true }, // @Question: password criteria
		confirmPassword: { type: 'string', min: 3, max: 16, optional: true },
		roleId: { type: 'string', optional: true },
		role: { type: 'string', optional: true },
		dob: { type: 'string', optional: true },
		accountStatus: { type: 'string', optional: true },
		p1FirstName: { type: 'string', optional: true },
		p1LastName: { type: 'string', optional: true },
		p1Email: { type: 'string', optional: true },
		p2FirstName: { type: 'string', optional: true },
		p2LastName: { type: 'string', optional: true },
		p2Email: { type: 'string', optional: true },
		inviteCode: { type: 'string', optional: true },
		markAsActive: { type: 'boolean', optional: true },
	};
	public name: string = 'user';

	@Action({
		params: {
			...UserService.USER_PARAMS,
		},
		auth: {
			ignoreAuthToken: true,
		},
	})
	public async createUser(ctx: ContextWrapper): Promise<{ user: UserMapper; address: UserAddressMapper }> {
		// get role information
		if (ctx.params.role) {
			const role: Role = await BaseDao.getGenericResource(ctx, Role, { where: { name: ctx.params.role } });
			ctx.params.roleId = role.id;
		}

		// save userInfo
		let newUser: User = UserHelper.setUserDetails(ctx, new User());

		// save address details
		ctx.params.userId = newUser.id;
		let newAddress: Address = UserHelper.setAddressDetails(ctx, new Address());
		newAddress = await BaseDao.saveGenericResource(ctx, newAddress);

		if (ctx.params.markAsActive) {
			newUser.accountStatus = UserStatusType.Active;
		}

		newUser.addressId = newAddress.id;
		newUser = await BaseDao.saveGenericResource(ctx, newUser);

		// save user access
		const userAccess: UserAccess = await UserHelper.setUserAccess(ctx, newUser.id, new UserAccess());
		await BaseDao.saveGenericResource(ctx, userAccess);

		const user = BaseDto.transformResource(newUser, new UserMapper());
		const address = BaseDto.transformResource(newAddress, new UserAddressMapper());

		// event handler to check invite workflow
		if (ctx.params.inviteCode) {
			ctx.broadcast('user.checkInviteCode', {
				inviteCode: ctx.params.inviteCode,
				userId: user.id,
			});
		}

		return { user, address };
	}

	@Action({
		params: {
			searchValue: { type: 'string', optional: true },
			userRoles: { type: 'string', optional: true },
		},
	})
	public async searchUsers(ctx: ContextWrapper) {
		//TODO: clean this for professor search
		if (ctx.params.userRoles === UserRoleType.Professor) {
			const users = await UserDao.getCollegeProfessors(ctx, ctx.params.searchValue, ctx.params.userRoles);
			users.items = UserDto.transformResources(users.items, new UserSearchViewMapper());
			return users;
		}

		const users = await UserDao.getUsers(ctx, ctx.params.searchValue, ctx.params.userRoles);
		users.items = UserDto.transformResources(users.items, new UserSearchViewMapper());
		return users;
	}

	@Action({
		params: {
			...UserService.USER_PARAMS,
			userId: { type: 'string' },
			roleId: { type: 'string' },
		},
	})
	public async updateUser(ctx: ContextWrapper): Promise<{ user: UserMapper; address: UserAddressMapper }> {
		let dbUser: User = await UserDao.getGenericResource(ctx, User, { where: { id: ctx.params.userId } });

		if (!dbUser) {
			ErrorHelper.throwError(Messages.INVALID_USER, 400, Constants.SYSTEM_EXCEPTION_TYPES.DATA_NOT_FOUND);
		}

		// save userInfo
		dbUser = UserHelper.setUserDetails(ctx, dbUser);

		// save address details
		ctx.params.userId = dbUser.id;
		let dbAddress: Address = await UserDao.getGenericResource(ctx, Address, { where: { id: dbUser.addressId } });
		dbAddress = UserHelper.setAddressDetails(ctx, dbAddress ? dbAddress : new Address());
		dbAddress = await BaseDao.saveGenericResource(ctx, dbAddress);
		dbUser.addressId = dbAddress.id;
		dbUser = await BaseDao.saveGenericResource(ctx, dbUser);

		// save user access
		if (ctx.params.password && ctx.params.confirmPassword) {
			const dbUserAccess: UserAccess = await UserDao.getGenericResource(ctx, UserAccess, { where: { userId: dbUser.id } });
			const userAccess: UserAccess = await UserHelper.setUserAccess(ctx, dbUser.id, dbUserAccess || new UserAccess());
			await BaseDao.saveGenericResource(ctx, userAccess);
		}

		const user = BaseDto.transformResource(dbUser, new UserMapper());
		// const role = BaseDto.transformResource(await dbUser.role, new UserRoleMapper());
		const address = BaseDto.transformResource(dbAddress, new UserAddressMapper());

		return { user, address };
	}

	@Action({
		params: {
			firstName: { type: 'string', optional: true },
			lastName: { type: 'string', optional: true },
			email: { type: 'email' },
			password: { type: 'string' },
			roleId: { type: 'string' },
			roleName: { type: 'string' },
			collegeId: { type: 'string', optional: true },
			universityId: { type: 'string', optional: true },
		},
	})
	public async createPartialUser(ctx: ContextWrapper) {
		return await UserHelper.createPartialUser(ctx);
	}

	@Action({
		params: {
			firstName: { type: 'string', optional: true },
			lastName: { type: 'string', optional: true },
			email: { type: 'email' },
			password: { type: 'string' },
			roleId: { type: 'string' },
			roleName: { type: 'string' },
			collegeId: { type: 'string', optional: true },
			universityId: { type: 'string', optional: true },
		},
		auth: {
			ignoreAuthToken: true,
		},
	})
	public async createPartialUserNoChecks(ctx: ContextWrapper) {
		return await UserHelper.createPartialUser(ctx);
	}

	@Action({
		params: {
			firstName: { type: 'string', optional: true },
			lastName: { type: 'string', optional: true },
			email: { type: 'email' },
			password: { type: 'string' },
			roleId: { type: 'string' },
			roleName: { type: 'string' },
			collegeId: { type: 'string', optional: true },
			universityId: { type: 'string', optional: true },
		},
	})
	public async createPartialUserNoCheck(ctx: ContextWrapper) {
		return UserHelper.createPartialUser(ctx);
	}

	@Action({
		params: {
			email: { type: 'email' },
			firstName: { type: 'string', optional: true },
			lastName: { type: 'string', optional: true },
		},
		auth: {
			ignoreAuthToken: true,
		},
	})
	public async createSSOUser(ctx: ContextWrapper) {
		// get general student role
		const dbRole: Role = await BaseDao.getGenericResource(ctx, Role, { where: { name: Constants.Roles.GENERAL_STUDENT } });

		ctx.params.roleId = dbRole.id;
		ctx.params.accountStatus = UserStatusType.AccountSetupInProgress;

		let newUser: User = UserHelper.setUserDetails(ctx, new User());
		newUser = await BaseDao.saveGenericResource(ctx, newUser);
		const user = BaseDto.transformResource(newUser, new UserMapper());
		// const role = BaseDto.transformResource(await newUser.role, new UserRoleMapper());

		return { user };
	}

	@Action({
		params: {
			userId: { type: 'string' },
		},
	})
	public async getUser(ctx: ContextWrapper) {
		const dbUser = await UserDao.getUser(ctx, ctx.params.userId);

		if (!dbUser) {
			ErrorHelper.throwError(Messages.INVALID_USER, 400, Constants.SYSTEM_EXCEPTION_TYPES.DATA_NOT_FOUND);
		}
		const {
			roleId,
			roleName,
			roleDescription,
			universityId,
			collegeId,
			branchId,
			semesterId,
			sectionId,
			sectionName,
			universityName,
			collegeName,
			branchName,
			semesterName,
			...rest
		} = dbUser;

		const response = {
			role: { roleId, roleName, roleDescription },
			userInfo: { ...rest },
			userOrg: {
				roleId,
				roleName,
				roleDescription,
				universityId,
				collegeId,
				branchId,
				semesterId,
				sectionId,
				sectionName,
				universityName,
				collegeName,
				branchName,
				semesterName,
			},
		};
		return response;
	}

	@Action({
		params: {
			userId: { type: 'string' },
		},
	})
	public async deleteUser(ctx: ContextWrapper): Promise<boolean> {
		const user: User = await UserDao.getGenericResource(ctx, User, { where: { id: ctx.params.userId } });

		if (!user) {
			ErrorHelper.throwError(Messages.INVALID_USER, 400, Constants.SYSTEM_EXCEPTION_TYPES.DATA_NOT_FOUND);
		}

		// soft delete user
		await UserDao.softDeleteResource(ctx, user);

		return true;
	}

	@Action({
		params: {
			userId: { type: 'string' },
			p1FirstName: { type: 'string' },
			p1LastName: { type: 'string' },
			p1Email: { type: 'email' },
			p2FirstName: { type: 'string' },
			p2LastName: { type: 'string' },
			p2Email: { type: 'email' },
		},
	})
	public async addUserParentInfo(ctx: ContextWrapper): Promise<UserParentViewMapper> {
		let user: User = await UserDao.getGenericResource(ctx, User, { where: { id: ctx.params.userId } });

		if (!user) {
			ErrorHelper.throwError(Messages.INVALID_USER, 400, Constants.SYSTEM_EXCEPTION_TYPES.DATA_NOT_FOUND);
		}

		user = UserHelper.setUserDetails(ctx, user);
		user = await UserDao.saveGenericResource(ctx, user);
		return UserDto.transformResource(user, new UserParentViewMapper());
	}

	@Action({
		params: {
			userId: { type: 'string' },
			roleId: { type: 'string' },
			universityId: { type: 'string', optional: true },
			collegeId: { type: 'string', optional: true },
		},
		auth: {
			ignoreAuthToken: true,
		},
	})
	public async assignUserRole(ctx: ContextWrapper) {
		let userRole: UserRole = await UserDao.getGenericResource(ctx, UserRole, { where: { userId: ctx.params.userId, roleId: ctx.params.roleId } });

		if (userRole) {
			return;
		}

		// set userRole Info
		userRole = UserHelper.setUserRoleDetails(ctx, userRole ? userRole : new UserRole());
		userRole.role = userRole.role;

		return await UserDao.saveGenericResource(ctx, userRole);
	}

	@Action({
		params: {
			universityId: { type: 'string' },
			branchId: { type: 'string' },
			semesterId: { type: 'string' },
			collegeId: { type: 'string', optional: true },
			userId: { type: 'string' },
		},
		auth: {
			ignoreAuthToken: true,
		},
	})
	public async setUpAccount(ctx: ContextWrapper) {
		let user: User = await UserDao.getGenericResource(ctx, User, { where: { id: ctx.params.userId } });

		const userBranch: UserBranch = await UserHelper.handleUserBranch(ctx, user.id);

		const generalStudentRole: Role = await UserHelper.getGeneralStudentRole(ctx);

		// assign user role
		await ctx.call('user.assignUserRole', {
			userId: ctx.params.userId,
			roleId: generalStudentRole.id,
			universityId: ctx.params.universityId,
			branchId: ctx.params.branchId,
			semesterId: ctx.params.semesterId,
			collegeId: ctx.params.collegeId,
		});

		user.accountStatus = UserStatusType.Active;
		user = await BaseDao.saveGenericResource(ctx, user);

		// trigger user analytics
		ctx.broadcast('analytics.add', {
			universityId: userBranch.universityId,
			branchId: userBranch.branchId,
			semesterId: userBranch.semesterId,
			collegeId: userBranch.collegeId,
			userId: ctx.params.userId,
		});

		// get email body and subject
		const { messageBody, messageSubject } = SystemHelper.handleEmailAndSmsMessageBody(
			OtpSourceType.Email,
			{ ...appConfig.emailTemplate },
			Constants.EmailCodes.MY_PROFESSOR_WELCOME_EMAIL,
		);

		// send email
		await ctx.broker.call('email.sendEmail', { email: user.email, subject: messageSubject, body: messageBody });

		return BaseDto.transformResource(user, new UserMapper());
	}

	@Action({
		params: {
			userId: { type: 'string' },
		},
	})
	public async getAccountStatus(ctx: ContextWrapper) {
		const user: User = await UserDao.getGenericResource(ctx, User, { where: { id: ctx.params.userId } });

		if (!user) {
			ErrorHelper.throwError(Messages.INVALID_USER, 400, Constants.SYSTEM_EXCEPTION_TYPES.DATA_NOT_FOUND);
		}

		return BaseDto.transformResource(user, new UserMapper());
	}

	@Action({
		params: {
			userId: { type: 'string' },
			firstName: { type: 'string', optional: true },
			lastName: { type: 'string', optional: true },
			profilePic: { type: 'string', optional: true },
		},
	})
	public async update(ctx: ContextWrapper) {
		let user: User = await UserDao.getGenericResource(ctx, User, { where: { id: ctx.params.userId } });

		if (!user) {
			ErrorHelper.throwError(Messages.INVALID_USER, 400, Constants.SYSTEM_EXCEPTION_TYPES.DATA_NOT_FOUND);
		}

		user = await UserHelper.setUserProfileInfo(ctx, user);
		user = await UserDao.saveGenericResource(ctx, user);
		return BaseDto.transformResource(user, new UserMapper());
	}

	@Action({
		params: {
			email: { type: 'email' },
			password: { type: 'string' },
			firstName: { type: 'string', optional: true },
			lastName: { type: 'string', optional: true },
			gender: { type: 'string', optional: true },
			mobileNumber: { type: 'string', optional: true },
			roleName: { type: 'string' },
			collegeId: { type: 'string', optional: true },
			universityId: { type: 'string', optional: true },
		},
		auth: {
			ignoreAuthToken: true,
		},
	})
	public async createUserWithRole(ctx: ContextWrapper) {
		const role: Role = await UserDao.getGenericResource(ctx, Role, { where: { name: ctx.params.roleName } });

		if (!role) {
			ErrorHelper.throwError(Messages.INVALID_ROLE, 400, Constants.SYSTEM_EXCEPTION_TYPES.DATA_NOT_FOUND);
		}

		return await ctx.call('user.createPartialUserNoChecks', {
			firstName: ctx.params.firstName,
			lastName: ctx.params.lastName,
			gender: ctx.params.gender,
			mobileNumber: ctx.params.mobileNumber,
			email: ctx.params.email,
			password: ctx.params.password,
			roleId: role.id,
			roleName: role.name,
			collegeId: ctx.params.collegeId,
			universityId: ctx.params.universityId,
			zipCode: ctx.params.zipCode,
			state: ctx.params.state,
			mobile: ctx.params.mobile, // TODO: cleanup needed
		});
	}

	@Action({
		params: {
			universityId: { type: 'string' },
			collegeId: { type: 'string' },
			branchId: { type: 'string' },
			sectionId: { type: 'string' },
			semesterId: { type: 'string' },
			...UserService.USER_PARAMS,
		},
	})
	public async createCollegeStudent(ctx: ContextWrapper) {
		// get role information
		if (ctx.params.role) {
			const role: Role = await BaseDao.getGenericResource(ctx, Role, { where: { name: ctx.params.role } });
			ctx.params.roleId = role.id;
		}

		if (ctx.params.collegeId) {
			const users: any = await UserDao.getUsersCountByCollege(ctx);
			const collegeStudents: any = users.find((user) => user.roleName === 'Student');
			const college: any = await UserDao.getGenericResource(ctx, College, { where: { id: ctx.params.collegeId } });
			if (collegeStudents && collegeStudents?.roleCount >= college.noOfUsers) {
				ErrorHelper.throwError(Messages.COLLEGE_MAX_STUDENTS_LIMIT, 400, Constants.SYSTEM_EXCEPTION_TYPES.VALIDATION_ERROR);
			}
		}

		return await UserHelper.createCollegeStudent(ctx);
	}

	@Action({
		params: {
			universityId: { type: 'string' },
			collegeId: { type: 'string' },
			branchId: { type: 'string' },
			sectionId: { type: 'string' },
			semesterId: { type: 'string' },
			...UserService.USER_PARAMS,
		},
		auth: {
			ignoreAuthToken: true,
		},
	})
	public async createCollegeStudentNoChecks(ctx: ContextWrapper) {
		return await UserHelper.createCollegeStudent(ctx);
	}

	@Action({
		params: {
			collegeId: { type: 'string' },
			roleName: { type: 'string', optional: true },
			searchValue: { type: 'string', optional: true },
			offset: { type: 'number', optional: true },
			limit: { type: 'number', optional: true },
		},
	})
	public async getCollegeUsers(ctx: ContextWrapper) {
		return await UserDao.getCollegeUsers(ctx, ctx.params.collegeId);
	}

	@Action({
		params: {
			userId: { type: 'string' },
			roleId: { type: 'string' },
		},
	})
	public async deleteUserWithRole(ctx: ContextWrapper) {
		const userRole: UserRole = await UserDao.getGenericResource(ctx, UserRole, { where: { userId: ctx.params.userId, roleId: ctx.params.roleId } });

		if (!userRole) {
			ErrorHelper.throwError(Messages.INVALID_USER, 400, Constants.SYSTEM_EXCEPTION_TYPES.DATA_NOT_FOUND);
		}

		// soft delete user Role
		await UserDao.softDeleteResource(ctx, userRole);

		//soft delete user
		await ctx.call('user.deleteUser', { userId: ctx.params.userId });

		return true;
	}

	@Action({
		params: {
			universityId: { type: 'string' },
			collegeId: { type: 'string' },
			importData: { type: 'array' },
			importType: { type: 'string' },
			fileName: { type: 'string', optional: true },
			branchId: { type: 'string', optional: true },
			sectionId: { type: 'string', optional: true },
			semesterId: { type: 'string', optional: true },
		},
	})
	public async addBulkCollegeUsers(ctx: ContextWrapper) {
		// create import entity
		const importRecord: ImportEntity = await ctx.call('import.createImport', { ...ctx.params });

		// process users
		ctx.broadcast('user.bulkUpload', { ...ctx.params, ...{ importId: importRecord.id } });

		return importRecord;
	}

	@Action({
		params: {},
		auth: {
			ignoreAuthToken: true,
		},
	})
	public async processBulkStudents(ctx: ContextWrapper) {
		const importType: ImportType = ctx.params.importType;
		const importId: string = ctx.params.importId;
		let failedRecords: number = 0;
		let successfulRecords: number = 0;
		const responseData: any[] = [];
		const userEmailsToSend: any[] = [];
		await async.forEachLimit(ctx.params.importData, 1, async (userInfo: any) => {
			try {
				const userPassword = SystemHelper.generatePassword(8);
				switch (importType) {
					case ImportType.Professor:
						userInfo.password = userPassword;
						userInfo.mobile = userInfo?.mobile?.toString();
						userInfo.zipCode = userInfo?.zipCode?.toString();
						await ctx.call('user.createUserWithRole', { ...ctx.params, ...userInfo });
						break;
					case ImportType.Student:
						// get role information
						userInfo.password = userPassword;
						userInfo.mobile = userInfo?.mobile?.toString();
						userInfo.zipCode = userInfo?.zipCode?.toString();
						const role: Role = await BaseDao.getGenericResource(ctx, Role, { where: { name: ImportType.Student } });
						ctx.params.roleId = role.id;
						await ctx.call('user.createCollegeStudentNoChecks', { ...ctx.params, ...userInfo });
						break;
					default:
						ErrorHelper.throwError('Invalid Import Type', 400);
				}
				successfulRecords = successfulRecords + 1;
				userInfo.status = 'success';
				responseData.push(userInfo);
				userEmailsToSend.push({ email: userInfo.email, password: userPassword, mobile: userInfo?.mobile?.toString() });
			} catch (err) {
				failedRecords = failedRecords + 1;
				userInfo.status = 'failed';
				userInfo.reason = err;
				responseData.push(userInfo);
			}
		});

		// update import
		await ctx.call('import.updateImport', {
			failedRecords: failedRecords,
			successfulRecords: successfulRecords,
			importId: importId,
			responseData: responseData,
		});

		await async.forEachLimit(userEmailsToSend, 1, async (u: { email: string; password: string; mobile: string }) => {
			// get email body and subject
			const { messageBody, messageSubject } = SystemHelper.handleEmailAndSmsMessageBody(
				OtpSourceType.Email,
				{ email: u.email, password: u.password, ...appConfig.emailTemplate },
				Constants.EmailCodes.MY_PROFESSOR_CONFIRM_EMAIL,
			);

			// send email
			await ctx.broker.call('email.sendEmail', { email: u.email, subject: messageSubject, body: messageBody });

			if (u.mobile) {
				// get sms body
				const { messageBody } = SystemHelper.handleEmailAndSmsMessageBody(
					OtpSourceType.Mobile,
					{
						UserInfo: `Mobile/Passwd: ${u.mobile}/${u.password}`,
						AppDownloadInfo: `${appConfig.emailTemplate.shortPlayStoreImgUrl} or ${appConfig.emailTemplate.shortAppStoreLink}`,
					},
					Constants.SMSCode.MY_PROFESSOR_WELCOME_MESSAGE,
				);

				// send otp
				await ctx.broker.call('sms.sendSms', {
					smsTemplateId: appConfig.smsGateway.welcomeUserTemplateId,
					mobile: u.mobile,
					message: messageBody,
					subject: Constants.SMSCode.MY_PROFESSOR_WELCOME_MESSAGE,
				});
			}
		});
	}

	@Action({
		params: {
			...UserService.USER_PARAMS,
			universityId: { type: 'string' },
			branchId: { type: 'string' },
			semesterId: { type: 'string' },
			collegeId: { type: 'string', optional: true },
		},
		auth: {
			ignoreAuthToken: true,
		},
	})
	public async newRegistration(ctx: ContextWrapper): Promise<{ user: UserMapper; address: UserAddressMapper }> {
		if (ctx.params.role) {
			const role: Role = await BaseDao.getGenericResource(ctx, Role, { where: { name: ctx.params.role } });
			ctx.params.roleId = role.id;
		}

		ctx.params.accountStatus = UserStatusType.WebAccountSetupInProgress;

		// Save user details
		let newUser: User = UserHelper.setUserDetails(ctx, new User());

		// Save address details
		ctx.params.userId = newUser.id;
		let newAddress: Address = UserHelper.setAddressDetails(ctx, new Address());
		newAddress = await BaseDao.saveGenericResource(ctx, newAddress);

		newUser.addressId = newAddress.id;
		newUser = await BaseDao.saveGenericResource(ctx, newUser);

		// Save user access
		const userAccess: UserAccess = await UserHelper.setUserAccess(ctx, newUser.id, new UserAccess());
		await BaseDao.saveGenericResource(ctx, userAccess);

		const user = BaseDto.transformResource(newUser, new UserMapper());
		const address = BaseDto.transformResource(newAddress, new UserAddressMapper());

		const userBranch: UserBranch = await UserHelper.handleUserBranch(ctx, newUser.id);

		const generalStudentRole: Role = await UserHelper.getGeneralStudentRole(ctx);

		// event handler to check invite workflow
		if (ctx.params.inviteCode) {
			ctx.broadcast('user.checkInviteCode', {
				inviteCode: ctx.params.inviteCode,
				userId: user.id,
			});
		}

		// Assign user role
		await ctx.call('user.assignUserRole', {
			userId: newUser.id,
			roleId: generalStudentRole.id,
			universityId: ctx.params.universityId,
			branchId: ctx.params.branchId,
			semesterId: ctx.params.semesterId,
			collegeId: ctx.params.collegeId,
		});

		// Trigger user analytics
		ctx.broadcast('analytics.add', {
			universityId: userBranch.universityId,
			branchId: userBranch.branchId,
			semesterId: userBranch.semesterId,
			collegeId: userBranch.collegeId,
			userId: ctx.params.userId,
		});

		// generate otp
		const otpResponse: Otp = await ctx.call('otp.generate', { sendTo: ctx.params.email, sourceType: OtpSourceType.Email });

		const mobileOtpResponse: Otp = await ctx.call('otp.generate', { sendTo: ctx.params.mobile, sourceType: OtpSourceType.Mobile });

		// get email body and subject
		const { messageBody: emailBody, messageSubject } = SystemHelper.handleEmailAndSmsMessageBody(
			OtpSourceType.Email,
			{ User: user.email, otp: otpResponse.otp, ...appConfig.emailTemplate },
			Constants.EmailCodes.MY_PROFESSOR_EMAIL_VERIFY,
		);

		// send email
		await ctx.broker.call('email.sendEmail', { email: user.email, subject: messageSubject, body: emailBody });

		// send sms
		const { messageBody } = SystemHelper.handleEmailAndSmsMessageBody(
			OtpSourceType.Mobile,
			{ Otp: mobileOtpResponse.otp },
			Constants.SMSCode.MY_PROFESSOR_FORGOT_PASSWORD,
		);

		// send mobile otp
		await ctx.broker.call('sms.sendSms', {
			smsTemplateId: appConfig.smsGateway.otpRequestTemplateId,
			mobile: newUser.mobileNumber,
			message: messageBody,
			subject: Constants.SMSCode.MY_PROFESSOR_FORGOT_PASSWORD,
		});

		return { user, address };
	}

	@Action({
		params: {
			collegeId: { type: 'string' },
		},
		auth: {
			ignoreAuthToken: true,
		},
	})
	public async getActiveUsersByCollege(ctx: ContextWrapper) {
		return await UserDao.getActiveUsersByCollege(ctx);
	}

	@Action({
		params: {
			emailIds: { type: 'array' },
		},
		auth: {
			ignoreAuthToken: true,
		},
	})
	public async getUsersByEmails(ctx: ContextWrapper) {
		return await UserDao.getUsersByEmails(ctx);
	}

	@Action({
		params: {
			collegeId: { type: 'string' },
		},
		auth: {
			ignoreAuthToken: true,
		},
	})
	public async getUsersCountByCollege(ctx: ContextWrapper) {
		const usersCount = await UserDao.getUsersCountByCollege(ctx);

		const branchesCount: any = await UserDao.getCollegeBranchesCount(ctx);

		return { usersCount, branchesCount };
	}

	@Action({
		params: {
			collegeId: { type: 'string' },
		},
		auth: {
			ignoreAuthToken: true,
		},
	})
	public async getUserCountByBranchesForCollege(ctx: ContextWrapper) {
		const usersCount = await UserDao.getUserCountByBranchesForCollege(ctx);
		const activeUsersCount = await UserDao.getActiveStudentsByCollege(ctx);

		return { usersCount, activeUsersCount };
	}

	@Action({
		params: {
			collegeId: { type: 'string' },
			branchId: { type: 'string' },
			sectionId: { type: 'string' },
			semesterId: { type: 'string' },
		},
		auth: {
			ignoreAuthToken: true,
		},
	})
	public async getProfessorActiveStudents(ctx: ContextWrapper) {
		const totalStudents = await UserDao.getFilterStudents(ctx);
		const activeStudents = await UserDao.getFilterActiveStudents(ctx);
		return { totalStudents, activeStudents };
	}

	@Action({
		params: {
			collegeId: { type: 'string' },
			branchId: { type: 'string' },
			sectionId: { type: 'string' },
			semesterId: { type: 'string' },
		},
		auth: {
			ignoreAuthToken: true,
		},
	})
	public async getStudentTopTopicModules(ctx: ContextWrapper) {
		return await UserDao.getStudentTopTopicModules(ctx);
	}

	@Action({
		params: {
			collegeId: { type: 'string' },
			branchId: { type: 'string' },
			sectionId: { type: 'string' },
			semesterId: { type: 'string' },
		},
		auth: {
			ignoreAuthToken: true,
		},
	})
	public async getStudentActivitiesTimeSpent(ctx: ContextWrapper) {
		return await UserDao.getStudentActivitiesTimeSpent(ctx);
	}

	@Action({
		auth: {
			ignoreAuthToken: true,
		},
	})
	public async getAllUsersCount(ctx: ContextWrapper) {
		return await UserDao.getAllUsersCount(ctx);
	}

	@Action({
		auth: {
			ignoreAuthToken: true,
		},
	})
	public async getAllActiveUsersCount(ctx: ContextWrapper) {
		return await UserDao.getAllActiveUsersCount(ctx);
	}

	@Action({
		params: {
			fromDate: { type: 'string' },
			toDate: { type: 'string' },
		},
		auth: {
			ignoreAuthToken: true,
		},
	})
	public async getRegistrationSubscriptionList(ctx: ContextWrapper) {
		return await UserDao.getRegistrationSubscriptionList(ctx);
	}

	@Action({
		auth: {
			ignoreAuthToken: true,
		},
	})
	public async getPlatformUsageByUsers(ctx: ContextWrapper) {
		return await UserDao.getPlatformUsageByUsers(ctx);
	}

	@Action({
		params: {
			email: { type: 'string' },
			name: { type: 'string' },
			subject: { type: 'string' },
		},
		auth: {
			ignoreAuthToken: true,
		},
	})
	public async contactUsFromWebsite(ctx: ContextWrapper) {
		const { messageBody, messageSubject } = SystemHelper.handleEmailAndSmsMessageBody(
			OtpSourceType.Email,
			{
				name: ctx.params.name,
				email: ctx.params.email,
				mobileNumber: ctx.params.mobileNumber,
				subject: ctx.params.subject,
				message: ctx.params.message,
				...appConfig.emailTemplate,
			},
			Constants.EmailCodes.MY_PROFESSOR_CONTACT_EMAIL,
		);

		// send email
		await ctx.broker.call('email.sendEmail', { email: 'info@myprofessor.in', subject: messageSubject, body: messageBody });
	}
}

module.exports = new UserService();
