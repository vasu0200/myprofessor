import AwsHelper from '@Helpers/aws-helper';
import { ContextWrapper } from '@Helpers/molecular-helper';
import SystemHelper from '@Helpers/system-helpers';
import { Address } from '@Models/address';
import { College } from '@Models/college';
import { CollegeBranch } from '@Models/college-branch';
import { UserBranch } from '@Models/user-branch';
import { Constants } from '@Utility/constants';
import { Method } from 'moleculer-decorators';
import appConfig from '../../../app-config.json';
import moment from 'moment';

export class CollegeHelper {
	@Method
	public static async setCollegeDetails(ctx: ContextWrapper, target: College): Promise<College> {
		target.name = ctx.params.name;
		target.email = ctx.params.email;
		target.phoneNumber = ctx.params.phoneNumber;
		target.mobileNumber = ctx.params.mobileNumber;
		ctx.params.fileName = `Colleges/college-${target.id}/${ctx.params.fileName ? ctx.params.fileName : SystemHelper.getUUID()}`;
		target.logo = await AwsHelper.getS3Url(ctx, appConfig.aws.bucketName, ctx.params.logo, Constants.FileTypes.images, 2);
		target.universityId = ctx.params.universityId;
		target.noOfUsers = ctx.params.noOfUsers;
		target.productType = ctx.params.productType;
		target.fromDate = new Date(moment(ctx.params.fromDate).startOf('day').format());
		target.toDate = new Date(moment(ctx.params.toDate).startOf('day').format());
		return target;
	}

	@Method
	public static handleCollegeBranches(ctx: ContextWrapper, collegeId: string, collegeBranches: CollegeBranch[] = []) {
		let branchesToSave: CollegeBranch[] = [];
		let branchesTodelete: string[] = [];
		const paramBranchIds: string[] = ctx.params.branches;

		if (!collegeBranches.length) {
			paramBranchIds.forEach((e) => {
				branchesToSave.push(this.setCollegeBranchDetails(new CollegeBranch(), collegeId, e));
			});
			return { branchesToSave, branchesTodelete };
		}

		// branches to delete
		branchesTodelete = collegeBranches.filter((e) => paramBranchIds.every((pg) => pg != e.id)).map((e) => e.id);

		// branches to update
		const collegeBranchesToUpdate: CollegeBranch[] = collegeBranches.filter((e) => paramBranchIds.some((pg) => pg == e.id));

		// branches to create
		paramBranchIds
			.filter((pg) => collegeBranchesToUpdate.every((sgu) => sgu.id != pg))
			.forEach((e) => {
				branchesToSave.push(this.setCollegeBranchDetails(new CollegeBranch(), collegeId, e));
			});
		branchesToSave = [...branchesToSave, ...collegeBranchesToUpdate];

		return { branchesToSave, branchesTodelete };
	}

	@Method
	public static setAddressDetails(ctx: ContextWrapper, target: Address): Address {
		target.address1 = ctx.params.address1;
		target.address2 = ctx.params.address2;
		target.city = ctx.params.city;
		target.state = ctx.params.state;
		target.country = ctx.params.country;
		target.zipCode = ctx.params.zipCode;
		target.landMark = ctx.params.landMark;
		return target;
	}

	@Method
	public static setCollegeBranchDetails(target: CollegeBranch, collegeId: string, branchId: string): CollegeBranch {
		target.collegeId = collegeId;
		target.branchId = branchId;
		return target;
	}

	@Method
	public static setUserBranchDetails(ctx: ContextWrapper, userBranch: UserBranch) {
		userBranch.userId = ctx.params.userId;
		userBranch.universityId = ctx.params.universityId;
		userBranch.collegeId = ctx.params.collegeId;
		userBranch.branchId = ctx.params.branchId;
		userBranch.semesterId = ctx.params.semesterId;
		userBranch.sectionId = ctx.params.sectionId;
		userBranch.subjectId = ctx.params.subjectId;
		return userBranch;
	}

	@Method
	public static setUserGradeDetails(ctx: ContextWrapper, userGrade: UserBranch) {
		userGrade.userId = ctx.params.userId;
		userGrade.collegeId = ctx.params.collegeId;
		userGrade.sectionId = ctx.params.sectionId;
		userGrade.branchId = ctx.params.branchId;
		userGrade.subjectId = ctx.params.subjectId;
		userGrade.universityId = ctx.params.universityId;
		userGrade.semesterId = ctx.params.semesterId;
		return userGrade;
	}
}
