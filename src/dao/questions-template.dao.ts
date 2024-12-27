import { ContextWrapper } from '@Helpers/molecular-helper';
import SystemHelper from '@Helpers/system-helpers';
import { PagedResponse } from 'src/dto/base.dto';
import { BaseDao } from './base.dao';

export class QuestionsTemplateDao extends BaseDao {
	public static async getQuestionsTemplates(ctx: ContextWrapper): Promise<PagedResponse<any>> {
		const { offset, limit } = SystemHelper.getOffsetAndLimit(+ctx.params.offset, +ctx.params.limit);
		const response: PagedResponse<any> = new PagedResponse();
		const sql: string = `select * from questions_templates qt
                         where qt.deleted = false
                         order by qt.id desc
                         limit ${limit} offset ${offset}`;
		response.items = await this.runSql(sql);

		const countSql: string = `select count(*) as count
                              from questions_templates qt
                              where qt.deleted = false`;
		response.totalCount = await this.runSqlGetCount(countSql);
		return response;
	}
}
