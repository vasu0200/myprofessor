import { ContextWrapper } from '@Helpers/molecular-helper';
import SystemHelper from '@Helpers/system-helpers';
import { User } from '@Models/user';
import { PagedResponse } from 'src/dto/base.dto';
import { BaseDao } from './base.dao';
import moment from 'moment';

export class AnnouncementDao extends BaseDao {
	public static async getAnnouncements(ctx: ContextWrapper): Promise<PagedResponse<any>> {
		const { offset, limit } = SystemHelper.getOffsetAndLimit(+ctx.params.offset, +ctx.params.limit);
		const response: PagedResponse<any> = new PagedResponse();
		const sql: string = `select
														a.id,
														a.title,
														a.description,
														a.from_date as fromDate,
													  a.to_date as toDate,
														a.branches,
														a.sections,
														a.semesters,
														GROUP_CONCAT(DISTINCT b.name) as branchNames,
														GROUP_CONCAT(DISTINCT s.name) as sectionNames,
														GROUP_CONCAT(DISTINCT sem.name) as semesterNames
													from announcements a
                         	left join branches b ON FIND_IN_SET(b.id, a.branches)
                         	left join sections s ON FIND_IN_SET(s.id, a.sections)
												 	left join semesters sem ON FIND_IN_SET(sem.id, a.semesters)
												 	Where
														a.deleted = false and
														a.college_id = '${ctx.meta.collegeId}'
                         	GROUP BY a.id
												 	order by a.id desc
                         	limit ${limit} offset ${offset}`;
		response.items = await this.runSql(sql);

		const countSql: string = `select count(*) as count
														 from announcements a
														 where
														 	a.deleted = false`;
		response.totalCount = await this.runSqlGetCount(countSql);
		return response;
	}

	public static async getAnnouncement(ctx: ContextWrapper): Promise<any> {
		const sql: string = `select
													a.id,
													a.title,
													a.description,
													a.branches,
													a.sections,
													a.semesters,
													a.from_date as fromDate,
													a.to_date as toDate,
													GROUP_CONCAT(DISTINCT b.name) as branchNames,
													GROUP_CONCAT(DISTINCT s.name) as sectionNames,
													GROUP_CONCAT(DISTINCT sem.name) as semesterNames
												 from announcements a
                         LEFT JOIN branches b ON FIND_IN_SET(b.id, a.branches)
                         LEFT JOIN sections s ON FIND_IN_SET(s.id, a.sections)
												 left join semesters sem ON FIND_IN_SET(sem.id, a.semesters)
												 WHERE
												 	a.id = '${ctx.params.announcementId}' and
													a.deleted = false
                         GROUP BY a.id`;
		const response = await this.runSql(sql);
		return response;
	}

	public static async getAnnouncementUsers(ctx: ContextWrapper): Promise<User[]> {
		let condition = 'u.deleted = false AND ug.deleted = false';
		if (ctx.params.sections && ctx.params.sections.split(',').length) {
			// eslint-disable-next-line @typescript-eslint/restrict-plus-operands
			condition += ` AND ug.section_id IN (${ctx.params.sections.split(',').map((section) => "'" + section + "'")})`;
		} else if (ctx.params.branches && ctx.params.branches.split(',').length) {
			condition += ` AND ug.branch_id IN (${ctx.params.branches.split(',').map((branch) => "'" + branch + "'")})`;
		} else if (ctx.params.semesters && ctx.params.semesters.split(',').length) {
			condition += ` AND ug.semester_id IN (${ctx.params.semesters.split(',').map((sem) => "'" + sem + "'")})`;
		}

		const sql: string = `select * from users u
                         LEFT JOIN user_branches ug on ug.user_id = u.id
												 where ${condition} `;
		const response = await this.runSql(sql);

		return response;
	}

	public static async getStudentAnnouncements(ctx: ContextWrapper): Promise<PagedResponse<any>> {
		const { offset, limit } = SystemHelper.getOffsetAndLimit(+ctx.params.offset, +ctx.params.limit);
		const response: PagedResponse<any> = new PagedResponse();
		const sql: string = `select  al.id as announcementLogId, al.is_read as isRead, a.id as announcementId, a.title, a.description, a.from_date as fromDate, a.to_date as toDate from announcement_logs al
												 LEFT JOIN announcements a on a.id = al.announcement_id
												 where al.user_id = '${ctx.params.userId}'
												  AND a.from_date < '${moment().format()}' AND a.to_date > '${moment().format()}'
													AND a.deleted = false AND al.deleted = false
                         limit ${limit} offset ${offset}`;
		response.items = await this.runSql(sql);

		const countSql: string = `select count(*) as count
														 from announcement_logs al
														 LEFT JOIN announcements a on a.id = al.announcement_id
														 where al.user_id = '${ctx.params.userId}'
														 AND a.from_date < '${moment().format()}' AND a.to_date > '${moment().format()}'
														 AND a.deleted = false AND al.deleted = false`;
		response.totalCount = await this.runSqlGetCount(countSql);
		return response;
	}
}
