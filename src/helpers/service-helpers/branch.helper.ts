import AwsHelper from '@Helpers/aws-helper';
import { ContextWrapper } from '@Helpers/molecular-helper';
import SystemHelper from '@Helpers/system-helpers';
const appConfig = require('../../../app-config.json');
import { Branch } from '@Models/branch';
import { UserBranch } from '@Models/user-branch';
import { Method } from 'moleculer-decorators';

export class BranchHelper {
	@Method
	public static async setBranchDetails(ctx: ContextWrapper, target: Branch): Promise<Branch> {
		target.name = ctx.params.name;

		//TODO: need to write wrapper for college journey
		ctx.params.fileName = `University/university-${ctx.params.universityId}/branches/branch-${target.id}/${
			ctx.params.fileName ? ctx.params.fileName : SystemHelper.getUUID()
		}`;

		target.image = ctx.params.image ? await AwsHelper.getS3Url(ctx, appConfig.aws.bucketName, ctx.params.image, [], 100) : '';
		target.universityId = ctx.params.universityId;
		target.isDefault = ctx.params.isDefault;
		target.index = ctx.params.index;
		return target;
	}

	@Method
	public static setUserBranchDetails(ctx: ContextWrapper, userBranch: UserBranch, userId: string) {
		userBranch.userId = userId;
		userBranch.collegeId = ctx.params.collegeId;
		userBranch.sectionId = ctx.params.sectionId;
		userBranch.semesterId = ctx.params.semesterId;
		userBranch.subjectId = ctx.params.subjectId;
		userBranch.universityId = ctx.params.universityId;
		userBranch.branchId = ctx.params.branchId;
		return userBranch;
	}
}
