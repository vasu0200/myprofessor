import AwsHelper from '@Helpers/aws-helper';
import { ContextWrapper } from '@Helpers/molecular-helper';
import SystemHelper from '@Helpers/system-helpers';
import { CollegeSemester } from '@Models/college-semester';
import appConfig from '../../../app-config.json';
import { Semester } from '@Models/semester';
import { Method } from 'moleculer-decorators';

export class SemesterHelper {
	@Method
	public static async setSemesterDetails(ctx: ContextWrapper, target: Semester): Promise<Semester> {
		target.name = ctx.params.name;

		//TODO: need to write wrapper for college journey
		ctx.params.fileName = `University/university-${ctx.params.universityId}/branches/branch-${ctx.params.branchId}/semesters/semester-${
			ctx.params.fileName ? ctx.params.fileName : SystemHelper.getUUID()
		}`;

		target.image = await AwsHelper.getS3Url(ctx, appConfig.aws.bucketName, ctx.params.image, [], 100);
		target.branchId = ctx.params.branchId;
		target.index = ctx.params.index;
		target.isCustom = ctx.params.isCustom || !target.isCustom ? false : true;
		return target;
	}

	@Method
	public static setCollegeSemesterDetails(ctx: ContextWrapper, target: CollegeSemester, semesterId: string) {
		target.branchId = ctx.params.branchId;
		target.collegeId = ctx.params.collegeId;
		target.semesterId = semesterId;
		return target;
	}
}
