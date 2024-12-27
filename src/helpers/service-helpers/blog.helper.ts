import { Method } from 'moleculer-decorators';
import { ContextWrapper } from '@Helpers/molecular-helper';
import { Blog } from '@Models/blogs';
import AwsHelper from '@Helpers/aws-helper';
const appConfig = require('../../../app-config.json');

export class BlogHelper {
	@Method
	public static async setBlog(ctx: ContextWrapper, target: Blog) {
		target.title = ctx.params.title;
		target.description = ctx.params.description;
		target.image = ctx.params.image ? await AwsHelper.getS3Url(ctx, appConfig.aws.bucketName, ctx.params.image, [], 100) : '';
		target.idx = ctx.params.idx;
		return target;
	}
}
