import { ContextWrapper } from '@Helpers/molecular-helper';
import SystemHelper from '@Helpers/system-helpers';
import { PagedResponse } from 'src/dto/base.dto';
import { BaseDao } from './base.dao';
import { TargetSourceType } from '@Utility/enum';

export class TopicDao extends BaseDao {
	public static async getTopics(ctx: ContextWrapper): Promise<PagedResponse<any>> {
		const { offset, limit } = SystemHelper.getOffsetAndLimit(+ctx.params.offset, +ctx.params.limit);
		const response: PagedResponse<any> = new PagedResponse();
		const sql: string = `select
													t.*,
													ut.image,
													ut.id as universalTopicId
												 from topics t
												 left join uni_topics ut on ut.id = t.universal_topic_id
                         where
												 	t.deleted = false and
													t.chapter_id = '${ctx.params.chapterId}' and
													t.is_default = true and
													t.target_source = '${TargetSourceType.Admin}'
                         order by t.id desc
                         limit ${limit} offset ${offset}`;
		response.items = await this.runSql(sql);

		const countSql: string = `select count(*) as count
                              from topics t
                              where
																t.deleted = false and
																t.chapter_id = '${ctx.params.chapterId}' and
																t.target_source = '${TargetSourceType.Admin}'`;
		response.totalCount = await this.runSqlGetCount(countSql);
		return response;
	}

	public static async getProfessorTopics(ctx: ContextWrapper): Promise<PagedResponse<any>> {
		const { offset, limit } = SystemHelper.getOffsetAndLimit(+ctx.params.offset, +ctx.params.limit);
		const response: PagedResponse<any> = new PagedResponse();
		const sql: string = `select
													t.*,
													ut.image,
													ut.id as universalTopicId
												 from topics t
												 left join uni_topics ut on ut.id = t.universal_topic_id
                         where
												 	t.deleted = false and
													t.chapter_id = '${ctx.params.chapterId}'
                         order by t.id desc
                         limit ${limit} offset ${offset}`;
		response.items = await this.runSql(sql);

		const countSql: string = `select count(*) as count
                              from topics t
                              where t.deleted = false and t.chapter_id = '${ctx.params.chapterId}'`;
		response.totalCount = await this.runSqlGetCount(countSql);
		return response;
	}

	public static async getTopic(ctx: ContextWrapper) {
		const sql: string = `select
													t.*,
													ut.image,
													ut.id as universalTopicId
												 from topics t
												 left join uni_topics ut on ut.id = t.universal_topic_id
												 where
												 	t.deleted = false and
													t.chapter_id = '${ctx.params.chapterId}' and
													t.id = '${ctx.params.topicId}'`;

		const response = await this.runSqlFindOne(sql);
		return response;
	}

	public static async getTeacherTopics(ctx: ContextWrapper): Promise<PagedResponse<any>> {
		const { offset, limit } = SystemHelper.getOffsetAndLimit(+ctx.params.offset, +ctx.params.limit);
		const response: PagedResponse<any> = new PagedResponse();
		const sql: string = `select t.id, t.name, t.image
												 from user_grades ug
                         left join grades g on g.id = ug.grade_id and g.deleted = false
                         left join sections se on se.id = ug.section_id and se.deleted = false
                         left join subjects s on s.grade_id = g.id and s.deleted = false
                         left join chapters c on c.subject_id = s.id and c.deleted = false
                         left join topics t on c.id = t.chapter_id and t.deleted = false
												 where ug.user_id = '${ctx.params.teacherId}' and ug.deleted = false and ug.section_id = '${ctx.params.sectionId}' and ug.grade_id = '${ctx.params.gradeId}' and s.id = '${ctx.params.subjectId}' and c.id = '${ctx.params.chapterId}' and t.id IS NOT NULL
												 GROUP BY t.id order by t.name desc
                         limit ${limit} offset ${offset}`;
		response.items = await this.runSql(sql);

		const counSql: string = `select count(DISTINCT t.id) as count
												 from user_grades ug
                         left join grades g on g.id = ug.grade_id and g.deleted = false
                         left join subjects s on s.grade_id = g.id and s.deleted = false
                         left join chapters c on c.subject_id = s.id and c.deleted = false
                         left join topics t on c.id = t.chapter_id and t.deleted = false
												 where ug.user_id = '${ctx.params.teacherId}' and ug.deleted = false and ug.section_id = '${ctx.params.sectionId}' and ug.grade_id = '${ctx.params.gradeId}' and s.id = '${ctx.params.subjectId}' and c.id = '${ctx.params.chapterId}' and t.id IS NOT NULL`;
		response.totalCount = await this.runSqlGetCount(counSql);
		return response;
	}

	public static async getRecommendedTopic(ctx: ContextWrapper) {
		const sql: string = `select
													 t.name,
													 t.id as topicId,
													 s.id as subjectId,
													 c.id as chapterId,
													 ut.dependency_topics as dependencyTopics,
													 ut.image,
													 ut.topic_desc as description,
													 ut.subject_id as universalSubjectId,
													 ut.id as universalTopicId
													from user_branches ub
													join subjects s on s.semester_id = ub.semester_id
													join chapters c on c.subject_id = s.id
													join topics t on c.id = t.chapter_id
													join uni_topics ut on ut.id = t.universal_topic_id
							            where
													  ub.user_id =  '${ctx.meta.userId}' and
														t.id = '${ctx.params.topicId}'`;

		return await this.runSqlFindOne(sql);
	}

	public static async getDependencyTopics(ctx: ContextWrapper) {
		const uniTopicIds = ctx.params.uniTopicIds.map((utId) => `'${utId}'`);
		const sql: string = `select
		 											 ut.subject_id as universalSubjectId,
													 ut.topic_name as name,
													 ut.topic_desc as description,
													 ut.image,
													 ut.id as universalTopicId
													from  uni_topics ut
							            where
													 ut.id in (${uniTopicIds}) and ut.deleted=false`

		return await this.runSql(sql);
	}

	public static async checkTopicInCurrentSemester(ctx: ContextWrapper) {
		const sql: string = `select * from topics t
													join chapters c on c.id = t.chapter_id
													join subjects s on s.id = c.subject_id
													join semesters s2 on s2.id = s.semester_id
													join branches b on b.id=s2.branch_id
													join universities u on u.id=b.university_id
													join uni_topics ut on ut.id = t.universal_topic_id
							            where
														t.deleted = false and
														s2.semesterId = '${ctx.params.semesterId}' and
														t.universal_topic_id = '${ctx.params.universalTopicId}'`;

		return await this.runSqlFindOne(sql);
	}
}
