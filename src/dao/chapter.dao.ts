import { ContextWrapper } from '@Helpers/molecular-helper';
import SystemHelper from '@Helpers/system-helpers';
import { PagedResponse } from 'src/dto/base.dto';
import { BaseDao } from './base.dao';
import { TargetSourceType } from '@Utility/enum';

export class ChapterDao extends BaseDao {
	public static async getChapters(ctx: ContextWrapper): Promise<PagedResponse<any>> {
		const { offset, limit } = SystemHelper.getOffsetAndLimit(+ctx.params.offset, +ctx.params.limit);
		const response: PagedResponse<any> = new PagedResponse();
		const sql: string = `select * from chapters c
                         where
												 	c.subject_id = '${ctx.params.subjectId}' and
													c.deleted = false and
													c.is_default = true and
													c.target_source = '${TargetSourceType.Admin}'
												 order by c.id desc
                         limit ${limit} offset ${offset}`;
		response.items = await this.runSql(sql);

		const counSql: string = `select count(*) as count
														 from chapters c
														 where
														 	c.subject_id = '${ctx.params.subjectId}' and
															c.deleted = false and
															c.target_source = '${TargetSourceType.Admin}'`;
		response.totalCount = await this.runSqlGetCount(counSql);
		return response;
	}

	public static async getProfessorChapters(ctx: ContextWrapper): Promise<PagedResponse<any>> {
		const { offset, limit } = SystemHelper.getOffsetAndLimit(+ctx.params.offset, +ctx.params.limit);
		const response: PagedResponse<any> = new PagedResponse();
		const sql: string = `select * from chapters c
                         where
												 	c.subject_id = '${ctx.params.subjectId}' and
													c.deleted = false
												 order by c.id desc
                         limit ${limit} offset ${offset}`;
		response.items = await this.runSql(sql);

		const counSql: string = `select count(*) as count
														 from chapters c
														 where
														 		c.subject_id = '${ctx.params.subjectId}' and
																c.deleted = false`;
		response.totalCount = await this.runSqlGetCount(counSql);
		return response;
	}

	public static async getTeacherChapters(ctx: ContextWrapper): Promise<PagedResponse<any>> {
		const { offset, limit } = SystemHelper.getOffsetAndLimit(+ctx.params.offset, +ctx.params.limit);
		const response: PagedResponse<any> = new PagedResponse();
		const sql: string = `select c.id, c.name, c.image, se.id as sectionId, se.name as sectionName, count(DISTINCT t.id) as topicsCount
												 from user_grades ug
                         left join grades g on g.id = ug.grade_id and g.deleted = false
                         left join sections se on se.id = ug.section_id and se.deleted = false
                         left join subjects s on s.grade_id = g.id and s.deleted = false
                         inner join chapters c on c.subject_id = s.id and c.deleted = false
                         inner join topics t on c.id = t.chapter_id and t.deleted = false
												 where ug.user_id = '${ctx.params.teacherId}' and ug.deleted = false and ug.section_id = '${ctx.params.sectionId}' and ug.grade_id = '${ctx.params.gradeId}' and s.id = '${ctx.params.subjectId}'
												 GROUP BY c.id order by c.name desc
                         limit ${limit} offset ${offset}`;
		response.items = await this.runSql(sql);

		const counSql: string = `select count(DISTINCT c.id) as count
												 from user_grades ug
                         left join grades g on g.id = ug.grade_id and g.deleted = false
                         left join subjects s on s.grade_id = g.id and s.deleted = false and s.id = '${ctx.params.subjectId}'
                         inner join chapters c on c.subject_id = s.id and c.deleted = false
												 where ug.user_id = '${ctx.params.teacherId}' and ug.deleted = false and ug.section_id = '${ctx.params.sectionId}' and ug.grade_id = '${ctx.params.gradeId}'`;
		response.totalCount = await this.runSqlGetCount(counSql);
		return response;
	}

	public static async globalSearch(ctx: ContextWrapper) {
		const sql: string = `select
													c.name as chapterName,
													s.id as subjectId,
													c.id as chapterId,
													'chapter' as searchEntity,
													'' as topicId,
													'' as universaltopicId,
													'' as topicName
												from user_branches ub
												join subjects s on s.semester_id = ub.semester_id
												join chapters c on c.subject_id = s.id
												join topics t on t.chapter_id = c.id
												join uni_topics ut on ut.id = t.universal_topic_id
												where
													ub.user_id = '${ctx.params.userId}' and
													ub.deleted = false and
													s.deleted = false and
													c.deleted = false and
													c.name like '%${ctx.params.searchValue}%'
												UNION
												select
													'' as chapterName,
													s.id as subjectId,
													c.id as chapterId,
													'topic' as searchEntity,
													t.id as topicId,
													ut.id as universaltopicId,
													ut.topic_name as topicName
												from user_branches ub
												join subjects s on s.semester_id = ub.semester_id
												join chapters c on c.subject_id = s.id
												join topics t on t.chapter_id = c.id
												join uni_topics ut on ut.id = t.universal_topic_id
												where
												ub.user_id = '${ctx.params.userId}' and
												ub.deleted = false and
												s.deleted = false and
												c.deleted = false and
												t.deleted = false and
												ut.deleted = false and
												ut.topic_name like '%${ctx.params.searchValue}%'`;
		return await this.runSql(sql);
	}

	public static async checkChapter(ctx: ContextWrapper, idCheck: boolean = false) {
		const idCheckSql: string = idCheck ? `and c.id != '${ctx.params.chapterId}'` : ``;
		const sql: string = `select * from chapters c
												 where
												    c.subject_id = '${ctx.params.subjectId}' and
												 		lower(c.name) = lower('${ctx.params.name}') and
														c.deleted = false ${idCheckSql}
													limit 1`;
		return await this.runSqlFindOne(sql);
	}
}
