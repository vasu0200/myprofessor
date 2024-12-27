import { Context } from 'moleculer';
import AwsHelper from './aws-helper';
import SystemHelper from './system-helpers';

export class ContextWrapper extends Context {
	// From Molecular v0.14.0, params type is marked as 'unknown'
	// In this Wrapper, customizing the params & meta information, based on over requirement.
	params: any;
	meta: any;
}

export class ResponseWrapper {
	public static async sendErrorResponse(req: any, res: any, err: any, broker: any): Promise<any> {
		const responseObject = {
			timeStamp: SystemHelper.getDateTime(),
			error: { ...err, message: err.message },
		};

		// log error message to AWS Cloudwatch
		await AwsHelper.logToCloudWatch([{ timestamp: new Date().valueOf(), message: JSON.stringify(responseObject.error) }], broker);
		broker.logger.error('Error:', responseObject);

		// set response header
		res.setHeader('Content-Type', 'application/json');
		res.writeHead(400);
		res.end(JSON.stringify(responseObject));
	}

	public static sendDataResponse(req: any, res: any, data: any) {
		let responseObj = {
			code: 201,
			timeStamp: SystemHelper.getDateTime(),
			data: data,
		};
		res.setHeader('Content-Type', 'application/json');

		// exclude responseObj format for swagger url
		responseObj = req.url && req.url.includes('swagger.json') ? data : req.url.includes('ckeditor') ? data[0] : responseObj;
		return responseObj;
	}
}
