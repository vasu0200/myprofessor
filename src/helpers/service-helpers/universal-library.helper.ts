import AwsHelper from '@Helpers/aws-helper';
import { ContextWrapper } from '@Helpers/molecular-helper';
import SystemHelper from '@Helpers/system-helpers';
import { UniversalSubject } from '@Models/universal-subject';
import { UniversalTopic } from '@Models/universal-topic';
import { Constants } from '@Utility/constants';
import { Method } from 'moleculer-decorators';
const appConfig = require('../../../app-config.json');

export class UniversalLibraryHelper {
	@Method
	public static async setSubjectDetails(ctx: ContextWrapper, target: UniversalSubject): Promise<UniversalSubject> {
		target.name = ctx.params.name;
		target.description = ctx.params.description;

		// prepare s3 path url
		ctx.params.fileName = `Universal-library/Universal-Subjects/universal-subject-${target.id}/${
			ctx.params.fileName ? ctx.params.fileName : SystemHelper.getUUID()
		}`;

		target.image = await AwsHelper.getS3Url(ctx, appConfig.aws.bucketName, ctx.params.image, Constants.FileTypes.images, 2);
		return target;
	}

	@Method
	public static async setTopicDetails(ctx: ContextWrapper, target: UniversalTopic): Promise<UniversalTopic> {
		target.topicName = ctx.params.name;
		target.topicDesc = ctx.params.description;
		target.topicCode = ctx.params.code;
		target.dependencyTopics = ctx.params.dependencyTopics;

		// prepare s3 path url
		ctx.params.fileName = `Universal-library/Universal-Subjects/universal-subject-${ctx.params.subjectId}/universal-topics/universal-topic-${
			target.id
		}/${ctx.params.fileName ? ctx.params.fileName : SystemHelper.getUUID()}`;

		target.image = await AwsHelper.getS3Url(ctx, appConfig.aws.bucketName, ctx.params.image, Constants.FileTypes.images, 2);
		target.subjectId = ctx.params.subjectId;

		return target;
	}
}
