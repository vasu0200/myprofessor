import { ContextWrapper } from '@Helpers/molecular-helper';
import { UserSchedule } from '@Models/user-schedule';
import { Method } from 'moleculer-decorators';

export class UserScheduleHelper {
	@Method
	public static setUserScheduleDetails(ctx: ContextWrapper, userSchedule: UserSchedule) {
		userSchedule.userId = ctx.params.userId;
		userSchedule.scheduleType = ctx.params.scheduleType;
		userSchedule.scheduleTypeId = ctx.params.scheduleTypeId;
		userSchedule.scheduleDate = ctx.params.scheduleDate;
		userSchedule.additionalInfo = ctx.params.additionalInfo;
		return userSchedule;
	}
}
