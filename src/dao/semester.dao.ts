import { ContextWrapper } from '@Helpers/molecular-helper';
import SystemHelper from '@Helpers/system-helpers';
import { PagedResponse } from 'src/dto/base.dto';
import { BaseDao } from './base.dao';

export class SemesterDao extends BaseDao {
	public static async getSemesters(ctx: ContextWrapper): Promise<PagedResponse<any>> {
		const { offset, limit } = SystemHelper.getOffsetAndLimit(+ctx.params.offset, +ctx.params.limit);
		const response: PagedResponse<any> = new PagedResponse();
		const sql: string = `select
													s.id,
													s.name,
													s.image,
													s.branch_id as branchId
                         from semesters s
												 where s.deleted = false and
												       s.is_custom = false and
												       s.branch_id = '${ctx.params.branchId}'
												 order by s.id desc
                         limit ${limit} offset ${offset}`;
		response.items = await this.runSql(sql);

		const counSql: string = `select count(*) as count
														 from semesters s
														 where s.deleted = false and
														       s.is_custom = false and
																	 s.branch_id = '${ctx.params.branchId}'`;
		response.totalCount = await this.runSqlGetCount(counSql);
		return response;
	}

	public static async checkSemester(ctx: ContextWrapper, idCheck: boolean = false) {
		const idCheckSql: string = idCheck ? `and s.id != '${ctx.params.semesterId}'` : ``;
		const sql: string = `select * from semesters s
												 where
												    s.branch_id = '${ctx.params.branchId}' and
												 		lower(s.name) = lower('${ctx.params.name}') and
														s.deleted = false ${idCheckSql}
													limit 1`;
		return await this.runSqlFindOne(sql);
	}

	public static async getCollegeSemesters(ctx: ContextWrapper, collegeId: string, branchId: string): Promise<PagedResponse<any>> {
		const { offset, limit } = SystemHelper.getOffsetAndLimit(+ctx.params.offset, +ctx.params.limit);
		const response: PagedResponse<any> = new PagedResponse();
		const sql: string = `select
													s.id,
													s.name,
													s.image,
													s.branch_id as branchId,
													s.is_custom as isCustom,
													cs.id as collegeSemesterId
                         from semesters s
												 left join college_semesters cs on s.id = cs.semester_id and cs.deleted = false and cs.college_id = '${collegeId}' and cs.branch_id = '${branchId}'
												 where
												 	s.deleted = false and
												  s.branch_id = '${branchId}'
												 order by s.id desc
                         limit ${limit} offset ${offset}`;
		response.items = await this.runSql(sql);

		const counSql: string = `select count(*) as count
                         		 from semesters s
												 		 left join college_semesters cs on s.id = cs.semester_id and cs.deleted = false and cs.college_id = '${collegeId}'
												 		 where
												 				s.deleted = false and
												  			s.branch_id = '${branchId}'`;
		response.totalCount = await this.runSqlGetCount(counSql);
		return response;
	}
}
