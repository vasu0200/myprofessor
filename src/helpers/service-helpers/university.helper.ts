import AwsHelper from '@Helpers/aws-helper';
import { ContextWrapper } from '@Helpers/molecular-helper';
import SystemHelper from '@Helpers/system-helpers';
import { University } from '@Models/university';
import { Method } from 'moleculer-decorators';
const appConfig = require('../../../app-config.json');

export class UniversityHelper {
	@Method
	public static async setUniversityDetails(ctx: ContextWrapper, target: University): Promise<University> {
		target.name = ctx.params.name;
		target.description = ctx.params.description;

		// s3 file path
		ctx.params.fileName = `University/university-${target.id}/${ctx.params.fileName ? ctx.params.fileName : SystemHelper.getUUID()}`;

		target.image = await AwsHelper.getS3Url(ctx, appConfig.aws.bucketName, ctx.params.image, [], 100);
		return target;
	}
}
