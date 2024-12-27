import { ContextWrapper } from '@Helpers/molecular-helper';
import { BaseDao } from './base.dao';

export class UserScheduleDao extends BaseDao {
	public static async getUserSchedules(ctx: ContextWrapper) {
		const sql: string = `select
                            us.id as scheduleId,
                            us.schedule_type as scheduleType,
                            us.schedule_date as scheduleDate,
                            us.additional_info as additionalInfo,
                            us.schedule_type_id as scheduleTypeId,
                            us.user_id as userId
                          from user_schedules us
                          where
                            us.user_id='${ctx.params.userId}' and
                            us.deleted = false and
                            us.schedule_date between date('${ctx.params.fromDate}') and date('${ctx.params.toDate}')`;
		return await this.runSql(sql);
	}
}
