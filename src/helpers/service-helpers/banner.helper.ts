import { Method } from 'moleculer-decorators';
import { ContextWrapper } from '@Helpers/molecular-helper';
import { Banner } from '@Models/banner';
import AwsHelper from '@Helpers/aws-helper';
const appConfig = require('../../../app-config.json');

export class BannerHelper {
	@Method
	public static async setBanner(ctx: ContextWrapper, target: Banner) {
		target.index = ctx.params.index;
		target.image = ctx.params.image ? await AwsHelper.getS3Url(ctx, appConfig.aws.bucketName, ctx.params.image, [], 100) : '';
		return target;
	}
}
