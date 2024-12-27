import { ContextWrapper } from '@Helpers/molecular-helper';
import { EmailHelper } from '@Helpers/service-helpers/email.helper';
import { Action } from 'moleculer-decorators';
import AuthSchema from './auth';

export default class EmailService extends AuthSchema {
	public name: string = 'email';

	@Action({
		params: {
			email: { type: 'email' },
			subject: { type: 'string' },
			body: { type: 'string' },
		},
		auth: {
			ignoreAuthToken: true,
		},
	})
	public async sendEmail(ctx: ContextWrapper) {
		await EmailHelper.sendEmailFromSes(ctx);
	}
}

module.exports = new EmailService();
