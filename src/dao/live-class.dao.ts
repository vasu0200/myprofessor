import { ContextWrapper } from '@Helpers/molecular-helper';
import { PagedResponse } from 'src/dto/base.dto';
import { BaseDao } from './base.dao';

export class LiveClassDao extends BaseDao {
	public static async getLiveClasses(ctx: ContextWrapper): Promise<PagedResponse<any>> {
		const response: PagedResponse<any> = new PagedResponse();

		const sql: string = `select lc.name, lc.platform, lc.description, lc.date, lc.from_time as fromTime, lc.to_time as toTime
                         from live_classes lc
                         where lc.deleted = false
												 order by lc.date DESC`;
		response.items = await this.runSql(sql);

		const countSql: string = `select count(*) as count
														 from live_classes lc
														 where lc.deleted = false`;
		response.totalCount = await this.runSqlGetCount(countSql);
		return response;
	}

	public static async getModeratorLiveClasses(chapterId: string, sectionId: string, teacherId: string): Promise<PagedResponse<any>> {
		const response: PagedResponse<any> = new PagedResponse();

		const sql: string = `select lc.id, lc.name, lc.platform, lc.description, lc.date, lc.from_time as fromTime, lc.to_time as toTime
                         from live_classes lc
                         where lc.deleted = false AND lc.teacher_id = '${teacherId}' AND lc.section_id = '${sectionId}' AND lc.chapter_id = '${chapterId}'
												 order by lc.date DESC`;
		response.items = await this.runSql(sql);
		const countSql: string = `select count(*) as count
														 from live_classes lc
														 where lc.deleted = false AND lc.teacher_id = '${teacherId}' AND lc.section_id = '${sectionId}' AND lc.chapter_id = '${chapterId}'`;
		response.totalCount = await this.runSqlGetCount(countSql);
		return response;
	}

	public static async getAttendeeLiveClasses(userId: string, chapterId: string): Promise<PagedResponse<any>> {
		const response: PagedResponse<any> = new PagedResponse();

		const sql: string = `select lc.name, lc.platform, lc.description, lc.date, lc.from_time as fromTime, lc.to_time as toTime
                         from live_classes lc
												 left join live_class_invites lci on lci.live_class_id = lc.id
												 left join user_grades ug on ug.grade_id = lci.grade_id AND ug.section_id = lci.section_id
                         where lc.deleted = false AND lci.deleted = false AND ug.deleted = false AND ug.user_id = '${userId}' AND lc.chapter_id = '${chapterId}'
												 order by lc.date DESC`;
		response.items = await this.runSql(sql);

		const countSql: string = `select count(*) as count
														 from live_classes lc
														 left join live_class_invites lci on lci.live_class_id = lc.id
														 left join user_grades ug on ug.grade_id = lci.grade_id AND ug.section_id = lci.section_id
														 where lc.deleted = false AND lci.deleted = false AND ug.deleted = false
														 AND ug.user_id = '${userId}' AND lc.chapter_id = '${chapterId}'`;
		response.totalCount = await this.runSqlGetCount(countSql);
		return response;
	}

	public static async getUsersCount(ctx: ContextWrapper): Promise<number> {

		const countSql: string = `select count(*) as count
															from users u
															left join user_grades ug on ug.user_id = u.id
															left join live_class_invites lci on lci.grade_id = ug.grade_id AND lci.section_id = ug.section_id
															where u.deleted = false AND ug.deleted = false AND lci.live_class_id = '${ctx.params.liveClassId}' AND lci.deleted = false`;
		const response = await this.runSqlGetCount(countSql);

		return response;
	}
}
