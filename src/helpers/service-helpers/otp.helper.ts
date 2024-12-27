import { ContextWrapper } from '@Helpers/molecular-helper';
import { Otp } from '@Models/otp';
import { OtpStatus } from '@Utility/enum';
import { Method } from 'moleculer-decorators';

export class OtpHelper {
	@Method
	public static setOtpDetails(ctx: ContextWrapper, target: Otp): Otp {
		target.sendTo = ctx.params.sendTo;
		target.status = OtpStatus.Sent;
		target.otp = ctx.params.otp;
		target.sourceType = ctx.params.sourceType;
		return target;
	}
}
