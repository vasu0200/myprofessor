import { ContextWrapper } from '@Helpers/molecular-helper';
import { SMSHelper } from '@Helpers/service-helpers/sms.helper';
import { SMSStatus } from '@Utility/enum';
import axios from 'axios';
import { Action } from 'moleculer-decorators';
import AuthSchema from './auth';
const appConfig = require('../app-config.json');

export default class SmsService extends AuthSchema {
	public name: string = 'sms';

	@Action({
		params: {
			mobile: { type: 'string' },
			message: { type: 'string' },
			subject: { type: 'string' },
		},
		auth: {
			ignoreAuthToken: true,
		},
	})
	public async sendSms(ctx: ContextWrapper) {
		const mobile: string = ctx.params.mobile;
		const message: string = ctx.params.message;
		const smsTemplateId: number = ctx.params.smsTemplateId;
		// send sms
		await axios
			.get(appConfig.smsGateway.url, {
				params: {
					username: appConfig.smsGateway.userName,
					password: appConfig.smsGateway.password,
					from: appConfig.smsGateway.sender,
					to: mobile,
					msg: message,
					type: appConfig.smsGateway.type,
					template_id: smsTemplateId,
				},
			})
			.then(async (res) => {
				// log sms response
				await SMSHelper.logSms(ctx, mobile, message, ctx.params.subject, SMSStatus.Sent, 'Asd');
			})
			.catch(async (err) => {
				// log sms error
				await SMSHelper.logSms(ctx, mobile, message, ctx.params.subject, SMSStatus.Failure, 'asd');
			});
	}
}

module.exports = new SmsService();
