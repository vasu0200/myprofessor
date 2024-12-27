import { ContextWrapper } from '@Helpers/molecular-helper';
import SystemHelper from '@Helpers/system-helpers';
import { PagedResponse } from 'src/dto/base.dto';
import { BaseDao } from './base.dao';

export class BlogDao extends BaseDao {
	public static async getBlogs(ctx: ContextWrapper): Promise<PagedResponse<any>> {
		const { offset, limit } = SystemHelper.getOffsetAndLimit(+ctx.params.offset, +ctx.params.limit);
		const response: PagedResponse<any> = new PagedResponse();
		const sql: string = `select b.title, b.description, b.image, b.id, b.idx
												 from blogs b
                         where
                          b.deleted=false
													order by b.idx asc
												 limit ${limit} offset ${offset}`;
		response.items = await this.runSql(sql);

		const countSql: string = `select count(*) as count
                              from blogs b
                              where
																b.deleted=false`;
		response.totalCount = await this.runSqlGetCount(countSql);
		return response;
	}

	public static async checkBlog(ctx: ContextWrapper, idCheck: boolean = false) {
		const idCheckSql: string = idCheck ? `and b.id != '${ctx.params.blogId}'` : ``;
		const sql: string = `select * from blogs b
												 where
												 		lower(b.title) = lower('${ctx.params.title}') and
														b.deleted = false ${idCheckSql}
												 limit 1`;
		return await this.runSqlFindOne(sql);
	}
}
