import { ContextWrapper } from '@Helpers/molecular-helper';
import SystemHelper from '@Helpers/system-helpers';
import { DeviceType, NotificationTypeEnum, SessionStatusType } from '@Utility/enum';
import { PagedResponse } from 'src/dto/base.dto';
import { BaseDao } from './base.dao';
import moment from 'moment';

export class NotificationDao extends BaseDao {
	public static async getNotifications(ctx: ContextWrapper): Promise<PagedResponse<any>> {
		const { offset, limit } = SystemHelper.getOffsetAndLimit(+ctx.params.offset, +ctx.params.limit);
		const response: PagedResponse<any> = new PagedResponse();
		const sql: string = `SELECT n.id, n.title, n.body, n.data, n.announcement_id as announcementId, n.is_read as isRead, n.type from notifications n
												 LEFT JOIN announcements a on a.id = n.announcement_id
                         WHERE n.user_id = '${ctx.meta.userId}' AND n.deleted = false
                         AND ((n.type = '${
														NotificationTypeEnum.Announcement
													}' AND  a.from_date < '${moment().format()}' AND a.to_date > '${moment().format()}' AND a.deleted = false) or (n.type != '${
			NotificationTypeEnum.Announcement
		}'))
                         limit ${limit} offset ${offset}`;
		response.items = await this.runSql(sql);

		const countSql: string = `SELECT count(*) as count from notifications n
                              LEFT JOIN announcements a on a.id = n.announcement_id
                              WHERE n.user_id = '${ctx.meta.userId}' AND n.deleted = false
                              AND ((n.type = '${
																NotificationTypeEnum.Announcement
															}' AND  a.from_date < '${moment().format()}' AND a.to_date > '${moment().format()}' AND a.deleted = false) or (n.type != '${
			NotificationTypeEnum.Announcement
		}'))`;
		response.totalCount = await this.runSqlGetCount(countSql);
		return response;
	}

	public static async getUserDeviceTokens(ctx: ContextWrapper) {
		let filterQuery: string = ``;

		if (ctx.params.collegeId) {
			filterQuery = `ub.college_id = '${ctx.params.collegeId}' and`;
		}

		if (ctx.params.semesterId) {
			filterQuery = `ub.semester_id = '${ctx.params.semesterId}' and`;
		}

		if (ctx.params.branchId) {
			filterQuery = `ub.branch_id = '${ctx.params.branchId}' and`;
		}

		if (ctx.params.sectionId) {
			filterQuery = `ub.section_id = '${ctx.params.sectionId}' and`;
		}

		const sql: string = `select
														us.device_token as deviceToken,
														us.user_id as userId,
														us.device_type as deviceType
												 from user_branches ub
												 join user_sessions us on us.user_id = ub.user_id and us.deleted = false and us.session_status = '${SessionStatusType.Active}' and us.device_type in ('${DeviceType.IOS}', '${DeviceType.Android}','${DeviceType.Web}')
												 where
														ub.subject_id is null and
														us.device_token is not null and
														us.device_token != '' and
														ub.university_id = '${ctx.params.universityId}' and  ${filterQuery}
														ub.deleted = false`;
		return await this.runSql(sql);
	}

	public static async getUserSession(ctx: ContextWrapper) {
		const sql: string = `select
														us.device_token as deviceToken,
														us.user_id as userId,
														us.device_type as deviceType
														from users u
													  join user_sessions us on us.user_id = u.id and us.deleted = false and us.session_status = '${SessionStatusType.Active}' and us.device_type in ('${DeviceType.IOS}', '${DeviceType.Android}','${DeviceType.Web}')
													where
													   email = '${ctx.params.email}'`;
		return await this.runSql(sql);
	}

	public static async getNotificationLogs(ctx: ContextWrapper) {
		let notificationResObj: any = { item: null, count: 0 };
		notificationResObj.item = await this.runSqlFindOne(`select * from firebase_notification_logs nl order by nl.created_at desc limit 1`);
		notificationResObj.count = await this.runSqlGetCount(`select count(*) as count from firebase_notification_logs`);
		return notificationResObj;
	}
}
