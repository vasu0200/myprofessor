import { EmailDao } from '@Dao/email.dao';
import AwsHelper from '@Helpers/aws-helper';
import { ContextWrapper } from '@Helpers/molecular-helper';
import { EmailLog } from '@Models/email-log';
import SendGrid from '@sendgrid/mail';
import AWS from 'aws-sdk';
const appConfig = require('../../../app-config.json');

export class EmailHelper {
	public static async getSendGridCreds() {
		return { apiKey: appConfig.sendGrid.apiKey, sender: appConfig.sendGrid.sender };
	}

	public static async sendEmail(ctx: ContextWrapper) {
		const sendGridParams = {
			to: [ctx.params.email],
			from: appConfig.sendGrid.sender,
			subject: ctx.params.subject,
			html: ctx.params.body,
		};
		// set sendGrid api key
		SendGrid.setApiKey(appConfig.sendGrid.apiKey || '');

		// send email
		await SendGrid.send(sendGridParams, true).then(
			async (onsent) => {
				ctx.broker.logger.info('Email Sent', onsent);
				// log email
				await this.logEmail(ctx, JSON.stringify(onsent));
				return true;
			},
			async (onfail) => {
				ctx.broker.logger.info('Email Failed to sent', onfail);
				await this.logEmail(ctx, JSON.stringify(onfail));
				return false;
			},
		);
	}

	public static async sendEmailFromSes(ctx: ContextWrapper) {
		const ses = new AWS.SES(AwsHelper.getAWSCreds());
		const SesParams: any = {
			Destination: { ToAddresses: [ctx.params.email.toLowerCase()] },
			Message: {
				Body: { Html: { Charset: 'UTF-8', Data: ctx.params.body } },
				Subject: { Charset: 'UTF-8', Data: ctx.params.subject },
			},
			Source: appConfig.sendGrid.sender,
		};

		try {
			const sesResponse = await ses.sendEmail(SesParams).promise();
			await this.logEmail(ctx, JSON.stringify(sesResponse));
		} catch (err) {
			ctx.broker.logger.info('SES :: EMAIL :: ERROR :: ', err);
			await this.logEmail(ctx, JSON.stringify(err));
		}
	}

	public static async logEmail(ctx: ContextWrapper, additionalInfo: string) {
		const emailLog: EmailLog = new EmailLog();
		emailLog.emailBody = ctx.params.body;
		emailLog.emailSubject = ctx.params.subject;
		emailLog.emailTo = ctx.params.email;
		emailLog.additionalInfo = additionalInfo;
		await EmailDao.saveGenericResource(ctx, emailLog);
	}

	public static setEmailLogDetails(ctx: ContextWrapper, target: EmailLog) {
		target.emailTo = ctx.params.email;
		target.emailBody = ctx.params.body;
		target.emailSubject = ctx.params.subject;
	}
}
