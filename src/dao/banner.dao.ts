import { ContextWrapper } from '@Helpers/molecular-helper';
import SystemHelper from '@Helpers/system-helpers';
import { PagedResponse } from 'src/dto/base.dto';
import { BaseDao } from './base.dao';

export class BannerDao extends BaseDao {
	public static async getBanners(ctx: ContextWrapper): Promise<PagedResponse<any>> {
		const { offset, limit } = SystemHelper.getOffsetAndLimit(+ctx.params.offset, +ctx.params.limit);
		const response: PagedResponse<any> = new PagedResponse();
		const sql: string = `select b.image,b.id,b.index
												 from banners b
                         where
                          b.deleted = false
													order by b.index asc
												 limit ${limit} offset ${offset}`;
		response.items = await this.runSql(sql);

		const counSql: string = `select count(*) as count
														 from banners b
														 where
														  b.deleted = false`;
		response.totalCount = await this.runSqlGetCount(counSql);
		return response;
	}
}
