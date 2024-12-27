import { ContextWrapper } from './molecular-helper';
import SystemHelper from './system-helpers';
const appConfig = require('../../app-config.json');
import AWS from 'aws-sdk';

export default class AwsHelper {
	constructor() {}

	public static getAWSCreds() {
		const awsInfo = appConfig.aws;
		return {
			accessKeyId: awsInfo.accessKeyId,
			secretAccessKey: awsInfo.secretAccessKey,
			region: 'ap-south-1',
		};
	}

	public static async logToCloudWatch(logEvents: any[], broker: any) {
		// get AWS Creds
		const s3Creds = this.getAWSCreds();

		// add logEvents to cloudWatch
		await new AWS.CloudWatchLogs({
			apiVersion: '2014-03-28',
			...s3Creds,
		})
			.putLogEvents(await this.getLogEventRequestParams(s3Creds, logEvents))
			.promise()
			.then((data: AWS.CloudWatchLogs.PutLogEventsResponse) => {
				if (appConfig.other.env != 'prod') {
					broker.logger.info('Logged to CloudWatch :: ', data.nextSequenceToken);
				}
			})
			.catch((err: AWS.AWSError) => {
				broker.logger.error('Error Occured while logging to CloudWatch :: ', err);
			});
	}

	public static async getLogEventRequestParams(s3Creds: any, logEvents: any[]): Promise<AWS.CloudWatchLogs.PutLogEventsRequest> {
		let cloudWatchParams: AWS.CloudWatchLogs.PutLogEventsRequest = {
			logGroupName: appConfig.aws.cloudWatchLogGroupName,
			logStreamName: appConfig.aws.cloudWatchLogStreamName,
			logEvents: logEvents,
		};

		// 'putLogEvents' expects sequenceToken to log events.
		// 'describeLogStreams' will provide the sequenceToken for particular log group.
		await new AWS.CloudWatchLogs({
			apiVersion: '2014-03-28',
			...s3Creds,
		})
			.describeLogStreams({ logGroupName: appConfig.aws.cloudWatchLogGroupName })
			.promise()
			.then((data) => {
				const currentNextToken = data.logStreams?.find((e) => e.logStreamName == appConfig.aws.cloudWatchLogStreamName)?.uploadSequenceToken;

				if (currentNextToken) {
					cloudWatchParams = { ...cloudWatchParams, ...{ sequenceToken: currentNextToken } };
				}
			})
			.catch((err) => {
				console.log('Error occured in describeLogStreams', err);
			});

		return cloudWatchParams;
	}

	public static async getS3Url(ctx: ContextWrapper, bucketName: String, fileData: string, fileTypes: string[], maxFileSize: number): Promise<string> {
		if (SystemHelper.checkUrl(fileData)) {
			return fileData;
		}
		// extract base64
		const { base64Url, contentType } = SystemHelper.checkAndExtractDataURL(fileData, ctx, fileTypes, maxFileSize);

		// upload to s3
		fileData = await ctx.call('s3.upload', {
			fileData: base64Url,
			fileName: ctx.params.fileName,
			bucketName: bucketName,
			viewableInline: true,
			contentType: contentType,
		});

		return fileData;
	}
}
