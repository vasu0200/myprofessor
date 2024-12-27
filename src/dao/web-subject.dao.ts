import { ContextWrapper } from '@Helpers/molecular-helper';
import { PagedResponse } from 'src/dto/base.dto';
import { BaseDao } from './base.dao';
import SystemHelper from '@Helpers/system-helpers';
export class WebSubjectDao extends BaseDao {
	public static async getWebSubjects(ctx: ContextWrapper): Promise<PagedResponse<any>> {
		const { offset, limit } = SystemHelper.getOffsetAndLimit(+ctx.params.offset, +ctx.params.limit);
		const response: PagedResponse<any> = new PagedResponse();
      const sql: string = `select
                            ws.id,
                            ws.index,
                            ws.university_id as universityId,
                            ws.branch_id as branchId,
                            ws.subject_id as subjectId,
                            u.name as universityName,
                            b.name as branchName,
                            s.name as subjectName,
                            s.image as subjectImage
                         from web_subjects ws
                         join subjects s on s.id=ws.subject_id
                         join branches b on b.id=ws.branch_id
                         join universities u on u.id=ws.university_id
                         where
                            ws.deleted = false
                            order by ws.index asc
                            limit ${limit} offset ${offset}`;
		response.items = await this.runSql(sql);

		const countsql: string = `select count(*) as count
                              from web_subjects ws
                              where
                               ws.deleted=false`;
		response.totalCount = await this.runSqlGetCount(countsql);
		return response;
   }

	public static async getWebSubjectsByBranch(ctx: ContextWrapper): Promise<PagedResponse<any>> {
		const response: PagedResponse<any> = new PagedResponse();
      const sql: string = `select
                            ws.id,
                            ws.university_id as universityId,
                            ws.branch_id as branchId,
                            ws.subject_id as subjectId,
                            u.name as universityName,
                            b.name as branchName,
                            s.name as subjectName,
                            s.image as subjectImage
                         from web_subjects ws
                         join subjects s on s.id=ws.subject_id
                         join branches b on b.id=ws.branch_id
                         join universities u on u.id=ws.university_id
                         where
                            ws.branch_id= '${ctx.params.branchId}' and
                            ws.deleted = false`;
		response.items = await this.runSql(sql);

		const countsql: string = `select count(*) as count
                              from web_subjects ws
                              where
                               ws.branch_id= '${ctx.params.branchId}' and
                               ws.deleted=false`;
		response.totalCount = await this.runSqlGetCount(countsql);
		return response;
	}

	public static async checkWebSubject(ctx: ContextWrapper, idCheck: boolean = false) {
		const idCheckSql: string = idCheck ? `and ws.id!='${ctx.params.webSubjectId}'` : ``;
		const sql: string = `select * from web_subjects ws
                          where
                            ws.branch_id = '${ctx.params.branchId}' and
                            ws.subject_id = '${ctx.params.subjectId}' and
                            ws.deleted = false ${idCheckSql}`;

		return await this.runSqlFindOne(sql);
	}
}
