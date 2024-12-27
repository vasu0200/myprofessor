import AwsHelper from '@Helpers/aws-helper';
import { ContextWrapper } from '@Helpers/molecular-helper';
import SystemHelper from '@Helpers/system-helpers';
import { Chapter } from '@Models/chapter';
import { TargetSourceType } from '@Utility/enum';
import { Method } from 'moleculer-decorators';
const appConfig = require('../../../app-config.json');

export class ChapterHelper {
	@Method
	public static async setChapterDetails(ctx: ContextWrapper, target: Chapter) {
		target.name = ctx.params.name;
		target.idx = ctx.params.idx;
		ctx.params.fileName = `Universities/university-${ctx.params.universityId}/branches/branch-${ctx.params.branchId}/semesters/semester-${
			ctx.params.semesterId
		}/subject/subject-${ctx.params.subjectId}/chapters/chapter-${target.id}/
			${ctx.params.fileName ? ctx.params.fileName : SystemHelper.getUUID()}`;

		target.image = await AwsHelper.getS3Url(ctx, appConfig.aws.bucketName, ctx.params.image, [], 100);
		target.description = ctx.params.description;
		target.subjectId = ctx.params.subjectId;
		target.isDefault = ctx.params.isDefault ? ctx.params.isDefault : false;
		target.targetSource = ctx.params.targetSource || TargetSourceType.Admin;
		return target;
	}
}
