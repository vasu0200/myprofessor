import { ContextWrapper } from '@Helpers/molecular-helper';
import { BaseDao } from '@Dao/base.dao';
import SystemHelper from '@Helpers/system-helpers';
import { PagedResponse } from 'src/dto/base.dto';

export class PreviousQuestionPaperDao extends BaseDao {
	public static async getQuestionPaperTypes(ctx: ContextWrapper): Promise<PagedResponse<any>> {
		const response: PagedResponse<any> = new PagedResponse();
		const { offset, limit } = SystemHelper.getOffsetAndLimit(+ctx.params.offset, +ctx.params.limit);
		const sql: string = `select * from question_paper_types
												 where deleted = false
												 order by id desc
                         limit ${limit} offset ${offset}`;
		response.items = await this.runSql(sql);

		const counSql: string = `select count(*) as count
                             from question_paper_types
												     where deleted = false`;
		response.totalCount = await this.runSqlGetCount(counSql);
		return response;
	}

	public static async getQuestionPapers(ctx: ContextWrapper): Promise<PagedResponse<any>> {
		const response: PagedResponse<any> = new PagedResponse();
		const filterSql: string = ctx.params.questionPaperTypeId ? `and qpt.id = '${ctx.params.questionPaperTypeId}'` : ``;
		const { offset, limit } = SystemHelper.getOffsetAndLimit(+ctx.params.offset, +ctx.params.limit);
		let sql: string = `select qp.id as questionPaperId,
                              qpt.id as questionPaperTypeId,
                              qp.paper_code as paperCode,
                              qpt.title as questionPaperTypeTitle,
															qp.question_paper_test_type as questionPaperTestType,
                              qp.title as questionPaperTitle,
                              qp.month,
                              qp.year
                       from question_papers qp
                       join question_paper_types qpt on qpt.id = qp.question_paper_type_id and qpt.deleted = false
                       where qp.deleted = false ${filterSql}
                       order by qp.id DESC
											 limit ${limit} offset ${offset}`;
		response.items = await this.runSql(sql);

		const counSql: string = `select count(*) as count
                             from question_papers qp
                             join question_paper_types qpt on qpt.id = qp.question_paper_type_id and qpt.deleted = false
                             where qp.deleted = false`;
		response.totalCount = await this.runSqlGetCount(counSql);
		return response;
	}

	public static async getQuestions(ctx: ContextWrapper): Promise<PagedResponse<any>> {
		const response: PagedResponse<any> = new PagedResponse();
		const { offset, limit } = SystemHelper.getOffsetAndLimit(+ctx.params.offset, +ctx.params.limit);
		const sql: string = `select * from previous_questions pq
												 where
												 		pq.deleted = false and
														pq.question_paper_id = '${ctx.params.questionPaperId}'
												 order by pq.idx desc
                         limit ${limit} offset ${offset}`;
		response.items = await this.runSql(sql);

		const counSql: string = `select count(*) as count
                             from previous_questions pq
												     where pq.deleted = false and pq.question_paper_id = '${ctx.params.questionPaperId}'`;
		response.totalCount = await this.runSqlGetCount(counSql);
		return response;
	}

	public static async getPreviousQuestionMappers(ctx: ContextWrapper) {
		const response: PagedResponse<any> = new PagedResponse();
		const { offset, limit } = SystemHelper.getOffsetAndLimit(+ctx.params.offset, +ctx.params.limit);
		const sql: string = `select
													pq.id,
													pq.university_id as universityId,
													pq.branch_id as branchId,
													pq.semester_id as semesterId,
													pq.subject_id as subjectId,
													pq.previous_question_paper_id as previousQuestionPaperId,
													pq.status,
													u.name as universityName,
													b.name as branchName,
													s.name as semesterName,
													sub.name as subjectName
												 from previous_question_paper_mappers pq
												 join universities u on u.id = pq.university_id
												 join branches b on b.id = pq.branch_id
												 join semesters s on s.id = pq.semester_id
												 join subjects sub on sub.id = pq.subject_id
												 where
												 		pq.deleted = false and
														u.deleted = false and
														b.deleted = false and
														s.deleted = false and
														pq.previous_question_paper_id = '${ctx.params.previousQuestionPaperId}'
												 order by pq.created_at desc
                         limit ${limit} offset ${offset}`;
		response.items = await this.runSql(sql);

		const counSql: string = `select count(*) as count
                             from previous_question_paper_mappers pq
												     where
														 		pq.deleted = false and
																pq.previous_question_paper_id = '${ctx.params.previousQuestionPaperId}'`;
		response.totalCount = await this.runSqlGetCount(counSql);
		return response;
	}

	public static async getUserPreviousQuestionPaperTypes(ctx: ContextWrapper) {
		const response: PagedResponse<any> = new PagedResponse();
		const { offset, limit } = SystemHelper.getOffsetAndLimit(+ctx.params.offset, +ctx.params.limit);
		const sql: string = `select
													DISTINCT qpt.id as questionPaperTypeId,
													qpt.title,
													qpt.status
												from previous_question_paper_mappers pqpm
												join user_branches ub on ub.university_id = pqpm.university_id and ub.branch_id = pqpm.branch_id
												join question_papers qp ON qp.id = pqpm.previous_question_paper_id
												join question_paper_types qpt on qpt.id = qp.question_paper_type_id
												where
													ub.user_id = '${ctx.params.userId}' and
													pqpm.deleted = false and
													ub.deleted = false  and
													qp.deleted = false and
													qpt.deleted = false
                        limit ${limit} offset ${offset}`;
		response.items = await this.runSql(sql);

		const counSql: string = `select count(DISTINCT(qpt.id)) as count
														from previous_question_paper_mappers pqpm
														join user_branches ub on ub.university_id = pqpm.university_id and ub.branch_id = pqpm.branch_id
														join question_papers qp ON qp.id = pqpm.previous_question_paper_id
														join question_paper_types qpt on qpt.id = qp.question_paper_type_id
														where
															ub.user_id = '${ctx.params.userId}' and
															pqpm.deleted = false and
															ub.deleted = false  and
															qp.deleted = false and
														  qpt.deleted = false`;
		response.totalCount = await this.runSqlGetCount(counSql);
		return response;
	}

	public static async getUserPreviousQuestionPapers(ctx: ContextWrapper) {
		const response: PagedResponse<any> = new PagedResponse();
		const { offset, limit } = SystemHelper.getOffsetAndLimit(+ctx.params.offset, +ctx.params.limit);
		const sql: string = `select
													DISTINCT qp.id as questionPaperId,
													qp.title as questionPaperTitle,
													qp.question_paper_test_type as questionPaperTestType,
													qp.question_paper_type_id as questionPaperTypeId,
													qpt.title as questionPaperTypeTitle
												from previous_question_paper_mappers pqpm
												join user_branches ub on ub.university_id = pqpm.university_id and ub.branch_id = pqpm.branch_id
												join question_papers qp ON qp.id = pqpm.previous_question_paper_id
												join question_paper_types qpt on qpt.id = qp.question_paper_type_id
												where
													ub.user_id = '${ctx.params.userId}' and
													pqpm.deleted = false and
													pqpm.status = 'active' and
													ub.deleted = false  and
													qp.deleted = false and
													qpt.deleted = false
                        limit ${limit} offset ${offset}`;
		response.items = await this.runSql(sql);

		const counSql: string = `select count(DISTINCT(qp.id)) as count
													   from previous_question_paper_mappers pqpm
														 join user_branches ub on ub.university_id = pqpm.university_id and ub.branch_id = pqpm.branch_id
														 join question_papers qp ON qp.id = pqpm.previous_question_paper_id
														 join question_paper_types qpt on qpt.id = qp.question_paper_type_id
													   where
															ub.user_id = '${ctx.params.userId}' and
															pqpm.deleted = false and
															pqpm.status = 'active' and
															ub.deleted = false  and
															qp.deleted = false and
															qpt.deleted = false`;
		response.totalCount = await this.runSqlGetCount(counSql);
		return response;
	}

	public static async getQuestionsByTopic(ctx: ContextWrapper): Promise<PagedResponse<any>> {
		const response: PagedResponse<any> = new PagedResponse();
		const sql: string = `select
													pq.id as prevQuestionId,
													qp.id as prevPaperId,
													pq.question,
													pq.solution,
													pq.explanation,
													qp.title as questionPaperTitle,
													qp.month,
													qp.year,
													qp.question_paper_test_type as questionPaperType
												from previous_questions pq
												join question_papers qp on qp.id = pq.question_paper_id
												join question_paper_types qpt on qp.question_paper_type_id = qpt.id
												-- left join options o on o.question_id = pq.id
													where
														pq.deleted = false and
														qpt.title !='GATE' and
														pq.topic_id = '${ctx.params.topicId}'
													  order by pq.idx desc
													limit 1000 offset 0
												 `;

		response.items = await this.runSql(sql);

		const counSql: string = `select count(*) as count
                             from previous_questions pq
														 join question_papers qp on qp.id = pq.question_paper_id
														 join question_paper_types qpt on qp.question_paper_type_id = qpt.id
												  	   where
															 	pq.deleted = false and
																 qpt.title !='GATE' and
																pq.topic_id = '${ctx.params.topicId}'`;
		response.totalCount = await this.runSqlGetCount(counSql);
		return response;
	}

	public static async getPreviosuQuestionPaperCountByTopic(ctx: ContextWrapper) {
		const sql: string = `select
														pq.topic_id as topicId ,
														qp.id as prevPaperId
														from previous_questions pq
														join question_papers qp on qp.id = pq.question_paper_id
														join question_paper_types qpt on qp.question_paper_type_id = qpt.id
														where
															pq.deleted = false and
															qpt.title !='GATE' and
															pq.topic_id in (select t.universal_topic_id from topics t where t.chapter_id= '${ctx.params.chapterId}')
															order by pq.idx desc`;

		return await this.runSql(sql);
	}

	public static async getGateQuestionsByTopic(ctx: ContextWrapper): Promise<PagedResponse<any>> {
		const response: PagedResponse<any> = new PagedResponse();
		const sql: string = `select
													pq.id as prevQuestionId,
													qp.id as prevPaperId,
													pq.question,
													pq.solution,
													pq.explanation,
													qp.title as questionPaperTitle,
													qp.month,
													qp.year,
													qp.question_paper_test_type as questionPaperType
												from previous_questions pq
												join question_papers qp on qp.id = pq.question_paper_id
												join question_paper_types qpt on qp.question_paper_type_id = qpt.id
												-- left join options o on o.question_id = pq.id
													where
														pq.deleted = false and
														qpt.title ='GATE' and
														pq.topic_id = '${ctx.params.topicId}'
													  order by pq.idx desc
													limit 1000 offset 0
												 `;

		response.items = await this.runSql(sql);

		const counSql: string = `select count(*) as count
                             from previous_questions pq
														 join question_papers qp on qp.id = pq.question_paper_id
														 join question_paper_types qpt on qp.question_paper_type_id = qpt.id
												  	   where
															 	pq.deleted = false and
																qpt.title ='GATE' and
																pq.topic_id = '${ctx.params.topicId}'`;
		response.totalCount = await this.runSqlGetCount(counSql);
		return response;
	}

	public static async getGatePreviosuQuestionPaperCountByTopic(ctx: ContextWrapper) {
		const sql: string = `select
													pq.topic_id as topicId ,
													qp.id as prevPaperId
													from previous_questions pq
													join question_papers qp on qp.id = pq.question_paper_id
													join question_paper_types qpt on qp.question_paper_type_id = qpt.id
													where
														pq.deleted = false and
																qpt.title ='GATE' and
														pq.topic_id in (select t.universal_topic_id from topics t where t.chapter_id= '${ctx.params.chapterId}')
														order by pq.idx desc`;

		return await this.runSql(sql);
	}
}
