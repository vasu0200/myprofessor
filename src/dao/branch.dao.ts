import { ContextWrapper } from '@Helpers/molecular-helper';
import SystemHelper from '@Helpers/system-helpers';
import { PagedResponse } from 'src/dto/base.dto';
import { BaseDao } from './base.dao';

export class BranchDao extends BaseDao {
	public static async getBranches(ctx: ContextWrapper): Promise<PagedResponse<any>> {
		const { offset, limit } = SystemHelper.getOffsetAndLimit(+ctx.params.offset, +ctx.params.limit);
		const response: PagedResponse<any> = new PagedResponse();
		const sql: string = `select b.id, b.name, b.image, b.university_id, b.index
                         from branches b
												 where b.deleted = false and
												       b.is_default = true and
												       b.university_id = '${ctx.params.universityId}'
												 order by b.id desc
                         limit ${limit} offset ${offset}`;
		response.items = await this.runSql(sql);

		const counSql: string = `select count(*) as count
														 from branches b
														 where b.deleted = false and
														       b.is_default = true and
																	 b.university_id = '${ctx.params.universityId}'`;
		response.totalCount = await this.runSqlGetCount(counSql);
		return response;
	}

	public static async getAssignedBranches(ctx: ContextWrapper): Promise<PagedResponse<any>> {
		const { offset, limit } = SystemHelper.getOffsetAndLimit(+ctx.params.offset, +ctx.params.limit);
		const response: PagedResponse<any> = new PagedResponse();
		const sql: string = `select g.id, g.name, g.image, g.university_id, g.index, se.id as sectionId, se.name as sectionName, count(DISTINCT s.id) as subjectsCount, count(DISTINCT c.id) as chaptersCount, count(DISTINCT t.id) as topicsCount
												 from user_grades ug
                         left join grades g on g.id = ug.grade_id and g.deleted = false
                         left join sections se on se.id = ug.section_id and se.deleted = false
                         left join subjects s on s.grade_id = g.id and s.deleted = false
                         left join chapters c on c.subject_id = s.id and c.deleted = false
                         left join topics t on c.id = t.chapter_id and t.deleted = false
												 where ug.user_id = '${ctx.params.teacherId}' and ug.deleted = false
												 GROUP BY g.id order by g.index desc
                         limit ${limit} offset ${offset}`;
		response.items = await this.runSql(sql);

		const counSql: string = `select count(DISTINCT g.id) as count
												 from user_grades ug
                         left join grades g on g.id = ug.grade_id and g.deleted = false
												 where ug.user_id = '${ctx.params.teacherId}' and ug.deleted = false`;
		response.totalCount = await this.runSqlGetCount(counSql);
		return response;
	}

	public static async getBranchesSections(ctx: ContextWrapper): Promise<any> {
		const sql: string = `select ug.id, g.id as gradeId, g.name as gradeName, s.id as sectionId, s.name as sectionName
													from user_grades ug
													left join grades g on g.id = ug.grade_id and g.deleted = false
													left join sections s on s.id = ug.section_id and s.deleted = false
													where ug.grade_id = '${ctx.params.gradeId}' and ug.user_id = '${ctx.params.teacherId}' GROUP BY ug.section_id`;
		const response = await this.runSql(sql);
		return response;
	}

	public static async checkBranch(ctx: ContextWrapper, idCheck: boolean = false) {
		const idCheckSql: string = idCheck ? `and b.id != '${ctx.params.branchId}'` : ``;
		const sql: string = `select * from branches b
												 where b.university_id='${ctx.params.universityId}' and
												 		lower(b.name) = lower('${ctx.params.name}') and
														b.deleted = false ${idCheckSql}
													limit 1`;
		return await this.runSqlFindOne(sql);
	}
}
