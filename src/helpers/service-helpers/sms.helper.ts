import { BaseDao } from '@Dao/base.dao';
import { ContextWrapper } from '@Helpers/molecular-helper';
import { SMSLog } from '@Models/sms-log';
import { SMSStatus } from '@Utility/enum';
import { Method } from 'moleculer-decorators';

export class SMSHelper {
	@Method
	public static async logSms(ctx: ContextWrapper, mobile: string, message: string, subject: string, status: SMSStatus, addActivityInfo: string) {
		const smsLog: SMSLog = new SMSLog();
		smsLog.mobile = mobile;
		smsLog.message = message;
		smsLog.subject = subject;
		smsLog.status = status;
		// smsLog.additionalInfo = addActivityInfo;
		await BaseDao.saveGenericResource(ctx, smsLog);
	}
}
