import { ContextWrapper } from '@Helpers/molecular-helper';
import { LiveClassAttendance } from '@Models/live-class-attendance';
import { Method } from 'moleculer-decorators';

export class LiveClassAttendanceHelper {
	@Method
	public static async setLiveClassAttendanceDetails(ctx: ContextWrapper, target: LiveClassAttendance): Promise<LiveClassAttendance> {
		target.liveClassId = ctx.params.liveClassId;
		target.userId = ctx.params.userId;
		target.type = ctx.params.type;
		target.time = ctx.params.time;

		return target;
	}
}
