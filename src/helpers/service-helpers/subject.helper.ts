import AwsHelper from '@Helpers/aws-helper';
import { ContextWrapper } from '@Helpers/molecular-helper';
import SystemHelper from '@Helpers/system-helpers';
import { Subject } from '@Models/subject';
import { TargetSourceType } from '@Utility/enum';
import { Method } from 'moleculer-decorators';
const appConfig = require('../../../app-config.json');

export class SubjectHelper {
	@Method
	public static async setSubjectDetails(ctx: ContextWrapper, target: Subject) {
		target.name = ctx.params.name;
		target.idx = ctx.params.idx;

		//TODO: need to write wrapper for college journey
		ctx.params.fileName = `Universities/university-${ctx.params.universityId}/branches/branch-${ctx.params.branchId}/semesters/-${
			ctx.params.semesterId
		}/subjects/subject-${target.id}/
			${ctx.params.fileName ? ctx.params.fileName : SystemHelper.getUUID()}`;

		target.image = await AwsHelper.getS3Url(ctx, appConfig.aws.bucketName, ctx.params.image, [], 100);
		target.description = ctx.params.description;
		target.color = ctx.params.color;
		target.semesterId = ctx.params.semesterId;
		target.collegeSemesterId = ctx.params.collegeSemesterId;
		target.isDefault = ctx.params.collegeSemesterId ? false : true;
		target.targetSource = ctx.params.targetSource || TargetSourceType.Admin;
		return target;
	}
}
