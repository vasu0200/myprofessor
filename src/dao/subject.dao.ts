import { ContextWrapper } from '@Helpers/molecular-helper';
import SystemHelper from '@Helpers/system-helpers';
import { PagedResponse } from 'src/dto/base.dto';
import { BaseDao } from './base.dao';
import { ActivityStatus, TargetSourceType, UserTestType } from '@Utility/enum';

export class SubjectDao extends BaseDao {
	public static async getSubjects(ctx: ContextWrapper): Promise<PagedResponse<any>> {
		const { offset, limit } = SystemHelper.getOffsetAndLimit(+ctx.params.offset, +ctx.params.limit);
		const response: PagedResponse<any> = new PagedResponse();
		const sql: string = `select * from subjects s
                         where
												 s.deleted = false and
												 s.semester_id = '${ctx.params.semesterId}' and
			                   s.is_default = true and
												 s.target_source = '${TargetSourceType.Admin}'
                         order by s.idx asc
                         limit ${limit} offset ${offset}`;
		response.items = await this.runSql(sql);

		const countSql: string = `select count(*) as count
															from subjects s
															where
																s.deleted = false and
																s.semester_id = '${ctx.params.semesterId}' and
																s.target_source = '${TargetSourceType.Admin}'`;
		response.totalCount = await this.runSqlGetCount(countSql);
		return response;
	}

	public static async getProfessorSubjects(ctx: ContextWrapper): Promise<PagedResponse<any>> {
		const { offset, limit } = SystemHelper.getOffsetAndLimit(+ctx.params.offset, +ctx.params.limit);
		const response: PagedResponse<any> = new PagedResponse();
		const sql: string = `select * from subjects s
                         where
												 s.deleted = false and
												 s.semester_id = '${ctx.params.semesterId}'
                         order by s.idx asc
                         limit ${limit} offset ${offset}`;
		response.items = await this.runSql(sql);

		const countSql: string = `select count(*) as count
															from subjects s
															where s.deleted = false and s.semester_id = '${ctx.params.semesterId}'`;
		response.totalCount = await this.runSqlGetCount(countSql);
		return response;
	}

	public static async getCollegeSubjects(ctx: ContextWrapper): Promise<PagedResponse<any>> {
		const { offset, limit } = SystemHelper.getOffsetAndLimit(+ctx.params.offset, +ctx.params.limit);
		const response: PagedResponse<any> = new PagedResponse();
		const sql: string = `select
														s.*,
														s.semester_id as semesterId,
														s.college_semester_id as collegeSemesterId,
														s.is_default as isDefault
												 from subjects s
                         where
												 	s.deleted = false and
													(
														s.semester_id = '${ctx.params.semesterId}'
														or
														s.college_semester_id = '${ctx.params.collegeSemesterId}'
													)
                         order by s.idx asc
                         limit ${limit} offset ${offset}`;
		response.items = await this.runSql(sql);

		const countSql: string = `select count(*) as count
															from subjects s
															where
																s.deleted = false and
																	(
																		s.semester_id = '${ctx.params.semesterId}'
																		or
																		s.college_semester_id = '${ctx.params.collegeSemesterId}'
																	)`;
		response.totalCount = await this.runSqlGetCount(countSql);
		return response;
	}

	public static async getTeacherSubjects(ctx: ContextWrapper): Promise<PagedResponse<any>> {
		const { offset, limit } = SystemHelper.getOffsetAndLimit(+ctx.params.offset, +ctx.params.limit);
		const response: PagedResponse<any> = new PagedResponse();
		const sql: string = `select s.id, s.name, s.image, se.id as sectionId, se.name as sectionName, count(DISTINCT c.id) as chaptersCount, count(DISTINCT t.id) as topicsCount
												 from user_grades ug
                         left join grades g on g.id = ug.grade_id and g.deleted = false
                         left join sections se on se.id = ug.section_id and se.deleted = false
                         left join subjects s on s.grade_id = g.id and s.deleted = false
                         left join chapters c on c.subject_id = s.id and c.deleted = false
                         left join topics t on c.id = t.chapter_id and t.deleted = false
												 where ug.user_id = '${ctx.params.teacherId}' and ug.deleted = false and ug.section_id = '${ctx.params.sectionId}' and ug.grade_id = '${ctx.params.gradeId}'
												 GROUP BY s.id order by s.name desc
                         limit ${limit} offset ${offset}`;
		response.items = await this.runSql(sql);

		const counSql: string = `select count(DISTINCT s.id) as count
												 from user_grades ug
                         left join grades g on g.id = ug.grade_id and g.deleted = false
                         left join subjects s on s.grade_id = g.id and s.deleted = false
												 where ug.user_id = '${ctx.params.teacherId}' and ug.deleted = false and ug.section_id = '${ctx.params.sectionId}' and ug.grade_id = '${ctx.params.gradeId}'`;
		response.totalCount = await this.runSqlGetCount(counSql);
		return response;
	}

	public static async getSubjectKnowledgeMapStats(ctx: ContextWrapper) {
		const sql: string = `with scores as (
                          select
                          ut.assigned_activity_id as assignedActivityId,
                          t.universal_topic_id as universalTopicId,
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
                          ut.user_id = '${ctx.params.userId}' and
													c.subject_id = '${ctx.params.subjectId}'
                        group by t.universal_topic_id
                        )
                        select * from scores s
                       `;
		return await this.runSql(sql);
	}

	public static async getTopicsBySubjectId(ctx: ContextWrapper) {
		const sql: string = `select
													s.id as subjectId,
													s.name as subjectName,
													c.id as chapterId,
													c.name as chapterName,
													t.id as topicId,
													ut.id as universalTopicId,
													ut.topic_name as topicName,
													ut.topic_code as topicCode,
													t.idx as "index"
												from subjects s
												join chapters c on c.subject_id = s.id
												join topics t on t.chapter_id = c.id
												join uni_topics ut on ut.id = t.universal_topic_id
												where
													s.deleted = false and
													c.deleted = false and
													t.deleted = false and
													ut.deleted = false and
													s.id = '${ctx.params.subjectId}'`;
		return await this.runSql(sql);
	}

	public static async checkSubject(ctx: ContextWrapper, idCheck: boolean = false) {
		const idCheckSql: string = idCheck ? `and s.id != '${ctx.params.subjectId}'` : ``;
		const sql: string = `select * from subjects s
												 where
												    s.semester_id = '${ctx.params.semesterId}' and
												 		lower(s.name) = lower('${ctx.params.name}') and
														s.deleted = false ${idCheckSql}
													limit 1`;
		return await this.runSqlFindOne(sql);
	}

	public static async getSubjectsForWebsite(ctx: ContextWrapper): Promise<PagedResponse<any>> {
		const { offset, limit } = SystemHelper.getOffsetAndLimit(+ctx.params.offset, +ctx.params.limit);
		const response: PagedResponse<any> = new PagedResponse();
		const sql: string = `select s.* from subjects s
												 join semesters sm on sm.id=s.semester_id
                         where
												 s.deleted = false and
												 sm.branch_id = '${ctx.params.branchId}' and
			                   s.is_default = true
                         order by s.idx asc
                         limit ${limit} offset ${offset}`;
		response.items = await this.runSql(sql);

		const countSql: string = `select count(*) as count
															from subjects s
															join semesters sm on sm.id=s.semester_id
															where s.deleted = false and sm.branch_id = '${ctx.params.branchId}'`;
		response.totalCount = await this.runSqlGetCount(countSql);
		return response;
	}
}
