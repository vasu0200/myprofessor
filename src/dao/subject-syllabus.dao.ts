import { ContextWrapper } from "@Helpers/molecular-helper";
import SystemHelper from "@Helpers/system-helpers";
import { PagedResponse } from "src/dto/base.dto";
import { BaseDao } from "./base.dao";

export class SubjectSyllabusDao extends BaseDao {
	public static async getSubjectSyllabus(ctx: ContextWrapper): Promise<PagedResponse<any>> {
		const { offset, limit } = SystemHelper.getOffsetAndLimit(+ctx.params.offset, +ctx.params.limit);
		const response: PagedResponse<any> = new PagedResponse();
		const sql: string = `select
														ss.id,
                            ss.university_id as universityId,
                            ss.branch_id as branchId,
                            ss.subject_id as subjectId,
														ss.chapter_id as chapterId,
                            u.name as universityName,
                            b.name as branchName,
                            s.name as subjectName,
														c.name as chapterName,
														ss.idx
												 from subject_syllabus ss
												 join chapters c on c.id=ss.chapter_id
                         join subjects s on s.id=ss.subject_id
                         join branches b on b.id=ss.branch_id
                         join universities u on u.id=ss.university_id
                         where
                          ss.deleted=false
													order by ss.idx asc
													limit ${limit} offset ${offset}`;
		response.items = await this.runSql(sql);

		const countSql: string = `select count(*) as count
                              from subject_syllabus ss
                              where
															ss.deleted=false`;
		response.totalCount = await this.runSqlGetCount(countSql);
		return response;
	}

	public static async checkSubjectSyllabus(ctx: ContextWrapper, idCheck: boolean = false) {
		const idCheckSql: string = idCheck ? `and ss.id != '${ctx.params.subjectSyllabusId}'` : ``;
		const sql: string = `select * from subject_syllabus ss
												 where
												 ss.branch_id = '${ctx.params.branchId}' and
                            ss.subject_id = '${ctx.params.subjectId}' and
														ss.chapter_id = '${ctx.params.chapterId}' and
														ss.deleted = false ${idCheckSql}`;
		return await this.runSqlFindOne(sql);
	}

	public static async getSubjectSyllabusBySubject(ctx: ContextWrapper): Promise<PagedResponse<any>> {
		const { offset, limit } = SystemHelper.getOffsetAndLimit(+ctx.params.offset, +ctx.params.limit);
		const response: PagedResponse<any> = new PagedResponse();
		const sql: string = `select
														ss.id,
                            ss.university_id as universityId,
                            ss.branch_id as branchId,
                            ss.subject_id as subjectId,
														ss.chapter_id as chapterId,
                            u.name as universityName,
                            b.name as branchName,
                            s.name as subjectName,
														c.name as chapterName,
														ss.description
												 from subject_syllabus ss
												 join chapters c on c.id=ss.chapter_id
                         join subjects s on s.id=ss.subject_id
                         join branches b on b.id=ss.branch_id
                         join universities u on u.id=ss.university_id
                         where
												  ss.subject_id = '${ctx.params.subjectId}' and
                          ss.deleted=false`;

		response.items = await this.runSql(sql);

		const countSql: string = `select count(*) as count
                              from subject_syllabus ss
                              where
															ss.subject_id = '${ctx.params.subjectId}' and
															ss.deleted=false`;
		response.totalCount = await this.runSqlGetCount(countSql);
		return response;
	}
}
