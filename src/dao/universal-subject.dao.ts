import { ContextWrapper } from '@Helpers/molecular-helper';
import SystemHelper from '@Helpers/system-helpers';
import { PagedResponse } from 'src/dto/base.dto';
import { BaseDao } from './base.dao';

export class UniversalSubjectDao extends BaseDao {
	public static async getSubjects(ctx: ContextWrapper, searchValue: string = ''): Promise<PagedResponse<any>> {
		const { offset, limit } = SystemHelper.getOffsetAndLimit(+ctx.params.offset, +ctx.params.limit);
		const response: PagedResponse<any> = new PagedResponse();
		const searchSqlStmt: string = `and (us.subject_name like '%${searchValue}%' or us.subject_desc  like '%${searchValue}%')`;
		const sql: string = `with topicInfo as
												 (select count(*) as no_of_topics, ut.subject_id
												 	from uni_topics ut
													where ut.deleted = false
													group by ut.subject_id)
												 select us.subject_name as name, us.subject_desc as description, us.id, us.color , us.image , ti.no_of_topics as "noOfTopics"
												 from uni_subjects us
												 left join topicInfo ti on ti.subject_id = us.id
												 where us.deleted = false ${searchSqlStmt}
												 order by us.id desc
                         limit ${limit} offset ${offset}`;
		response.items = await this.runSql(sql);

		const countSql: string = `select count(*) as count
		                          from uni_subjects us
															where us.deleted = false ${searchSqlStmt}`;
		response.totalCount = await this.runSqlGetCount(countSql);

		return response;
	}

	public static async checkSubject(ctx: ContextWrapper, idCheck: boolean = false) {
		const idCheckSql: string = idCheck ? `and us.id != '${ctx.params.subjectId}'` : ``;
		const sql: string = `select * from uni_subjects us
												 where
												 		lower(us.subject_name) = lower('${ctx.params.name}') and
														us.deleted = false ${idCheckSql}
													limit 1`;
		return await this.runSqlFindOne(sql);
	}
}
