import { ContextWrapper } from '@Helpers/molecular-helper';
import SystemHelper from '@Helpers/system-helpers';
import { PagedResponse } from 'src/dto/base.dto';
import { BaseDao } from './base.dao';

export class UniversityDao extends BaseDao {
	public static async getUniversities(ctx: ContextWrapper): Promise<PagedResponse<any>> {
		const { offset, limit } = SystemHelper.getOffsetAndLimit(+ctx.params.offset, +ctx.params.limit);
		const response: PagedResponse<any> = new PagedResponse();
		const sql: string = `select u.id, u.name, u.description, u.image
                         from universities u
												 where u.deleted = false
												 order by u.id desc
                         limit ${limit} offset ${offset}`;
		response.items = await this.runSql(sql);

		const countSql: string = `select count(*) as count
															from universities
															where deleted = false`;
		response.totalCount = await this.runSqlGetCount(countSql);
		return response;
	}

	public static async checkUniversity(ctx: ContextWrapper, idCheck: boolean = false) {
		const idCheckSql: string = idCheck ? `and u.id != '${ctx.params.universityId}'` : ``;
		const sql: string = `select * from universities u
												 where
												 		lower(u.name) = lower('${ctx.params.name}') and
														u.deleted = false ${idCheckSql}
													limit 1`;
		return await this.runSqlFindOne(sql);
	}
}
