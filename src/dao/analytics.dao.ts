import { ContextWrapper } from '@Helpers/molecular-helper';
import SystemHelper from '@Helpers/system-helpers';
import { ActivityCodeType, ActivityStatus, UserProgressAnalyticsType, UserRoleType, UserTestType } from '@Utility/enum';
import { UserChaptersAnalyticMapper, UserSubjectsAnalyticMapper, UserTopicsAnalyticMapper } from 'src/dto/analytics.dto';
import { PagedResponse } from 'src/dto/base.dto';
import { BaseDao } from './base.dao';

export class AnalyticsDao extends BaseDao {
	public static async getUserAssessmentSubjects(ctx: ContextWrapper): Promise<PagedResponse<UserSubjectsAnalyticMapper>> {
		const { offset, limit } = SystemHelper.getOffsetAndLimit(+ctx.params.offset, +ctx.params.limit);
		const response: PagedResponse<any> = new PagedResponse();
		const sql: string = `with subjects_analytics_progress as (
                            select uap.subject_id , avg(uap.progress) as progress
                            from user_analytics_progress uap
                            where uap.progress_type = 'chapter' and uap.deleted = false and uap.semester_id =  '${ctx.params.semesterId}'
                            and uap.user_id = '${ctx.params.userId}'
                            group by uap.subject_id
                          ),
                          assign_activity_questions as (
                            select aa.id,count(*) as totalQuestions from questions q
                            join assigned_activities aa on q.assigned_activity_id = aa.id
                            where q.deleted = false
                            group by aa.id
                            having count(*)>0
                          ),
                          question_user_assigned_activities as (
                          	select distinct s.id from subjects s
                          	join chapters c on c.subject_id  = s.id
                          	join topics t on t.chapter_id = c.id
                            join uni_topics ut on ut.id = t.universal_topic_id
                            join assigned_activities aa on aa.universal_topic_id = ut.id
                            join assign_activity_questions aaq on aaq.id = aa.id
                          	where s.semester_id =  '${ctx.params.semesterId}' and
                          	  c.deleted = false and
                              t.deleted = false and
                              ut.deleted = false and
                              aa.deleted = false and
                              s.deleted = false
                          )
                          select s.*, s.id as subjectId, sap.progress
                          from subjects s
                          join question_user_assigned_activities qua on qua.id = s.id
                          left join subjects_analytics_progress sap on sap.subject_id = s.id
                          where s.deleted = false and s.semester_id =  '${ctx.params.semesterId}'
                          limit ${limit} offset ${offset}`;

		response.items = await this.runSql(sql);

		const counSql: string = `with subjects_analytics_progress as (
                                select uap.subject_id, avg(uap.progress) as progress
                                from user_analytics_progress uap
                                where uap.progress_type = 'chapter'
                                  and uap.deleted = false
                                  and uap.semester_id = '${ctx.params.semesterId}'
                                  and uap.user_id = '${ctx.params.userId}'
                                group by uap.subject_id
                            ),
                            assign_activity_questions as (
                                select aa.id, count(*) as totalQuestions
                                from questions q
                                join assigned_activities aa on q.assigned_activity_id = aa.id
                                where q.deleted = false
                                group by aa.id
                                having count(*) > 0
                            ),
                            question_user_assigned_activities as (
                                select distinct s.id
                                from subjects s
                                join chapters c on c.subject_id = s.id
                                join topics t on t.chapter_id = c.id
                                join uni_topics ut on ut.id = t.universal_topic_id
                                join assigned_activities aa on aa.universal_topic_id = ut.id
                                join assign_activity_questions aaq on aaq.id = aa.id
                                where s.semester_id = '${ctx.params.semesterId}'
                                      and c.deleted = false
                                      and t.deleted = false
                                      and ut.deleted = false
                                      and aa.deleted = false
                                      and s.deleted = false
                            )
                            select count(*)
                            from subjects s
                            join question_user_assigned_activities qua on qua.id = s.id
                            left join subjects_analytics_progress sap on sap.subject_id = s.id
                            where s.deleted = false
                                  and s.semester_id = '${ctx.params.semesterId}';
                        `;
		response.totalCount = await this.runSqlGetCount(counSql);
		return response;
	}

	public static async getUserSubjects(ctx: ContextWrapper): Promise<PagedResponse<UserSubjectsAnalyticMapper>> {
		const { offset, limit } = SystemHelper.getOffsetAndLimit(+ctx.params.offset, +ctx.params.limit);
		const response: PagedResponse<any> = new PagedResponse();
		const sql: string = `with subjects_analytics_progress as (
                            select uap.subject_id , avg(uap.progress) as progress
                            from user_analytics_progress uap
                            where uap.progress_type = 'chapter' and uap.deleted = false and uap.semester_id = '${ctx.params.semesterId}'
                            and uap.user_id = '${ctx.params.userId}'
                            group by uap.subject_id
                          )
                          select s.*, s.id as subjectId, sap.progress
                          from subjects s
                          left join subjects_analytics_progress sap on sap.subject_id = s.id
                          where s.deleted = false and s.semester_id = '${ctx.params.semesterId}'
			                    limit ${limit} offset ${offset}`;

		console.log(sql);

		response.items = await this.runSql(sql);
		const counSql: string = `select count(*) from subjects s
                             where s.deleted = false and s.semester_id = '${ctx.params.semesterId}'`;
		response.totalCount = await this.runSqlGetCount(counSql);
		return response;
	}

	public static async getUserSubjectMetrics(ctx: ContextWrapper) {
		const sql: string = `select
		                      count(DISTINCT uaa.chapter_id) as "noOfChapters",
		                      count(DISTINCT uaa.topic_id) as "noOfTopics",
		                      count(DISTINCT uaa.activity_dm_id) as "noOfActivities",
		                      uaa.subject_id as subjectId
		                    from user_activity_analytics uaa
		                    where uaa.deleted = false and
		                      uaa.user_id = '${ctx.params.userId}' and
		                      uaa.semester_id = '${ctx.params.semesterId}' and
		                      uaa.branch_id = '${ctx.params.branchId}'
		                    group by uaa.subject_id`;
		return await this.runSql(sql);
	}

	public static async getUserChapterMetrics(ctx: ContextWrapper) {
		const sql: string = `select
                          count(DISTINCT uaa.topic_id) as "noOfTopics",
                          count(DISTINCT uaa.activity_dm_id) as "noOfActivities",
                          uaa.chapter_id as chapterId
                        from user_activity_analytics uaa
                        where uaa.deleted = false and
                          uaa.user_id = '${ctx.params.userId}' and
                          uaa.semester_id = '${ctx.params.semesterId}' and
                          uaa.branch_id = '${ctx.params.branchId}' and
                          uaa.subject_id = '${ctx.params.subjectId}'
                        group by uaa.chapter_id`;
		return await this.runSql(sql);
	}

	public static async getUserChapters(ctx: ContextWrapper): Promise<PagedResponse<UserChaptersAnalyticMapper>> {
		const { offset, limit } = SystemHelper.getOffsetAndLimit(+ctx.params.offset, +ctx.params.limit);
		const response: PagedResponse<any> = new PagedResponse();
		const sql: string = `select
                          c.subject_id  as subjectId,
                          c.id as chapterId,
                          c.name as chapterName,
                          c.description as description,
                          c.idx ,
                          c.image,
                          uap.progress
                        from chapters c
                        left join user_analytics_progress uap on uap.chapter_id = c.id and uap.progress_type = '${UserProgressAnalyticsType.Chapter}' and uap.user_id = '${ctx.params.userId}'
                        where
                          c.subject_id = '${ctx.params.subjectId}' and c.deleted = false
                        order by c.idx
                        limit ${limit} offset ${offset}`;
		response.items = await this.runSql(sql);
		const counSql: string = `select count(*) as count
                             from chapters c
                             left join user_analytics_progress uap on uap.chapter_id = c.id and uap.progress_type = '${UserProgressAnalyticsType.Chapter}' and uap.user_id = '${ctx.params.userId}'
                             where
                                c.subject_id = '${ctx.params.subjectId}' and c.deleted = false`;
		response.totalCount = await this.runSqlGetCount(counSql);
		return response;
	}

	public static async getUserTopics(ctx: ContextWrapper): Promise<PagedResponse<UserTopicsAnalyticMapper>> {
		const { offset, limit } = SystemHelper.getOffsetAndLimit(+ctx.params.offset, +ctx.params.limit);
		const response: PagedResponse<any> = new PagedResponse();
		const sql: string = ` select
                            t.id  as topicId,
                            t.name as topicName,
                            t.description as topicDescription,
                            t.universal_topic_id as universalTopicId,
                            t.idx,
                            t.code,
                            ut.image,
                            uap.progress
                          from topics t
                          join uni_topics ut on ut.id = t.universal_topic_id
                          left join user_analytics_progress uap on uap.topic_id = t.id and uap.progress_type = '${UserProgressAnalyticsType.Topic}' and uap.user_id = '${ctx.params.userId}'
                          where
                            t.chapter_id = '${ctx.params.chapterId}' and t.deleted = false and ut.deleted = false
                          order by t.idx
                          limit ${limit} offset ${offset}`;
		response.items = await this.runSql(sql);
		const counSql: string = `select count(*) as count
                             from topics t
                             join uni_topics ut on ut.id = t.universal_topic_id
                             left join user_analytics_progress uap on uap.topic_id = t.id and uap.progress_type = '${UserProgressAnalyticsType.Topic}' and uap.user_id = '${ctx.params.userId}'
                             where
                              t.chapter_id = '${ctx.params.chapterId}' and
                              t.deleted = false and ut.deleted = false`;
		response.totalCount = await this.runSqlGetCount(counSql);
		return response;
	}

	public static async getUserTopicMetrics(ctx: ContextWrapper) {
		const sql: string = `select
                          count(DISTINCT uaa.activity_dm_id) as "noOfActivities",
                          uaa.topic_id as topicId
                         from user_activity_analytics uaa
                          where uaa.deleted = false and
                            uaa.user_id = '${ctx.params.userId}' and
                            uaa.semester_id = '${ctx.params.semesterId}' and
                            uaa.branch_id = '${ctx.params.branchId}' and
                            uaa.subject_id = '${ctx.params.subjectId}' and
                            uaa.chapter_id = '${ctx.params.chapterId}'
                          group by uaa.topic_id`;
		return await this.runSql(sql);
	}

	public static async getUserActivities(ctx: ContextWrapper) {
		const sql: string = `with questionCount as (
                           select q.assigned_activity_id, COUNT(*) AS totalQuestions
                           from user_test_questions utq
                           join user_tests ut ON ut.id = utq.user_test_id
                           join questions q ON q.id = utq.question_id
                           join assigned_activities aa ON aa.id = q.assigned_activity_id
                           join activities a ON a.id = aa.activity_id
                           where
                            ut.deleted = false and
                            ut.test_type = 'Topic'
                            group by ut.id
                        )
                        select
                          aa.name,
                          aa.id as assignedActivityId,
                          a.activity_type as activityType,
                          a.faIcon,
                          a.card_image as cardImage,
                          COALESCE(qc.totalQuestions, 5) as totalQuestions,
                          ai.duration,
                          ai.pdf_pages as pdfPages,
                          ad.status,
                          aa.seq,
                          uaa.progress,
                          uaa.id as "userAnalyticId",
                          ad.id as "activityDimId",
                          uaa.updated_at as "updatedAt"
                        from user_activity_analytics uaa
                        join activity_dim ad on ad.id = uaa.activity_dm_id and ad.deleted = false
                        join assigned_activities aa on aa.id = ad.activity_id and aa.resource_type = 'admin'
                        join activities a on a.id = aa.activity_id
                        left join activity_info ai on ai.assigned_activity_id = aa.id
                        left join questionCount qc on qc.assigned_activity_id = aa.id
                        where
	                        uaa.topic_id = '${ctx.params.topicId}' and
	                        uaa.chapter_id = '${ctx.params.chapterId}' and
	                        uaa.user_id = '${ctx.params.userId}' and
                          uaa.deleted = false
                        group by aa.id
                        order by aa.seq`;
		return await this.runSql(sql);
	}

	public static async getGeneralStudentAnalyticsConfig(ctx: ContextWrapper) {
		const sql: string = `select
                            ub.user_id as userId,
                            ub.university_id as universityId,
                            ub.branch_id as branchId,
                            ub.semester_id as semesterId,
                            ub.college_id as collegeId,
                            ub.section_id as sectionId,
                            s.id as subjectId,
                            c.id as chapterId,
                            t.id as topicId,
                            aa.id as assignedActivityId,
                            ai.id as activityInfoId,
                            a.activity_type as activityType
                        from user_branches ub
                        join semesters sem on sem.branch_id = ub.branch_id
                        join subjects s on s.semester_id = sem.id
                        join chapters c on c.subject_id = s.id
                        join topics t on t.chapter_id = c.id
                        join uni_topics ut on ut.id = t.universal_topic_id
                        join assigned_activities aa on aa.universal_topic_id = ut.id and aa.deleted = false and aa.resource_type = 'admin'
                        left join activity_info ai on ai.assigned_activity_id = aa.id and ai.deleted = false
                        left join activities a on a.id = aa.activity_id and a.deleted = false
                        where
                          ub.university_id = '${ctx.params.universityId}' and
                          ub.user_id = '${ctx.params.userId}' and
                          ub.branch_id = '${ctx.params.branchId}' and
                          ub.semester_id ='${ctx.params.semesterId}' and
                          aa.deleted = false and
                          a.deleted = false and
                          ut.deleted = false  and
                          sem.deleted = false and
                          s.deleted = false and
                          c.deleted = false and
                          t.deleted = false
                          order by s.created_at desc`;
		return await this.runSql(sql);
	}

	public static async getStudentAnalyticsConfig(ctx: ContextWrapper) {
		const sql: string = `select
                            ub.user_id as userId,
                            ub.university_id as universityId,
                            ub.branch_id as branchId,
                            ub.semester_id as semesterId,
                            ub.college_id as collegeId,
                            ub.section_id as sectionId,
                            s.id as subjectId,
                            c.id as chapterId,
                            t.id as topicId,
                            aa.id as assignedActivityId,
                            ai.id as activityInfoId,
                            a.activity_type as activityType
                        from user_branches ub
                        join semesters sem on sem.branch_id = ub.branch_id
                        join subjects s on s.semester_id = sem.id and sem.id = '${ctx.params.semesterId}'
                        join chapters c on c.subject_id = s.id
                        join topics t on t.chapter_id = c.id
                        join uni_topics ut on ut.id = t.universal_topic_id
                        join assigned_activities aa on aa.universal_topic_id = ut.id and aa.deleted = false and aa.resource_type = 'admin'
                        left join activity_info ai on ai.assigned_activity_id = aa.id and ai.deleted = false
                        left join activities a on a.id = aa.activity_id and a.deleted = false
                        where
                          ub.university_id = '${ctx.params.universityId}' and
                          ub.user_id = '${ctx.params.userId}' and
                          ub.branch_id = '${ctx.params.branchId}' and
                          ub.semester_id ='${ctx.params.semesterId}' and
                          ub.college_id ='${ctx.params.collegeId}' and
                          aa.deleted = false and
                          a.deleted = false and
                          ut.deleted = false  and
                          sem.deleted = false and
                          s.deleted = false and
                          c.deleted = false and
                          t.deleted = false
                          order by s.created_at desc`;
		return await this.runSql(sql);
	}

	public static async getUserActivityAnalyticInfo(ctx: ContextWrapper) {
		const sql: string = `select
                          ad.id as activityDimId,
                          ai.pdf_pages as pdfPages,
                          ad.activity_type as activityType,
                          ai.url,
                          ai.duration,
                          ai.valid_pdf_pages as validPdfPages,
                          ad.video_paused_at as videoPausedAt,
                          ad.pdf_page_paused_at as pdfPagePausedAt,
                          ad.activity_id as "assignedActivityId"
                        from activity_dim ad
                        left join activity_info ai on ai.assigned_activity_id = ad.activity_id and ai.deleted = false
                        where
                          ad.deleted = false and
                          ad.id = '${ctx.params.activityDimId}' and
                          ad.activity_type not in ('${ActivityCodeType.Pre}','${ActivityCodeType.Post}')`;
		return await this.runSqlFindOne(sql);
	}

	public static async getUserTestQuestionsForAnalysis(ctx: ContextWrapper) {
		const sql: string = `select
                          utq.id as questionId,
                          utq.actual_duration as actualDuration,
                          utq.time_taken as timeTaken, utq.analysis, utq.status,
                          mark_allocation as markAllocation,
                          utq.score ,
                          q.diff_level as diffLevel,
                          q.question_type as questionType,
                          aa.universal_topic_id as universalTopicId
                        from user_test_questions utq
                        join user_tests ut on ut.id = utq.user_test_id and ut.deleted=false and ut.test_type='Topic'
                        join questions q on q.id = utq.question_id
                        join assigned_activities aa on aa.id = q.assigned_activity_id
                        join activities a on a.id = aa.activity_id and a.activity_type = '${ActivityCodeType.Post}'
                        where
                          aa.universal_topic_id = '${ctx.params.universalTopicId}' and
                          ut.status ='${ActivityStatus.Completed}' and
                          ut.user_id = '${ctx.params.userId}' and
                          utq.deleted = false and
                          q.deleted = false and
                          aa.deleted = false
                          order by utq.created_at asc
                          `;

		const userTestQuestions = await this.runSql(sql);

		const progressSql: string = `select avg(progress) as totalProgress
                                 from user_activity_analytics uaa
                                where
                                  uaa.topic_id = '${ctx.params.topicId}' and
                                  uaa.user_id = '${ctx.params.userId}' and
                                  uaa.deleted = false `;
		const topicProgress = await this.runSqlFindOne(progressSql);

		const timeSpentSql: string = `select
                                    ad.activity_type as activityType,
                                    sum(td.duration) as timeSpent
                                  from user_activity_analytics uaa
                                  join time_dim td on td.id = uaa.time_id
                                  join activity_dim ad on ad.id = uaa.activity_dm_id
                                  where
                                    uaa.topic_id = '${ctx.params.topicId}' and
                                    uaa.deleted = false and
                                    uaa.user_id = '${ctx.params.userId}' and
                                    td.deleted = false and
                                    ad.deleted = false
                                  GROUP by ad.activity_type `;
		const timeSpent = await this.runSql(timeSpentSql);

		return { userTestQuestions, topicProgress, timeSpent };
	}

	public static async getUserInprogressTopics(ctx: ContextWrapper) {
		const { offset, limit } = SystemHelper.getOffsetAndLimit(+ctx.params.offset, +ctx.params.limit);
		//TODO: @20th-Feb :: this should work for non default topics
		const sql: string = `with InProgressTopics as (
                          select
                            ut.topic_name topicName,
                            t.id as topicId,
                            t.code,
                            ut.image,
                            t.description as topicDescription,
                            ut.id as universaltopicId,
                            uaa.subject_id as subjectId,
                            uaa.chapter_id as chapterId,
                            avg(uaa.progress) as progress
                        from user_activity_analytics uaa
                        join topics t on t.id = uaa.topic_id
                        join uni_topics ut on ut.id = t.universal_topic_id
                        where
                          uaa.user_id = '${ctx.params.userId}' and
                          uaa.deleted = false and
                          t.deleted = false and
                          ut.deleted = false
                        group by ut.topic_name
                        order by uaa.updated_at desc
                      )
                      select * from InProgressTopics
                      where progress > 0 and progress <> 100
                      limit ${limit} offset ${offset}`;
		return await this.runSql(sql);
	}

	public static async getRecommendedLearningTopics(ctx: ContextWrapper) {
		//TODO: @11th-Apr :: Need to capture topic id in unit test analytics
		const { offset, limit } = SystemHelper.getOffsetAndLimit(+ctx.params.offset, +ctx.params.limit);
		const sql: string = `with scores as (
                          select
                          ut.assigned_activity_id as assignedActivityId,
                          t.universal_topic_id as universalTopicId,
                          uit.dependency_topics as dependencyTopics,
                          c.id as chapterId,
                          c.subject_id as subjectId,
                          t.name as topicName,
                          t.id as topicId,
                          uit.image,
                          t.code,
                          max(ut.score) as score,
                          RANK() Over(order by max(ut.score) asc) as 'rank'
                        from user_tests ut
                        join assigned_activities aa on aa.id = ut.assigned_activity_id
                        join activities a on a.id = aa.activity_id and a.activity_type = 'post'
                        join user_branches ub on ub.user_id = '${ctx.params.userId}'
                        join subjects s on s.semester_id =ub.semester_id
                        join chapters c on c.subject_id  = s.id
                        join topics t on t.universal_topic_id = aa.universal_topic_id and c.id  = t.chapter_id
                        join uni_topics uit on uit.id = t.universal_topic_id
                        where
                          ut.status ='${ActivityStatus.Completed}' and
                          test_type = '${UserTestType.Topic}' and
                          ut.user_id = '${ctx.params.userId}'
                        group by t.universal_topic_id
                        )
                        select * from scores s
                        where s.score <> 100
                        limit ${limit} offset ${offset}`;
		return await this.runSql(sql);
	}

	public static async getSubjectKnowledgMapPerformanceStats(ctx: ContextWrapper) {
		const sql: string = `with usersInfo as (
                          select ub.user_id as userId, ub.semester_id as semesterId, ub.college_id as collegeId, ub.section_id ,
                          u.email , r.name, u.first_name as firstName, u.last_name as lastName
                          from user_branches ub
                          join users u on u.id = ub.user_id
                          join user_roles ur on ur.user_id = u.id
                          join roles r on r.id = ur.role_id
                          where
                            ub.deleted = false and
                            u.deleted = false and
                            ur.deleted = false and
                            r.deleted = false  and
                            r.name = 'Student' and
                            ub.semester_id = '${ctx.params.semesterId}' and
                            ub.college_id = '${ctx.params.collegeId}' and
                            ub.branch_id = '${ctx.params.branchId}' and
                            ub.section_id = '${ctx.params.sectionId}'
                          )
                        select
                          ut.user_id as userId,
                          s.id as subjectId,
                          avg(ut.score) score
                        from subjects s
                        join chapters c on c.subject_id = s.id
                        join topics t on t.chapter_id = c.id
                        join uni_topics uit on uit.id = t.universal_topic_id
                        join assigned_activities aa on aa.universal_topic_id = t.universal_topic_id
                        join activities a on a.id = aa.activity_id and a.deleted = false and a.activity_type = 'post'
                        left join user_tests ut on ut.assigned_activity_id = aa.id and ut.test_type = 'Topic'
                        join usersInfo ui on ui.userId = ut.user_id
                        where
                          s.semester_id = '${ctx.params.semesterId}' and
                          s.id = '${ctx.params.subjectId}' and
                          ut.deleted = false and
                          c.deleted = false and
                          uit.deleted = false and
                          aa.deleted = false and
                          t.deleted = false
                        group by ut.user_id, s.id`;
		return await this.runSql(sql);
	}

	public static async getSubjectKnowledgMapProgressStats(ctx: ContextWrapper) {
		const sql: string = `with usersInfo as (
                          select ub.user_id as userId, ub.semester_id as semesterId, ub.college_id as collegeId, u.email , r.name, u.first_name as firstName, u.last_name as lastName
                          from user_branches ub
                          join users u on u.id = ub.user_id
                          join user_roles ur on ur.user_id = u.id
                          join roles r on r.id = ur.role_id
                          where
                            ub.deleted = false and
                            u.deleted = false and
                            ur.deleted = false and
                            r.deleted = false  and
                            r.name = '${UserRoleType.Student}' and
                            ub.semester_id = '${ctx.params.semesterId}' and
                            ub.college_id = '${ctx.params.collegeId}' and
                            ub.branch_id = '${ctx.params.branchId}' and
                            ub.section_id = '${ctx.params.sectionId}'
                          )
                        select
                          uaa.user_id as userId,
                          uaa.subject_id as subjectId,
                          Round(((count(DISTINCT uaa.activity_dm_id)/sum(progress))*100), 2) as progress
                        from user_activity_analytics uaa
                        join subjects s on s.id = uaa.subject_id and s.deleted = false
                        join usersInfo ui on ui.userId = uaa.user_id
                        where
                          uaa.deleted = false and
                          s.semester_id = '${ctx.params.semesterId}' and
                          ui.collegeId = '${ctx.params.collegeId}' and
                          s.id = '${ctx.params.subjectId}'
                        group by uaa.user_id , uaa.subject_id`;
		return await this.runSql(sql);
	}

	public static async getChapterKnowledgMapProgressStats(ctx: ContextWrapper) {
		const sql: string = `with usersInfo as (
                          select ub.user_id as userId, ub.semester_id as semesterId, ub.college_id as collegeId, u.email , r.name, u.first_name as firstName, u.last_name as lastName
                          from user_branches ub
                          join users u on u.id = ub.user_id
                          join user_roles ur on ur.user_id = u.id
                          join roles r on r.id = ur.role_id
                          where
                            ub.deleted = false and
                            u.deleted = false and
                            ur.deleted = false and
                            r.deleted = false  and
                            r.name = '${UserRoleType.Student}' and
                            ub.semester_id = '${ctx.params.semesterId}' and
                            ub.college_id = '${ctx.params.collegeId}' and
                            ub.branch_id = '${ctx.params.branchId}' and
                            ub.section_id = '${ctx.params.sectionId}'
                          )
                        select
                          uaa.user_id as userId,
                          uaa.chapter_id as chapterId,
                          Round(((count(DISTINCT uaa.activity_dm_id)/sum(progress))*100), 2) as progress
                        from user_activity_analytics uaa
                        join usersInfo ui on ui.userId = uaa.user_id
                        where
                          uaa.deleted = false and
                          uaa.semester_id = '${ctx.params.semesterId}' and
                          uaa.college_id = '${ctx.params.collegeId}' and
                          uaa.subject_id = '${ctx.params.subjectId}' and
                          uaa.chapter_id = '${ctx.params.chapterId}'
                        group by uaa.user_id , uaa.chapter_id`;
		return await this.runSql(sql);
	}

	public static async getChapterKnowledgMapPerformanceStats(ctx: ContextWrapper) {
		const sql: string = `with usersInfo as (
                          select
                            ub.user_id as userId,
                            ub.semester_id as semesterId,
                            ub.college_id as collegeId,
                            ub.section_id,
                            u.email,
                            r.name,
                            u.first_name as firstName,
                            u.last_name as lastName
                          from user_branches ub
                          join users u on u.id = ub.user_id
                          join user_roles ur on ur.user_id = u.id
                          join roles r on r.id = ur.role_id
                          where
                            ub.deleted = false and
                            u.deleted = false and
                            ur.deleted = false and
                            r.deleted = false  and
                            r.name = '${UserRoleType.Student}' and
                            ub.semester_id = '${ctx.params.semesterId}' and
                            ub.college_id = '${ctx.params.collegeId}' and
                            ub.branch_id = '${ctx.params.branchId}' and
                            ub.section_id = '${ctx.params.sectionId}'
                          )
                        select
                          ut.user_id as userId,
                          c.id as chapterId,
                          avg(ut.score) score
                        from subjects s
                        join chapters c on c.subject_id = s.id
                        join topics t on t.chapter_id = c.id
                        join uni_topics uit on uit.id = t.universal_topic_id
                        join assigned_activities aa on aa.universal_topic_id = t.universal_topic_id
                        join activities a on a.id = aa.activity_id and a.deleted = false and a.activity_type = 'post'
                        left join user_tests ut on ut.assigned_activity_id = aa.id and ut.test_type = 'Topic'
                        join usersInfo ui on ui.userId = ut.user_id
                        where
                          s.semester_id = '${ctx.params.semesterId}' and
                          s.id = '${ctx.params.subjectId}' and
                          c.id = '${ctx.params.chapterId}' and
                          ut.deleted = false and
                          c.deleted = false and
                          uit.deleted = false and
                          aa.deleted = false and
                          t.deleted = false
                        group by ut.user_id, c.id`;
		return await this.runSql(sql);
	}

	public static async getTopicKnowledgMapProgressStats(ctx: ContextWrapper) {
		const sql: string = `with usersInfo as (
                          select
                            ub.user_id as userId,
                            ub.semester_id as semesterId,
                            ub.college_id as collegeId,
                            u.email ,
                            r.name,
                            u.first_name as firstName,
                            u.last_name as lastName
                          from user_branches ub
                          join users u on u.id = ub.user_id
                          join user_roles ur on ur.user_id = u.id
                          join roles r on r.id = ur.role_id
                          where
                            ub.deleted = false and
                            u.deleted = false and
                            ur.deleted = false and
                            r.deleted = false  and
                            r.name = '${UserRoleType.Student}' and
                            ub.semester_id = '${ctx.params.semesterId}' and
                            ub.college_id = '${ctx.params.collegeId}' and
                            ub.branch_id = '${ctx.params.branchId}' and
                            ub.section_id = '${ctx.params.sectionId}'
                          )
                        select
                          uaa.user_id as userId,
                          uaa.topic_id as topicId,
                          Round(((count(DISTINCT uaa.activity_dm_id)/sum(progress))*100), 2) as progress
                        from user_activity_analytics uaa
                        join usersInfo ui on ui.userId = uaa.user_id
                        where
                          uaa.deleted = false and
                          uaa.semester_id = '${ctx.params.semesterId}' and
                          uaa.college_id = '${ctx.params.collegeId}' and
                          uaa.subject_id = '${ctx.params.subjectId}' and
                          uaa.chapter_id = '${ctx.params.chapterId}' and
                          uaa.topic_id = '${ctx.params.topicId}'
                        group by uaa.user_id , uaa.topic_id`;
		return await this.runSql(sql);
	}

	public static async getTopicKnowledgMapPerformanceStats(ctx: ContextWrapper) {
		const sql: string = `with usersInfo as (
                          select ub.user_id as userId, ub.semester_id as semesterId, ub.college_id as collegeId, ub.section_id ,
                          u.email , r.name, u.first_name as firstName, u.last_name as lastName
                          from user_branches ub
                          join users u on u.id = ub.user_id
                          join user_roles ur on ur.user_id = u.id
                          join roles r on r.id = ur.role_id
                          where
                            ub.deleted = false and
                            u.deleted = false and
                            ur.deleted = false and
                            r.deleted = false  and
                            r.name = 'Student' and
                            ub.semester_id = '${ctx.params.semesterId}' and
                            ub.college_id = '${ctx.params.collegeId}' and
                            ub.branch_id = '${ctx.params.branchId}' and
                            ub.section_id = '${ctx.params.sectionId}'
                          )
                        select
                          ut.user_id as userId,
                          t.id as topicId,
                          avg(ut.score) score
                        from subjects s
                        join chapters c on c.subject_id = s.id
                        join topics t on t.chapter_id = c.id
                        join uni_topics uit on uit.id = t.universal_topic_id
                        join assigned_activities aa on aa.universal_topic_id = t.universal_topic_id
                        join activities a on a.id = aa.activity_id and a.deleted = false and a.activity_type = 'post'
                        left join user_tests ut on ut.assigned_activity_id = aa.id and ut.test_type = 'Topic'
                        join usersInfo ui on ui.userId = ut.user_id
                        where
                          s.semester_id = '${ctx.params.semesterId}' and
                          s.id = '${ctx.params.subjectId}' and
                          c.id = '${ctx.params.chapterId}' and
                          t.id = '${ctx.params.topicId}' and
                          ut.deleted = false and
                          c.deleted = false and
                          uit.deleted = false and
                          aa.deleted = false and
                          t.deleted = false
                        group by ut.user_id, t.id`;
		return await this.runSql(sql);
	}

	public static async getProfessorSubjectAverages(ctx: ContextWrapper) {
		const courseProgressAverageSql: string = `select
                                                uaa.subject_id as subjectId,
                                                ROUND(avg(progress),2) as progress,
                                                s.name as subjectName
                                              from user_activity_analytics uaa
                                              join subjects s on s.id = uaa.subject_id
                                              where
                                                uaa.deleted = false and
                                                uaa.semester_id = '${ctx.params.semesterId}' and
                                                uaa.college_id = '${ctx.params.collegeId}' and
                                                uaa.branch_id = '${ctx.params.branchId}' and
                                                uaa.section_id = '${ctx.params.sectionId}' and
                                                uaa.deleted = false
                                              group by uaa.subject_id `;
		const courseProgressAverage = await this.runSql(courseProgressAverageSql);

		const usersWeeklyEngagementSql: string = `select
                                                ROUND(avg(progress),2) as progress
                                              from user_activity_analytics uaa
                                              join subjects s on s.id = uaa.subject_id
                                              where
                                                uaa.deleted = false and
                                                uaa.semester_id = '${ctx.params.semesterId}' and
                                                uaa.college_id = '${ctx.params.collegeId}' and
                                                uaa.branch_id = '${ctx.params.branchId}' and
                                                uaa.section_id = '${ctx.params.sectionId}' and
                                                uaa.deleted = false and
                                                uaa.updated_at >= DATE(NOW() - INTERVAL 7 DAY)`;

		const usersWeeklyEngagement = await this.runSqlFindOne(usersWeeklyEngagementSql);

		return { courseProgressAverage, usersWeeklyEngagement };
	}

	public static async getSubjectPreAndPostTestProfessorAnalysis(ctx: ContextWrapper) {
		const sql: string = `with usersInfo as (
                          select
                            ub.user_id as userId,
                            ub.semester_id as semesterId,
                            ub.college_id as collegeId,
                            ub.section_id,
                            u.email,
                            r.name,
                            u.first_name as firstName,
                            u.last_name as lastName
                          from user_branches ub
                          join users u on u.id = ub.user_id
                          join user_roles ur on ur.user_id = u.id
                          join roles r on r.id = ur.role_id
                          where
                            ub.deleted = false and
                            u.deleted = false and
                            ur.deleted = false and
                            r.deleted = false  and
                            r.name = 'Student' and
                            ub.semester_id = '${ctx.params.semesterId}' and
                            ub.college_id = '${ctx.params.collegeId}' and
                            ub.branch_id = '${ctx.params.branchId}' and
                            ub.section_id = '${ctx.params.sectionId}'
                          )
                        select
                          c.id as chapterId,
                          c.name as chapterName,
                          a.activity_type as activityType,
                          Round(avg(ut.score),2) as score
                        from subjects s
                        join chapters c on c.subject_id = s.id
                        join topics t on t.chapter_id = c.id
                        join uni_topics uit on uit.id = t.universal_topic_id
                        join assigned_activities aa on aa.universal_topic_id = t.universal_topic_id
                        join activities a on a.id = aa.activity_id and a.deleted = false and (a.activity_type = '${ActivityCodeType.Post}' or a.activity_type = '${ActivityCodeType.Pre}' )
                        left join user_tests ut on ut.assigned_activity_id = aa.id and ut.test_type = '${UserTestType.Topic}'
                        join usersInfo ui on ui.userId = ut.user_id
                        where
                          s.semester_id = '${ctx.params.semesterId}' and
                          s.id = '${ctx.params.subjectId}' and
                          ut.deleted = false and
                          c.deleted = false and
                          uit.deleted = false and
                          aa.deleted = false and
                          t.deleted = false
                        group by  s.id, a.activity_type `;
		return await this.runSql(sql);
	}

	public static async getChapterPreAndPostTestProfessorAnalysis(ctx: ContextWrapper) {
		const sql: string = `with usersInfo as (
                          select
                            ub.user_id as userId,
                            ub.semester_id as semesterId,
                            ub.college_id as collegeId,
                            ub.section_id,
                            u.email,
                            r.name,
                            u.first_name as firstName,
                            u.last_name as lastName
                          from user_branches ub
                          join users u on u.id = ub.user_id
                          join user_roles ur on ur.user_id = u.id
                          join roles r on r.id = ur.role_id
                          where
                            ub.deleted = false and
                            u.deleted = false and
                            ur.deleted = false and
                            r.deleted = false  and
                            r.name = 'Student' and
                            ub.semester_id = '${ctx.params.semesterId}' and
                            ub.college_id = '${ctx.params.collegeId}' and
                            ub.branch_id = '${ctx.params.branchId}' and
                            ub.section_id = '${ctx.params.sectionId}'
                          )
                        select
                          t.id as topicId,
                          t.name as topicName,
                          a.activity_type as activityType,
                          Round(avg(ut.score),2) as score
                        from subjects s
                        join chapters c on c.subject_id = s.id
                        join topics t on t.chapter_id = c.id
                        join uni_topics uit on uit.id = t.universal_topic_id
                        join assigned_activities aa on aa.universal_topic_id = t.universal_topic_id
                        join activities a on a.id = aa.activity_id and a.deleted = false and (a.activity_type = '${ActivityCodeType.Post}' or a.activity_type = '${ActivityCodeType.Pre}' )
                        left join user_tests ut on ut.assigned_activity_id = aa.id and ut.test_type = '${UserTestType.Topic}'
                        join usersInfo ui on ui.userId = ut.user_id
                        where
                          s.semester_id = '${ctx.params.semesterId}' and
                          s.id = '${ctx.params.subjectId}' and
                          c.id = '${ctx.params.chapterId}' and
                          ut.deleted = false and
                          c.deleted = false and
                          uit.deleted = false and
                          aa.deleted = false and
                          t.deleted = false
                        group by  t.id, a.activity_type `;
		return await this.runSql(sql);
	}

	public static async getTopicPreAndPostTestProfessorAnalysis(ctx: ContextWrapper) {
		const sql: string = `with usersInfo as (
                          select
                            ub.user_id as userId,
                            ub.semester_id as semesterId,
                            ub.college_id as collegeId,
                            ub.section_id,
                            u.email,
                            r.name,
                            u.first_name as firstName,
                            u.last_name as lastName
                          from user_branches ub
                          join users u on u.id = ub.user_id
                          join user_roles ur on ur.user_id = u.id
                          join roles r on r.id = ur.role_id
                          where
                            ub.deleted = false and
                            u.deleted = false and
                            ur.deleted = false and
                            r.deleted = false  and
                            r.name = 'Student' and
                            ub.semester_id = '${ctx.params.semesterId}' and
                            ub.college_id = '${ctx.params.collegeId}' and
                            ub.branch_id = '${ctx.params.branchId}' and
                            ub.section_id = '${ctx.params.sectionId}'
                          )
                        select
                          t.id as topicId,
                          t.name as topicName,
                          a.activity_type as activityType,
                          Round(avg(ut.score),2) as score
                        from subjects s
                        join chapters c on c.subject_id = s.id
                        join topics t on t.chapter_id = c.id
                        join uni_topics uit on uit.id = t.universal_topic_id
                        join assigned_activities aa on aa.universal_topic_id = t.universal_topic_id
                        join activities a on a.id = aa.activity_id and a.deleted = false and (a.activity_type = '${ActivityCodeType.Post}' or a.activity_type = '${ActivityCodeType.Pre}' )
                        left join user_tests ut on ut.assigned_activity_id = aa.id and ut.test_type = '${UserTestType.Topic}'
                        join usersInfo ui on ui.userId = ut.user_id
                        where
                          s.semester_id = '${ctx.params.semesterId}' and
                          s.id = '${ctx.params.subjectId}' and
                          c.id = '${ctx.params.chapterId}' and
                          t.id = '${ctx.params.topicId}' and
                          ut.deleted = false and
                          c.deleted = false and
                          uit.deleted = false and
                          aa.deleted = false and
                          t.deleted = false
                        group by  t.id, a.activity_type `;
		return await this.runSql(sql);
	}

	public static async getBloomTaxonomyProfessorAnalysis(ctx: ContextWrapper) {
		const sql: string = `with usersInfo as (
                          select ub.user_id as userId, ub.semester_id as semesterId, ub.college_id as collegeId, ub.section_id ,
                          u.email , r.name, u.first_name as firstName, u.last_name as lastName
                          from user_branches ub
                          join users u on u.id = ub.user_id
                          join user_roles ur on ur.user_id = u.id
                          join roles r on r.id = ur.role_id
                          where
                            ub.deleted = false and
                            u.deleted = false and
                            ur.deleted = false and
                            r.deleted = false  and
                            r.name = '${UserRoleType.Student}' and
                            ub.semester_id = '${ctx.params.semesterId}' and
                            ub.college_id = '${ctx.params.collegeId}' and
                            ub.branch_id = '${ctx.params.branchId}' and
                            ub.section_id = '${ctx.params.sectionId}'
                          )
                        select
                          q.question_type as questionType,
                          count(utq.id) as totalQuestions
                        from subjects s
                        join chapters c on c.subject_id = s.id
                        join topics t on t.chapter_id = c.id
                        join uni_topics uit on uit.id = t.universal_topic_id
                        join assigned_activities aa on aa.universal_topic_id = t.universal_topic_id
                        join activities a on a.id = aa.activity_id and a.deleted = false and (a.activity_type = 'post' or a.activity_type = 'pre' )
                        join user_tests ut on ut.assigned_activity_id = aa.id and ut.test_type = 'Topic'
                        join user_test_questions utq on utq.user_test_id = ut.id
                        join questions q on q.id = utq.question_id
                        join usersInfo ui on ui.userId = ut.user_id
                        where
                          s.semester_id = '${ctx.params.semesterId}' and
                          s.id = '${ctx.params.subjectId}' and
                          ${ctx.params.chapterId ? `c.id = '${ctx.params.chapterId}' and ` : ``}
                          ${ctx.params.topicId ? `t.id = '${ctx.params.topicId}' and ` : ``}
                          ut.deleted = false and
                          c.deleted = false and
                          uit.deleted = false and
                          aa.deleted = false and
                          t.deleted = false
                        group by  q.question_type`;
		return await this.runSql(sql);
	}

	public static async getCompletionRateProfessorAnalysis(ctx: ContextWrapper) {
		let groupByStmtSql: string = `group by uaa.subject_id`;
		let whereClauseStmtSql: string = ``;

		if (ctx.params.chapterId) {
			groupByStmtSql = `group by uaa.chapter_id`;
			whereClauseStmtSql = `uaa.chapter_id = '${ctx.params.chapterId}' and`;
		}

		if (ctx.params.topicId) {
			groupByStmtSql = `group by uaa.topic_id`;
			whereClauseStmtSql = `uaa.topic_id = '${ctx.params.topicId}' and`;
		}

		const sql: string = `select
                          AVG(progress) as completionRate
                        from user_activity_analytics uaa
                        where
                          uaa.semester_id = '${ctx.params.semesterId}' and
                          uaa.college_id = '${ctx.params.collegeId}' and
                          uaa.branch_id = '${ctx.params.branchId}' and
                          uaa.section_id = '${ctx.params.sectionId}' and
                          uaa.subject_id = '${ctx.params.subjectId}' and
                          ${whereClauseStmtSql}
                          uaa.deleted = false
                        ${groupByStmtSql}`;
		return await this.runSqlFindOne(sql);
	}

	public static async getSubjectPreAndPostTestProfessorDashboard(ctx: ContextWrapper) {
		const sql: string = `with usersInfo as (
                          select
                            ub.user_id as userId,
                            ub.semester_id as semesterId,
                            ub.college_id as collegeId,
                            ub.section_id,
                            u.email,
                            r.name,
                            u.first_name as firstName,
                            u.last_name as lastName
                          from user_branches ub
                          join users u on u.id = ub.user_id
                          join user_roles ur on ur.user_id = u.id
                          join roles r on r.id = ur.role_id
                          where
                            ub.deleted = false and
                            u.deleted = false and
                            ur.deleted = false and
                            r.deleted = false  and
                            r.name = 'Student' and
                            ub.semester_id = '${ctx.params.semesterId}' and
                            ub.college_id = '${ctx.params.collegeId}' and
                            ub.branch_id = '${ctx.params.branchId}' and
                            ub.section_id = '${ctx.params.sectionId}'
                          )
                        select
                          s.id as subjectId,
                          s.name as subjectName,
                          a.activity_type as activityType,
                          Round(avg(ut.score),2) as score
                        from subjects s
                        join chapters c on c.subject_id = s.id
                        join topics t on t.chapter_id = c.id
                        join uni_topics uit on uit.id = t.universal_topic_id
                        join assigned_activities aa on aa.universal_topic_id = t.universal_topic_id
                        join activities a on a.id = aa.activity_id and a.deleted = false and (a.activity_type = '${ActivityCodeType.Post}' or a.activity_type = '${ActivityCodeType.Pre}' )
                        left join user_tests ut on ut.assigned_activity_id = aa.id and ut.test_type = '${UserTestType.Topic}'
                        join usersInfo ui on ui.userId = ut.user_id
                        where
                          s.semester_id = '${ctx.params.semesterId}' and
                          ut.deleted = false and
                          c.deleted = false and
                          uit.deleted = false and
                          aa.deleted = false and
                          t.deleted = false
                        group by s.id, a.activity_type `;
		return await this.runSql(sql);
	}

	public static async getBloomTaxonomyProfessorDashboard(ctx: ContextWrapper) {
		const sql: string = `with usersInfo as (
                          select ub.user_id as userId, ub.semester_id as semesterId, ub.college_id as collegeId, ub.section_id ,
                          u.email , r.name, u.first_name as firstName, u.last_name as lastName
                          from user_branches ub
                          join users u on u.id = ub.user_id
                          join user_roles ur on ur.user_id = u.id
                          join roles r on r.id = ur.role_id
                          where
                            ub.deleted = false and
                            u.deleted = false and
                            ur.deleted = false and
                            r.deleted = false  and
                            r.name = '${UserRoleType.Student}' and
                            ub.semester_id = '${ctx.params.semesterId}' and
                            ub.college_id = '${ctx.params.collegeId}' and
                            ub.branch_id = '${ctx.params.branchId}' and
                            ub.section_id = '${ctx.params.sectionId}'
                          )
                        select
                          q.question_type as questionType,
                          count(utq.id) as totalQuestions
                        from subjects s
                        join chapters c on c.subject_id = s.id
                        join topics t on t.chapter_id = c.id
                        join uni_topics uit on uit.id = t.universal_topic_id
                        join assigned_activities aa on aa.universal_topic_id = t.universal_topic_id
                        join activities a on a.id = aa.activity_id and a.deleted = false and (a.activity_type = 'post' or a.activity_type = 'pre' )
                        join user_tests ut on ut.assigned_activity_id = aa.id and ut.test_type = 'Topic'
                        join user_test_questions utq on utq.user_test_id = ut.id
                        join questions q on q.id = utq.question_id
                        join usersInfo ui on ui.userId = ut.user_id
                        where
                          s.semester_id = '${ctx.params.semesterId}' and
                          ut.deleted = false and
                          c.deleted = false and
                          uit.deleted = false and
                          aa.deleted = false and
                          t.deleted = false
                        group by  q.question_type`;
		return await this.runSql(sql);
	}

	public static async getStudentAnalyticsConfigWithAssignedActivity(ctx: ContextWrapper, assignedActivityIds: string[], chapterId: string = '') {
		let activityIdsQueryStmt = '';

		assignedActivityIds.map((e, index) => {
			if (index == assignedActivityIds.length - 1) {
				activityIdsQueryStmt = activityIdsQueryStmt + `'${e}'`;
			} else {
				activityIdsQueryStmt = activityIdsQueryStmt + `'${e}',`;
			}
		});

		let chapterIdStmt: string = ' ';

		if (chapterId) {
			chapterIdStmt = `c.id = '${chapterId}' and`;
		}

		const sql: string = `select
                            ub.user_id as userId,
                            ub.university_id as universityId,
                            ub.branch_id as branchId,
                            ub.semester_id as semesterId,
                            ub.college_id as collegeId,
                            ub.section_id as sectionId,
                            s.id as subjectId,
                            c.id as chapterId,
                            t.id as topicId,
                            aa.id as assignedActivityId,
                            ai.id as activityInfoId,
                            a.activity_type as activityType
                          from activity_info ai
                          join assigned_activities aa on ai.assigned_activity_id = aa.id and aa.topic_id is null
                          join activities a on a.id = aa.activity_id
                          join uni_topics ut on ut.id = aa.universal_topic_id
                          join topics t on t.universal_topic_id = ut.id
                          join chapters c on c.id = t.chapter_id
                          join subjects s on s.id = c.subject_id
                          join semesters sem on sem.id = s.semester_id
                          join user_branches ub on ub.semester_id = sem.id
                          where
	                          ai.deleted = false and
	                          aa.deleted = false and
	                          aa.resource_type = 'admin' and
	                          ut.deleted = false and
	                          t.deleted = false and
	                          c.deleted = false and
	                          s.deleted = false and
	                          sem.deleted = false and
	                          ub.deleted = false and ${chapterIdStmt}
	                          aa.id in (${activityIdsQueryStmt})`;
		return await this.runSql(sql);
	}

	public static async getStudentAnalyticsConfigWithAssignedActivityQuestion(
		ctx: ContextWrapper,
		assignedActivityIds: string[],
		chapterId: string = '',
	) {
		let activityIdsQueryStmt = '';

		assignedActivityIds.map((e, index) => {
			if (index == assignedActivityIds.length - 1) {
				activityIdsQueryStmt = activityIdsQueryStmt + `'${e}'`;
			} else {
				activityIdsQueryStmt = activityIdsQueryStmt + `'${e}',`;
			}
		});

		let chapterIdStmt: string = ' ';

		if (chapterId) {
			chapterIdStmt = `and c.id = '${chapterId}'`;
		}

		const sql: string = `select
                            ub.user_id as userId,
                            ub.university_id as universityId,
                            ub.branch_id as branchId,
                            ub.semester_id as semesterId,
                            ub.college_id as collegeId,
                            ub.section_id as sectionId,
                            s.id as subjectId,
                            c.id as chapterId,
                            t.id as topicId,
                            aa.id as assignedActivityId,
                            '' as activityInfoId,
                            a.activity_type as activityType
                        from user_branches ub
                        join semesters sem on sem.branch_id = ub.branch_id
                        join subjects s on s.semester_id = sem.id
                        join chapters c on c.subject_id = s.id
                        join topics t on t.chapter_id = c.id
                        join uni_topics ut on ut.id = t.universal_topic_id
                        join assigned_activities aa on aa.universal_topic_id = ut.id and aa.deleted = false and aa.resource_type = 'admin'
                        join activities a on a.id = aa.activity_id and a.deleted = false and a.activity_type in ('${ActivityCodeType.Post}','${ActivityCodeType.Pre}')
                        where
                          aa.id in (${activityIdsQueryStmt}) and
                          aa.deleted = false and
                          a.deleted = false and
                          ut.deleted = false  and
                          sem.deleted = false and
                          s.deleted = false and
                          c.deleted = false and
                          t.deleted = false ${chapterIdStmt}`;
		return await this.runSql(sql);
	}

	public static async softDeleteAnalytics(assignedActivityIds: string[], topicId: string = '') {
		let activityIdsQueryStmt = '';
		let activityDimIdsQueryStmt = '';
		let topicIdQueryStmt = '';
		let userTestTopicIdQueryStmt = '';

		if (topicId) {
			topicIdQueryStmt = `uaa.topic_id = '${topicId}' and`;
			userTestTopicIdQueryStmt = `topic_id = '${topicId}' and`;
		}

		assignedActivityIds.map((e, index) => {
			if (index == assignedActivityIds.length - 1) {
				activityIdsQueryStmt = activityIdsQueryStmt + `'${e}'`;
			} else {
				activityIdsQueryStmt = activityIdsQueryStmt + `'${e}',`;
			}
		});

		let dimIdSql = '';
		if (topicId) {
			// get dim_ids
			dimIdSql = `select uaa.activity_dm_id as activityDimId
                            from user_activity_analytics uaa
                            where
                              uaa.topic_id = '${topicId}'`;
		} else {
			// get dim_ids
			dimIdSql = `select ad.id as activityDimId
                            from activity_dim ad
                            where
                              ad.activity_id in (${activityIdsQueryStmt})`;
		}

		const activityDimIds = await this.runSql(dimIdSql);

		// delete user activity_anctivity_analytics
		activityDimIds.map((e, index) => {
			if (index == activityDimIds.length - 1) {
				activityDimIdsQueryStmt = activityDimIdsQueryStmt + `'${e.activityDimId}'`;
			} else {
				activityDimIdsQueryStmt = activityDimIdsQueryStmt + `'${e.activityDimId}',`;
			}
		});

		// TODO: dump data to stash logs for tracking
		await this.runSql(`update user_activity_analytics set deleted = true where activity_dm_id in (${activityDimIdsQueryStmt})`);

		// delete analytics_dim
		await this.runSql(`update activity_dim set deleted = true where id in (${activityDimIdsQueryStmt})`);

		// delete user tests
		await this.runSql(`update user_tests set deleted = true
                        where
                          assigned_activity_id in (${activityIdsQueryStmt}) and
                          ${userTestTopicIdQueryStmt} true`);

		// await this.runSql(`delete from activity_dim where id in (${activityDimIdsQueryStmt})`);
		// await this.runSql(`delete from user_activity_analytics where activity_dm_id in (${activityDimIdsQueryStmt})`);

		// await this.runSql(`delete from user_tests
		//                     where
		//                       assigned_activity_id in (${activityIdsQueryStmt}) and
		//                       test_type = '${UserTestType.Topic}' and
		//                       ${userTestTopicIdQueryStmt} true`);
	}

	public static async getChapterProgress(userId: string, chapterId: string) {
		const sql: string = `select
                            user_id as userId,
                            chapter_id as chapterId,
                            ROUND(AVG(uaa.progress),2) as progress
                          from user_activity_analytics uaa
                          where
                            uaa.chapter_id ='${chapterId}' and
                            user_id = '${userId}' and
                            deleted = false
                          group by user_id , chapter_id `;
		return await this.runSqlFindOne(sql);
	}

	public static async getTopicProgress(userId: string, topicId: string) {
		const sql: string = `select
                            user_id as userId,
                            topic_id as topicId,
                            ROUND(AVG(uaa.progress),2) as progress
                          from user_activity_analytics uaa
                          where
                            uaa.topic_id ='${topicId}' and
                            user_id = '${userId}' and
                            deleted = false
                          group by user_id , topic_id `;
		return await this.runSqlFindOne(sql);
	}
}
