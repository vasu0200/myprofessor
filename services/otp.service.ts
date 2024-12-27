import { ContextWrapper } from '@Helpers/molecular-helper';
import { Action } from 'moleculer-decorators';
import AuthSchema from './auth';
import { Otp } from '@Models/otp';
import SystemHelper from '@Helpers/system-helpers';
import { OtpDao } from '@Dao/otp.dao';
import { OtpHelper } from '@Helpers/service-helpers/otp.helper';
import { OtpStatus } from '@Utility/enum';
import { ErrorHelper } from '@Helpers/error-helper';
import { Messages } from '@Utility/Messages';
import { Constants } from '@Utility/constants';

export default class OtpService extends AuthSchema {
	public name: string = 'otp';

	@Action({
		params: {
			sendTo: { type: 'string' },
			sourceType: { type: 'string' },
		},
		auth: {
			ignoreAuthToken: true,
		},
	})
	public async generate(ctx: ContextWrapper): Promise<Otp> {
		const oldOtps: Otp[] = await OtpDao.getGenericResources(ctx, Otp, { where: { sendTo: ctx.params.sendTo } });

		if (oldOtps.length) {
			await OtpDao.softDeleteResourceByIds(
				ctx,
				Otp,
				oldOtps.map((e) => e.id),
			);
		}

		// generate otp
		ctx.params.otp = SystemHelper.getRandomNumber(6);
		const otpObj: Otp = OtpHelper.setOtpDetails(ctx, new Otp());
		return await OtpDao.saveGenericResource(ctx, otpObj);
	}

	@Action({
		params: {
			receiver: { type: 'string' },
			otp: { type: 'string', max: 6 },
		},
		auth: {
			ignoreAuthToken: true,
		},
	})
	public async validate(ctx: ContextWrapper) {
		// TODO: need to discuss about max attempts and expiry
		const sendTo: string = ctx.params.receiver;
		const dbOtp: Otp = await OtpDao.getGenericResource(ctx, Otp, { where: { sendTo: sendTo } });

		if (!dbOtp || (dbOtp && dbOtp.status != OtpStatus.Sent)) {
			ErrorHelper.throwError(Messages.OTP_EXPIRED, 400, Constants.SYSTEM_EXCEPTION_TYPES.UNAUTHORIZED);
		}

		if (dbOtp.otp != ctx.params.otp) {
			ErrorHelper.throwError(Messages.INVALID_OTP, 400, Constants.SYSTEM_EXCEPTION_TYPES.VALIDATION_ERROR);
		}

		dbOtp.status = OtpStatus.Validated;
		await OtpDao.saveGenericResource(ctx, dbOtp);

		return true;
	}
}

module.exports = new OtpService();
