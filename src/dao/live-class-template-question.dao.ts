import { ContextWrapper } from '@Helpers/molecular-helper';
import SystemHelper from '@Helpers/system-helpers';
import { PagedResponse } from 'src/dto/base.dto';
import { BaseDao } from './base.dao';

export class LiveClassTemplateQuestionDao extends BaseDao {
	public static async getLiveClassTemplateQuestions(ctx: ContextWrapper): Promise<PagedResponse<any>> {
		const { offset, limit } = SystemHelper.getOffsetAndLimit(+ctx.params.offset, +ctx.params.limit);
		const response: PagedResponse<any> = new PagedResponse();
		const sql: string = `select tq.id, tq.question, tq.answer_type as answerType, tq.questions_template_id as questionsTemplateId , tq.mandatory from live_class_template_questions tq
                         where tq.deleted = false
                         order by tq.id desc
                         limit ${limit} offset ${offset}`;
		response.items = await this.runSql(sql);

		const countSql: string = `select count(*) as count
                              from live_class_template_questions tq
                              where tq.deleted = false`;
		response.totalCount = await this.runSqlGetCount(countSql);
		return response;
	}
}
