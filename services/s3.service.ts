import { ContextWrapper } from '@Helpers/molecular-helper';
import { Action, Method } from 'moleculer-decorators';
import AWS, { AWSError } from 'aws-sdk';
import SystemHelper from '@Helpers/system-helpers';
import { ErrorHelper } from '@Helpers/error-helper';
import { Messages } from '@Utility/Messages';
import { Constants } from '@Utility/constants';
import AwsHelper from '@Helpers/aws-helper';
import AuthSchema from './auth';
const appConfig = require('../app-config.json');

export default class S3Service extends AuthSchema {
	public name: string = 's3';

	@Action({
		params: {
			fileData: { type: 'string' },
			fileName: { type: 'string', optional: true },
			bucketName: { type: 'string' },
			viewableInline: { type: 'boolean' },
			contentType: { type: 'string', optional: true },
		},
		auth: {
			ignoreAuthToken: true,
		},
	})
	public async upload(ctx: ContextWrapper): Promise<string> {
		const uploadObject: AWS.S3.Types.PutObjectRequest = {
			Bucket: ctx.params.bucketName,
			Key: ctx.params.fileName || SystemHelper.getUUID(),
			Body: Buffer.from(ctx.params.fileData, 'base64'),
			ContentType: ctx.params.contentType,
			ACL: 'public-read',
			ContentDisposition: 'inline',
		};

		let s3response: AWS.S3.ManagedUpload.SendData = { Location: '', ETag: '', Bucket: '', Key: '' };

		try {
			s3response = await this.getS3Config().upload(uploadObject).promise();
		} catch (err) {
			console.log(err);
		}

		return s3response.Location;
	}

	@Action({
		params: {
			contentType: { type: 'string', optional: true },
		},
		auth: {
			ignoreAuthToken: true,
		},
	})
	public async fileUpload(ctx: ContextWrapper): Promise<string | boolean> {
		const uploadObject: AWS.S3.Types.PutObjectRequest = {
			Bucket: appConfig.aws.bucketName,
			Key: `/activities/video/${SystemHelper.getUUID()}-${ctx.meta.filename.replace(/\s/g, '')}`.toLocaleLowerCase(),
			Body: ctx.params,
			ContentType: ctx.meta.mimetype,
			ACL: 'public-read',
			ContentDisposition: 'inline',
		};

		let s3response: AWS.S3.ManagedUpload.SendData = { Location: '', ETag: '', Bucket: '', Key: '' };

		try {
			s3response = await this.getS3Config().upload(uploadObject).promise();
		} catch (err) {
			console.log(err);
		}
		return s3response.Location;
	}

	@Action({
		params: {
			s3Url: { type: 'string' },
			bucketName: { type: 'string' },
		},
	})
	public async deleteObject(ctx: ContextWrapper) {
		const s3UrlParams: string = ctx.params.s3Url.split('/');
		const key: string = s3UrlParams[s3UrlParams.length - 1];
		const deleteObject: AWS.S3.Types.DeleteObjectRequest = { Bucket: ctx.params.bucketName, Key: key };

		// check if s3 object exists or not
		await this.getS3Config()
			.headObject(deleteObject)
			.promise()
			.then(
				async () => {
					// delete object
					await this.getS3Config().deleteObject(deleteObject).promise();
				},
				(err: AWSError) => {
					// throw error
					err.code == 'NotFound'
						? ErrorHelper.throwError(Messages.S3_FILE_NOT_EXISTS, 404, Constants.SYSTEM_EXCEPTION_TYPES.DATA_NOT_FOUND, { ...err })
						: ErrorHelper.throwError(err.message, 404, Constants.SYSTEM_EXCEPTION_TYPES.EXTERNAL_SERVICES_ERROR, { ...err });
				},
			);
	}

	@Action({
		params: {
			s3Url: { type: 'string' },
			bucketName: { type: 'string' },
			expiryInSec: { type: 'number' },
		},
	})
	public async getSignedUrl(ctx: ContextWrapper): Promise<string | void> {
		const s3UrlParams: string = ctx.params.s3Url.split('/');
		const key: string = s3UrlParams[s3UrlParams.length - 1];
		return await this.getS3Config().getSignedUrlPromise('getObject', { Bucket: ctx.params.bucketName, Key: key, Expires: +ctx.params.expiryInSec });
	}

	@Method
	private getS3Config(): AWS.S3 {
		if (!this.s3) {
			this.s3 = new AWS.S3(AwsHelper.getAWSCreds());
		}
		return this.s3;
	}
}

module.exports = new S3Service();
