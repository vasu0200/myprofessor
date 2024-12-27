import { ContextWrapper } from '@Helpers/molecular-helper';
import SystemHelper from '@Helpers/system-helpers';
import { Constants } from '@Utility/constants';
import { ActivityCodeType, ActivityStatus, PreviousQuestionPaperTestType, QuestionAnalysisType, UserTestType } from '@Utility/enum';
import { BaseDao } from './base.dao';

export class UserTestDao extends BaseDao {
	public static async getAssignedActivityQuestions(ctx: ContextWrapper, filterByQuestionId: boolean = false, questionId: string = '') {
		const filterSql: string = filterByQuestionId ? `q.id = '${questionId}'` : `q.assigned_activity_id = '${ctx.params.assignedActivityId}'`;

		const sql: string = `select
                          q.id as questionId,
                          q.assigned_activity_id as assignedActivityId,
                          q.question,
                          q.question_type as questionType,
                          q.diff_level as diffLevel,
                          q.timeinsec as timeInSec,
                          q.scheduler_id as schedulerId,
                          q.video_id as videoId,
                          q.marks,
                          o.key,
                          o.value
                        from questions q
                        join options o on o.question_id = q.id and o.deleted = false
                        where
	                        q.deleted = false and
	                        ${filterSql}
                        order by q.id asc`;
		return await this.runSql(sql);
	}

	public static async getUserTestQuestionsGroupedByAnalysis(userTestId: string, userId: string) {
		const sql: string = `select
                          utq.analysis,
                          count(*) as total
                         from user_test_questions utq
                         where
                            utq.user_test_id = '${userTestId}' and
                            utq.deleted = false
                         group by utq.analysis `;
		return await this.runSql(sql);
	}

	public static async getUserTestQuestionsAnalysis(userTestId: string, userId: string) {
		const sql: string = `select
                          utq.question_id as "questionId",
                          utq.index,
                          utq.analysis,
                          utq.actual_duration as actualDuration,
                          utq.time_taken as timeTaken,
                          utq.mark_allocation as markAllocation
                        from user_test_questions utq
                        where
                          utq.user_test_id = '${userTestId}' and
                          utq.deleted = false
                          order by utq.created_at asc
                          `;
		return await this.runSql(sql);
	}

	public static async getUserPostAssessments(activityDimId: string, userId: string) {
		const sql: string = `select
                           ut.id, ut.score , ut.analysis ,ut.status
                         from user_tests ut
                         join activity_dim ad on ad.id = ut.activity_dim_id
                         where
                            ad.deleted = false and
                            ut.deleted = false  and
                            ut.user_id = '${userId}' and
                            ad.id = '${activityDimId}' and
                            ad.activity_type = '${ActivityCodeType.Post}'
                            order by ut.created_at asc
                            `;
		return await this.runSql(sql);
	}

	public static async getUserRecommendedPostAssessments(assignedActivityId: string, userId: string) {
		const sql: string = `select
                           ut.id, ut.score , ut.analysis ,ut.status
                         from user_tests ut
                         where
                            ut.deleted = false  and
                            ut.user_id = '${userId}' and
                            ut.assigned_activity_id = '${assignedActivityId}'
                            order by ut.created_at asc
                            `;

		return await this.runSql(sql);
	}

	public static async getAssesmentQuestionsForReview(ctx: ContextWrapper) {
		const sql: string = `select
                          q.id as questionId,
                          q.question ,
                          q.solution ,
                          q.explanation,
                          utq.user_answer as userAnswer,
                          o.key ,
                          o.value
                        from user_tests ut
                        join user_test_questions utq on utq.user_test_id = ut.id
                        join questions q on q.id = utq.question_id and q.deleted = false
                        join options o on o.question_id = q.id and o.deleted = false
                        where
                          ut.id = '${ctx.params.userTestId}' and
                          ut.user_id = '${ctx.params.userId}' and
                          ut.deleted = false and
                          utq.deleted = false
                        order by utq.created_at asc `;
		return await this.runSql(sql);
	}

	public static async getUserPractiseTestAttempts(ctx: ContextWrapper) {
		const sql: string = `select
                          ut.subject_id as subjectId,
                          ut.chapter_id as chapterId,
                          ut.test_type as testType,
                          count(*) as attemptsCounts
                        from user_tests ut
                        where
                          ut.subject_id = '${ctx.params.subjectId}' and
                          ut.user_id = '${ctx.params.userId}' and
                          ut.status = '${ActivityStatus.Completed}' and
                          ut.deleted = false
                        group by ut.subject_id , ut.chapter_id `;
		return await this.runSql(sql);
	}

	public static async getUserSubjectPracticeTest(ctx: ContextWrapper) {
		const sql: string = `select
                            ut.id ,
                            ut.subject_id as subjectId,
                            ut.chapter_id as chapterId,
                            ut.status,
                            ut.test_type as testType,
                            s.name as subjectName,
                            c.name as chapterName,
                            c.idx as chapterIndex
                        from user_tests ut
                        join subjects s on s.id = ut.subject_id
                        left join chapters c on c.subject_id  = s.id and ut.chapter_id = c.id and c.deleted = false
                        where
                          s.deleted = false and
                          ut.deleted = false and
                          ut.user_id = '${ctx.params.userId}' and
                          ut.test_type in ('${UserTestType.Subject}','${UserTestType.Chapter}') and
                          ut.subject_id = '${ctx.params.subjectId}'`;
		return await this.runSql(sql);
	}

	public static async getUserPracticeTestsByType(ctx: ContextWrapper, type: UserTestType) {
		const filterSql: string =
			type == UserTestType.Subject
				? ` and ut.subject_id = '${ctx.params.subjectId}'`
				: type == UserTestType.Chapter
				? `and ut.subject_id = '${ctx.params.subjectId}' and ut.chapter_id = '${ctx.params.chapterId}'`
				: ``;
		const sql: string = `select
                          ut.id as userTestId,
                          ut.analysis,
                          ut.status,
                          ut.created_at as createdAt,
                          ut.test_type as testType
                          from user_tests ut
                         where
                          ut.test_type = '${type}' and
                          ut.deleted = false and
                          ut.status = 'completed' and
                          ut.user_id = '${ctx.params.userId}' ${filterSql}
                          order by ut.created_at asc
                          `;
		return await this.runSql(sql);
	}

	public static async getUserPracticeTestQuestions(ctx: ContextWrapper, type: UserTestType) {
		const filterSql: string =
			type == UserTestType.Subject
				? ` and s.id = '${ctx.params.subjectId}'`
				: type == UserTestType.Chapter
				? `and s.id = '${ctx.params.subjectId}' and c.id = '${ctx.params.chapterId}'`
				: ``;
		const sql: string = `select
                            DISTINCT q.id as questionId,
                            q.question,
                            q.question_type as questionType,
                            q.diff_level as diffLevel,
                            q.timeinsec as timeInSec,
                            q.marks
                          from subjects s
                          join chapters c on c.subject_id = s.id
                          join topics t on t.chapter_id = c.id
                          join assigned_activities aa on aa.universal_topic_id = t.universal_topic_id
                          join questions q on q.assigned_activity_id = aa.id
                          where
                            s.deleted = false and
                            t.deleted = false and
                            c.deleted = false and
                            aa.deleted = false and
                            q.deleted = false ${filterSql}
                          order by RAND()
                          limit ${Constants.DEFAULT_USER_PRACTICE_QUESTIONS}`;
		return await this.runSql(sql);
	}

	public static async getUserPracticeTestNextQuestion(ctx: ContextWrapper, type: UserTestType) {
		const sql: string = `select
                          q.id as questionId,
                          q.assigned_activity_id as assignedActivityId,
                          q.question,
                          q.question_type as questionType,
                          q.diff_level as diffLevel,
                          q.timeinsec as timeInSec,
                          q.scheduler_id as schedulerId,
                          q.video_id as videoId,
                          q.marks,
                          o.key,
                          o.value
                          from user_tests ut
                          join user_test_questions utq on utq.user_test_id = ut.id
                          join questions q on q.id = utq.question_id
                          join options o on o.question_id = q.id
                        where
                          ut.deleted = false and
                          utq.deleted = false and
                          q.deleted = false and
                          o.deleted = false and
                          utq.question_id = '${ctx.params.questionId}' and
                          utq.index = ${+ctx.params.index} and
                          ut.user_id = '${ctx.params.userId}' and
                          ut.test_type = '${type}'`;
		return await this.runSql(sql);
	}

	public static async getSubjectLearningAnalysis(ctx: ContextWrapper) {
		const sql: string = `with lostQuestions as (
                          select
                            ut.chapter_id as chapterId,
                            c.name as chapteName,
                            utq.analysis,
                            count(utq.id) as totalWrongQuestions
                          from user_tests ut
                          join user_test_questions utq on utq.user_test_id = ut.id
                          join questions q on q.id = utq.question_id
                          join chapters c on c.id = ut.chapter_id and c.deleted = false
                          where
                            ut.test_type = '${UserTestType.Chapter}' and
                            ut.status='completed' and
                            ut.subject_id = '${ctx.params.subjectId}' and
                            ut.user_id = '${ctx.params.userId}'  and
                            utq.analysis in ('${QuestionAnalysisType.Lost}', '${QuestionAnalysisType.UnAnswered}','${QuestionAnalysisType.ExtraTime}')
                          group by ut.chapter_id, c.name
                        )
                        select
                          ut.chapter_id as chapterId,
                          c.name as chapterName,
                          count(DISTINCT ut.id) as totalTestsAttempted,
                          count(DISTINCT utq.id) as totalQuestions,
                          AVG(utq.time_taken) as averageTimeTaken,
                          lq.totalWrongQuestions
                        from user_tests ut
                        join user_test_questions utq on utq.user_test_id = ut.id
                        join questions q on q.id = utq.question_id
                        join chapters c on c.id = ut.chapter_id and c.deleted = false
                        join lostQuestions lq on lq.chapterId = c.id
                        where
                          ut.test_type = '${UserTestType.Chapter}' and
                           ut.status='completed' and
                          ut.subject_id = '${ctx.params.subjectId}' and
                          ut.user_id = '${ctx.params.userId}' and
                          ut.deleted = false and
                          utq.deleted = false
                        group by ut.chapter_id, c.name`;
		return await this.runSql(sql);
	}

	public static async getSubjectLearningAnalysisByDiffLevel(ctx: ContextWrapper) {
		const sql: string = `select
                          ut.chapter_id as chapterId,
                          c.name as chapterName,
                          q.diff_level as diffLevel,
                          count(*) as totalQuestions
                        from user_tests ut
                        join user_test_questions utq on utq.user_test_id = ut.id
                        join questions q on q.id = utq.question_id
                        join chapters c on c.id = ut.chapter_id
                        where
                          ut.test_type = '${UserTestType.Chapter}' and
                          ut.status='completed' and
                          ut.subject_id = '${ctx.params.subjectId}' and
                          ut.user_id = '${ctx.params.userId}' and
                          utq.deleted = false and
                          q.deleted = false and
                          c.deleted = false
                        group by ut.chapter_id, c.name, q.diff_level`;
		return await this.runSql(sql);
	}

	public static async getSubjectLearningAverages(ctx: ContextWrapper) {
		const subjectAverageSql: string = `select
                                        ut.subject_id as subjectId,
                                        AVG(ut.score) as averageScore
                                      from user_tests ut
                                      where
                                        ut.status='completed' and
                                        ut.deleted = false and
                                        ut.subject_id = '${ctx.params.subjectId}' and
                                        ut.user_id = '${ctx.params.userId}' and
                                        ut.status = '${ActivityStatus.Completed}' and
                                        ut.deleted = false
                                      group by ut.subject_id `;
		const subjectAverage = await this.runSqlFindOne(subjectAverageSql);

		const bloomTaxonamyAverageSql: string = `select
                                              q.question_type as questionType,
                                              count(utq.id) as totalQuestions
                                            from user_tests ut
                                            join user_test_questions utq on utq.user_test_id = ut.id
                                            join questions q on q.id = utq.question_id
                                            where
                                              ut.subject_id = '${ctx.params.subjectId}' and
                                              ut.user_id = '${ctx.params.userId}' and
                                              ut.status = '${ActivityStatus.Completed}' and
                                              ut.deleted = false
                                            group by q.question_type`;

		const bloomTaxonamyAverage = await this.runSql(bloomTaxonamyAverageSql);

		return { subjectAverage, bloomTaxonamyAverage };
	}

	public static async getUserPreviousQuestionPaperPracticeTestQuestions(ctx: ContextWrapper) {
		const sql: string = `select
                            pq.id as questionId,
                            pq.diff_level as diffLevel,
                            pq.idx as "index",
                            pq.marks,
                            pq.explanation
                         from question_papers qp
                         join previous_questions pq on pq.question_paper_id = qp.id
                         where
                            qp.id ='${ctx.params.previousQuestionPaperId}' and
                            qp.deleted = false and
                            pq.deleted = false
                          order by pq.idx asc`;
		return await this.runSql(sql);
	}

	public static async getUserQuestionPaperUserTestList(ctx: ContextWrapper) {
		const sql: string = `select
                          ut.id as userTestId,
                          ut.score,
                          ut.analysis,
                          ut.time_taken as timeTaken,
                          ut.actual_duration as actual_duration
                        from user_tests ut
                        where
                          ut.test_type = '${UserTestType.QuestionPaper}' and
                          ut.previous_question_paper_id = '${ctx.params.previousQuestionPaperId}' and
                          ut.user_id = '${ctx.params.userId}' and
                          ut.deleted = false
                          order by ut.created_at asc
                          `;
		return await this.runSql(sql);
	}

	public static async getUserQuestionPaperTestQuestion(ctx: ContextWrapper) {
		const sql: string = `select
                          q.id as questionId,
                          q.question,
                          q.diff_level as diffLevel,
                          q.marks,
                          o.key,
                          o.value as value
                          from user_tests ut
                          join user_test_questions utq on utq.user_test_id = ut.id
                          join previous_questions q on q.id = utq.question_id
                          left join previous_options o on o.question_id = q.id
                        where
                          ut.deleted = false and
                          utq.deleted = false and
                          q.deleted = false and
                          ut.id = '${ctx.params.userTestId}' and
                          utq.question_id = '${ctx.params.questionId}' and
                          utq.index = ${+ctx.params.index} and
                          ut.user_id = '${ctx.params.userId}' and
                          ut.test_type = '${UserTestType.QuestionPaper}'`;
		return await this.runSql(sql);
	}

	public static async getUserQuestionPaperTestQuestionsForReview(ctx: ContextWrapper) {
		const sql: string = `select
                          q.id as questionId,
                          q.question ,
                          q.solution ,
                          q.explanation,
                          utq.user_answer as userAnswer,
                          o.key,
                          o.value
                        from user_tests ut
                        join user_test_questions utq on utq.user_test_id = ut.id
                        join previous_questions q on q.id = utq.question_id and q.deleted = false
                        join previous_options o on o.question_id = q.id and o.deleted = false
                        where
                          ut.id = '${ctx.params.userTestId}' and
                          ut.user_id = '${ctx.params.userId}' and
                          ut.deleted = false and
                          utq.deleted = false
                        order by utq.index asc `;

		return await this.runSql(sql);
	}

	public static async getUserSubjectiveQuestionPaperTestQuestions(ctx: ContextWrapper) {
		const { offset, limit } = SystemHelper.getOffsetAndLimit(+ctx.params.offset, +ctx.params.limit);
		const sql: string = `select
                          pq.question_paper_id as questionPaperId,
                          pq.id as questionId,
                          pq.question,
                          pq.solution ,
                          pq.explanation
                         from previous_questions pq
                         join question_papers qp on qp.id = pq.question_paper_id
                         where
                          pq.question_paper_id = '${ctx.params.questionPaperId}' and
                          pq.deleted = false and
                          qp.question_paper_test_type = '${PreviousQuestionPaperTestType.Subjective}'
                        limit ${limit} offset ${offset}`;
		return await this.runSql(sql);
	}
}
