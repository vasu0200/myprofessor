import { ContextWrapper } from '@Helpers/molecular-helper';
import { PagedResponse } from 'src/dto/base.dto';
import { BaseDao } from './base.dao';
import SystemHelper from '@Helpers/system-helpers';
export class SubjectOverviewDao extends BaseDao {
   public static async getSubjectOverview(ctx: ContextWrapper): Promise<PagedResponse<any>> {
      const { offset, limit } = SystemHelper.getOffsetAndLimit(+ctx.params.offset, +ctx.params.limit);
		const response: PagedResponse<any> = new PagedResponse();
		const sql: string = `select
                              so.id,
                              so.index,
                              so.university_id as universityId,
                              so.branch_id as branchId,
                              so.subject_id as subjectId,
                              so.description as description,
                              u.name as universityName,
                              b.name as branchName,
                              s.name as subjectName,
                              s.image as subjectImage
                           from subject_overview so
                           join subjects s on s.id=so.subject_id
                           join branches b on b.id=so.branch_id
                           join universities u on u.id=so.university_id
                           where
                           so.deleted = false
                           order by so.index asc
                           limit ${limit} offset ${offset}`;
		response.items = await this.runSql(sql);

		const countSql: string = `select count(*) as count
										  from subject_overview so
										  where
                                 so.deleted = false`;
		response.totalCount = await this.runSqlGetCount(countSql);
		return response;
	}

	public static async checkSubjectOverview(ctx: ContextWrapper, idCheck: boolean = false) {
		const idCheckSql: string = idCheck ? `and so.id!= '${ctx.params.subjectOverviewId}'` : ``;
		const sql: string = `select * from subject_overview so
                           where
                              so.branch_id = '${ctx.params.branchId}' and
                              so.subject_id = '${ctx.params.subjectId}' and
                              so.deleted = false ${idCheckSql}`;
		return await this.runSqlFindOne(sql);
	}

	public static async getSubjectOverviewBySubject(ctx: ContextWrapper) {
		const sql: string = `select
                              so.id,
                              so.university_id as universityId,
                              so.branch_id as branchId,
                              so.subject_id as subjectId,
                              so.description as description,
                              u.name as universityName,
                              b.name as branchName,
                              s.name as subjectName,
                              s.image as subjectImage
                           from subject_overview so
                           join subjects s on s.id=so.subject_id
                           join branches b on b.id=so.branch_id
                           join universities u on u.id=so.university_id
                           where
                           so.subject_id = '${ctx.params.subjectId}' and
                           so.deleted = false`;
      console.log(sql);

		return await this.runSqlFindOne(sql);;
	}
}
