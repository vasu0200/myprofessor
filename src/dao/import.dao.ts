import { ContextWrapper } from '@Helpers/molecular-helper';
import SystemHelper from '@Helpers/system-helpers';
import { ImportType } from '@Utility/enum';
import { PagedResponse } from 'src/dto/base.dto';
import { BaseDao } from './base.dao';

export class ImportDao extends BaseDao {
	public static async getImports(ctx: ContextWrapper) {
		const { offset, limit } = SystemHelper.getOffsetAndLimit(+ctx.params.offset, +ctx.params.limit);
		const response: PagedResponse<any> = new PagedResponse();
		const sql: string = `select * from imports i
                          where
                            i.deleted = false and
                            i.user_id = '${ctx.meta.userId}' and
                            i.type in ('${ImportType.Professor}','${ImportType.Student}')
                          order by i.created_at desc
                          limit ${limit} offset ${offset}`;
		response.items = await this.runSql(sql);

		const counSql: string = `select count(*) as count from imports i
                             where
                              i.deleted = false and
                              i.user_id = '${ctx.meta.userId}' and
                              i.type in ('${ImportType.Professor}','${ImportType.Student}')`;
		response.totalCount = await this.runSqlGetCount(counSql);
		return response;
	}
}
