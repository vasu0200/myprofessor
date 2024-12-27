import AwsHelper from '@Helpers/aws-helper';
import { ContextWrapper } from '@Helpers/molecular-helper';
import SystemHelper from '@Helpers/system-helpers';
import { Topic } from '@Models/topic';
import { TargetSourceType } from '@Utility/enum';
import { Method } from 'moleculer-decorators';
const appConfig = require('../../../app-config.json');

export class TopicHelper {
	@Method
	public static async setTopicDetails(ctx: ContextWrapper, target: Topic) {
		target.name = ctx.params.name;
		target.idx = ctx.params.idx;

		//TODO: need to write wrapper for college journey
		ctx.params.fileName = `Universities/university-${ctx.params.universityId}/branches/branch-${ctx.params.branchId}/semesters/semester-${
			ctx.params.semesterId
		}/subject/subject-${ctx.params.subjectId}/chapters/chapter-${ctx.params.chapterId}/topics/topic-${target.id}/
			${ctx.params.fileName ? ctx.params.fileName : SystemHelper.getUUID()}`;

		target.image = await AwsHelper.getS3Url(ctx, appConfig.aws.bucketName, ctx.params.image, [], 100);
		target.description = ctx.params.description;
		target.code = ctx.params.code;
		target.chapterId = ctx.params.chapterId;
		target.universalTopicId = ctx.params.universalTopicId;
		target.isDefault = ctx.params.isDefault ? ctx.params.isDefault : false;
		target.targetSource = ctx.params.targetSource || TargetSourceType.Admin;
		return target;
	}
}
