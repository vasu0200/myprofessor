import { ContextWrapper } from '@Helpers/molecular-helper';
import SystemHelper from '@Helpers/system-helpers';
import { Subject } from '@Models/subject';
import { Constants } from '@Utility/constants';
import { UserRoleType } from '@Utility/enum';
import { PagedResponse } from 'src/dto/base.dto';
import { getRepository } from 'typeorm';
import { BaseDao } from './base.dao';

export class CollegeDao extends BaseDao {
	public static async getColleges(ctx: ContextWrapper): Promise<PagedResponse<any>> {
		const { offset, limit } = SystemHelper.getOffsetAndLimit(+ctx.params.offset, +ctx.params.limit);
		const response: PagedResponse<any> = new PagedResponse();
		const sql: string = `select c.id, c.name, c.logo, c.email, c.status, c.from_date as fromDate, c.to_date as toDate
                         from colleges c
												 where c.deleted = false
                         order by c.created_at desc
                         limit ${limit} offset ${offset}`;
		response.items = await this.runSql(sql);

		const countSql: string = `select count(*) as count
															from colleges c
															where c.deleted = false`;
		response.totalCount = await this.runSqlGetCount(countSql);
		return response;
	}

	public static async getCollegeBranches(ctx: ContextWrapper, collegeId: string): Promise<PagedResponse<any>> {
		const { offset, limit } = SystemHelper.getOffsetAndLimit(+ctx.params.offset, +ctx.params.limit);
		const response: PagedResponse<any> = new PagedResponse();
		const sql: string = `select
													cb.id as "collegeBranchId",
													b.id as "branchId",
													b.name,
													b.image,
													b.is_default as "isDefault"
												 from college_branches cb
											   join branches b on b.id = cb.branch_id and b.deleted = false
												 where
												 	cb.deleted = false and
													cb.college_id = '${collegeId}'
                         order by cb.id desc
                         limit ${limit} offset ${offset}`;
		response.items = await this.runSql(sql);

		const countSql: string = `select count(*) as count
												 			from college_branches cb
											   		  join branches b on b.id = cb.branch_id and b.deleted = false
												      where
																cb.deleted = false and
																cb.college_id = '${collegeId}'`;
		response.totalCount = await this.runSqlGetCount(countSql);
		return response;
	}

	public static async getCollegeBranch(ctx: ContextWrapper, collegeId: string, collegeBranchId: string) {
		const sql: string = `select
													cb.id as collegeBranchId,
													b.id as branchId,
													b.name,
													b.image,
													b.is_default as "isDefault"
												 from college_branches cb
												 join branches b on b.id = cb.branch_id
												 where b.deleted = false and
												 cb.deleted = false and
												 cb.college_id = '${collegeId}' and
												 cb.id = '${collegeBranchId}'`;
		return await this.runSqlFindOne(sql);
	}

	public static async getCollegeBranchAndSemestersInfo(ctx: ContextWrapper, collegeId: string) {
		const sql: string = `select
														b.name as branchName,
														b.id as branchId,
														cb.id as collegeBranchId,
														s.id as semesterId,
														s.name as semesterName,
														cs.id as collegeSemesterId
													from  college_branches cb
													join branches b on cb.branch_id  = b.id
													join semesters s on s.branch_id = b.id
													left join college_semesters cs on cs.semester_id = s.id and cs.deleted = false
													where
														cb.college_id = '${collegeId}'
														and cb.deleted = false
														and b.deleted = false
														and s.deleted = false`;
		return await this.runSql(sql);
	}

	public static async getUserSemesterSubjects(ctx: ContextWrapper, semesterId: string, collegeSemesterId: string): Promise<Subject[]> {
		return await getRepository(Subject)
			.createQueryBuilder()
			.where('(semester_id = :semesterId OR college_semester_id = :collegeSemesterId) and deleted = false', {
				semesterId: semesterId,
				collegeSemesterId: collegeSemesterId,
			})
			.getMany();
	}

	public static async getCollegeAdmins(ctx: ContextWrapper) {
		const sql: string = `select u.email , '' as password , r.name , r.id as roleId, u.id as userId
													from user_roles ur
													join users u on u.id = ur.user_id and u.deleted = false and ur.deleted = false
													join roles r on r.id = ur.role_id and r.deleted = false
													where
														r.name = '${Constants.Roles.COLLEGE_ADMIN}' and
														ur.college_id = '${ctx.params.collegeId}'`;
		return await this.runSql(sql);
	}

	public static async getUserCollegeBranches(ctx: ContextWrapper, userId: string, collegeId: string) {
		const { offset, limit } = SystemHelper.getOffsetAndLimit(+ctx.params.offset, +ctx.params.limit);
		const response: PagedResponse<any> = new PagedResponse();

		const sql: string = `select DISTINCT(ub.section_id) as sectionId, ub.branch_id as branchId,
													b.name,
													b.image,
													b.university_id as universityId,
													b.is_default as isDefault,
													sec.name as sectionName,
													ub.section_id as sectionId
												from user_branches ub
												join branches b on b.id = ub.branch_id
												join sections sec on sec.id = ub.section_id and sec.deleted = false
												where
													ub.college_id = '${collegeId}' and
													b.deleted = false and
													ub.deleted = false and
													ub.user_id = '${userId}'
												limit ${limit} offset ${offset}`;
		response.items = await this.runSql(sql);

		const countSql: string = `select count(DISTINCT(ub.section_id)) as count
															from user_branches ub
															join branches b on b.id = ub.branch_id
															join sections sec on sec.id = ub.section_id
															where
																ub.college_id = '${collegeId}' and
																b.deleted = false and
																ub.deleted = false and
																ub.user_id = '${userId}'`;
		response.totalCount = await this.runSqlGetCount(countSql);
		return response;
	}

	public static async getUserCollegeSections(ctx: ContextWrapper, userId: string, collegeId: string, branchId: string) {
		const { offset, limit } = SystemHelper.getOffsetAndLimit(+ctx.params.offset, +ctx.params.limit);
		const response: PagedResponse<any> = new PagedResponse();

		const sql: string = `select DISTINCT(s.id) as sectionId,
													s.name
												from user_branches ub
												join sections s on s.id = ub.section_id
												where
													ub.college_id = '${collegeId}' and
													ub.branch_id = '${branchId}' and
													s.deleted = false and
													ub.deleted = false and
													ub.user_id = '${userId}'
												limit ${limit} offset ${offset}`;
		response.items = await this.runSql(sql);

		const countSql: string = `select
																count(distinct(ub.section_id)) as count
															from user_branches ub
															join sections s on ub.section_id = s.id
															where
														  	ub.college_id = '${collegeId}'  and
																ub.branch_id = '${branchId}' and
																s.deleted = false and
												      	ub.deleted = false and
																ub.user_id = '${userId}'`;
		response.totalCount = await this.runSqlGetCount(countSql);
		return response;
	}

	public static async getUserCollegeSemesters(ctx: ContextWrapper, userId: string, collegeId: string, branchId: string, sectionId:string) {
		const { offset, limit } = SystemHelper.getOffsetAndLimit(+ctx.params.offset, +ctx.params.limit);
		const response: PagedResponse<any> = new PagedResponse();

		const sql: string = `with semInfo as (
													select
														s.id as semesterId,
														count(DISTINCT sub.id) as totalSubjects,
														count(DISTINCT c.id) as totalChapters,
														count(DISTINCT t.id) as totalTopics
													from user_branches ub
													join semesters s on ub.semester_id = s.id
													left join college_semesters cs on cs.semester_id = s.id and cs.deleted = false
													join subjects sub on sub.semester_id = s.id
													left join chapters c on c.subject_id = sub.id and c.deleted = false
													left join topics t on t.chapter_id = c.id and t.deleted = false
													where
													  ub.deleted = false and
														ub.branch_id = '${branchId}' and
														ub.section_id = '${sectionId}' and
														sub.deleted = false and
														ub.user_id = '${userId}' and
														ub.college_id = '${collegeId}'
													group by s.id
												)
												select s.name , s.image , s.is_custom as isCustom, si.*
												from semesters s
												join semInfo si on si.semesterId = s.id
												limit ${limit} offset ${offset}`;

		response.items = await this.runSql(sql);

		const countSql: string = `select
																count(distinct(ub.semester_id)) as count
															from user_branches ub
															join semesters s on ub.semester_id = s.id
															left join college_semesters cs on cs.semester_id = s.id and cs.deleted = false
															where
															  ub.deleted = false and
																ub.branch_id = '${branchId}' and
																ub.section_id = '${sectionId}' and
																ub.user_id = '${userId}' and
																ub.college_id = '${collegeId}' `;
		response.totalCount = await this.runSqlGetCount(countSql);
		return response;
	}

	public static async getUserCollegeSubjects(ctx: ContextWrapper, userId: string, collegeId: string, branchId: string, semesterId: string) {
		const { offset, limit } = SystemHelper.getOffsetAndLimit(+ctx.params.offset, +ctx.params.limit);
		const response: PagedResponse<any> = new PagedResponse();

		const sql: string = `with subInfo as (
													select
														sub.id as subjectId,
														count(DISTINCT c.id) as totalChapters,
														count(DISTINCT t.id) as totalTopics
													from user_branches ub
													join subjects sub on sub.semester_id = '${semesterId}' and ub.subject_id = sub.id
													left join chapters c on c.subject_id = sub.id and c.deleted = false
													left join topics t on t.chapter_id = c.id and t.deleted = false
													where
														ub.branch_id = '${branchId}' and
														sub.deleted = false and
														ub.user_id = '${userId}' and
														ub.college_id = '${collegeId}' and
														ub.semester_id = '${semesterId}' and
														ub.deleted = false and
														sub.deleted = false
													group by sub.id
												)
												select
													sub.name,
													sub.image,
													sub.description,
													sub.idx,
													sub.color,
													sub.is_default as isDefault,
													si.*
												from subjects sub
												join subInfo si on si.subjectId = sub.id
												limit ${limit} offset ${offset}`;
		response.items = await this.runSql(sql);

		const countSql: string = `select count(*) as count
															from user_branches ub
															join subjects sub on sub.semester_id = '${semesterId}' and ub.subject_id = sub.id
															where
																ub.branch_id = '${branchId}' and
																sub.deleted = false and
																ub.user_id = '${userId}' and
																ub.college_id = '${collegeId}' and
																ub.semester_id = '${semesterId}' and
																ub.deleted = false and
																sub.deleted = false `;
		response.totalCount = await this.runSqlGetCount(countSql);
		return response;
	}

	public static async getUserCollegeChapters(
		ctx: ContextWrapper,
		userId: string,
		collegeId: string,
		branchId: string,
		semesterId: string,
		subjectId: string,
	) {
		const { offset, limit } = SystemHelper.getOffsetAndLimit(+ctx.params.offset, +ctx.params.limit);
		const response: PagedResponse<any> = new PagedResponse();

		const sql: string = `with chapInfo as (
													select
														c.id as chapterId,
														c.is_default as isDefault,
														count(DISTINCT t.id) as totalTopics
													from user_branches ub
													join subjects sub on sub.semester_id = '${semesterId}' and ub.subject_id = sub.id
													join chapters c on c.subject_id = sub.id
													left join topics t on t.chapter_id = c.id and t.deleted = false
													where
														ub.branch_id = '${branchId}' and
														sub.deleted = false and
														c.deleted = false and
														ub.user_id = '${userId}' and
														ub.college_id = '${collegeId}' and
														ub.semester_id = '${semesterId}' and
														ub.subject_id = '${subjectId}' and
														ub.deleted = false and
														sub.deleted = false
													group by c.id
												)
												select c.name , c.description , c.image , c.idx, si.*
												from chapters c
												join chapInfo si on si.chapterId = c.id
												limit ${limit} offset ${offset}`;
		response.items = await this.runSql(sql);

		const countSql: string = `select
																count(*) as count
															from user_branches ub
															join subjects sub on sub.semester_id = '${semesterId}' and ub.subject_id = sub.id
															join chapters c on c.subject_id = sub.id
															where
																ub.branch_id = '${branchId}' and
																sub.deleted = false and
																c.deleted = false and
																ub.user_id = '${userId}' and
																ub.college_id = '${collegeId}' and
																ub.semester_id = '${semesterId}' and
																ub.subject_id = '${subjectId}' and
																ub.deleted = false and
																sub.deleted = false `;

		response.totalCount = await this.runSqlGetCount(countSql);
		return response;
	}

	public static async getUserCollegeTopics(
		ctx: ContextWrapper,
		userId: string,
		collegeId: string,
		branchId: string,
		semesterId: string,
		subjectId: string,
		chapterId: string,
	) {
		const { offset, limit } = SystemHelper.getOffsetAndLimit(+ctx.params.offset, +ctx.params.limit);
		const response: PagedResponse<any> = new PagedResponse();

		const sql: string = ` select
														t.*,
														ut.image,
													  ut.id as universalTopicId
													from user_branches ub
													join subjects sub on sub.semester_id = '${semesterId}' and ub.subject_id = sub.id
													join chapters c on c.subject_id = sub.id
													join topics t on t.chapter_id = c.id
													left join uni_topics ut on ut.id = t.universal_topic_id
													where
														ub.branch_id = '${branchId}' and
														sub.deleted = false and
														c.deleted = false and
														t.deleted = false and
														ub.user_id = '${userId}' and
														ub.college_id = '${collegeId}' and
														ub.semester_id = '${semesterId}' and
														ub.subject_id = '${subjectId}' and
														ub.deleted = false and
														sub.deleted = false and
														c.id = '${chapterId}'
													limit ${limit} offset ${offset}`;
		response.items = await this.runSql(sql);

		const countSql: string = `select count(*) as count
															from user_branches ub
															join subjects sub on sub.semester_id = '${semesterId}' and ub.subject_id = sub.id
															join chapters c on c.subject_id = sub.id
															join topics t on t.chapter_id = c.id
															where
																ub.branch_id = '${branchId}' and
																sub.deleted = false and
																c.deleted = false and
																t.deleted = false and
																ub.user_id = '${userId}' and
																ub.college_id = '${collegeId}' and
																ub.semester_id = '${semesterId}' and
																ub.subject_id = '${subjectId}' and
																ub.deleted = false and
																sub.deleted = false and
																c.id = '${chapterId}'`;
		response.totalCount = await this.runSqlGetCount(countSql);
		return response;
	}

	public static async getCollegeSectionUsers(ctx: ContextWrapper) {
		const sql: string = `select
													ub.user_id as userId,
													ub.semester_id as semesterId,
													ub.college_id as collegeId,
													ub.section_id,
													u.email,
													r.name as roleName,
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
													ub.section_id = '${ctx.params.sectionId}'`;
		return await this.runSql(sql);
	}

	public static async getProfessorCollegeBranches(ctx: ContextWrapper, userId: string, collegeId: string) {
		const { offset, limit } = SystemHelper.getOffsetAndLimit(+ctx.params.offset, +ctx.params.limit);
		const response: PagedResponse<any> = new PagedResponse();

		const sql: string = `select
													DISTINCT ub.branch_id as branchId,
													b.name,
													b.image,
													b.university_id as universityId,
													b.is_default as isDefault
												from user_branches ub
												join branches b on b.id = ub.branch_id
												where
													ub.college_id = '${collegeId}' and
													b.deleted = false and
													ub.deleted = false and
													ub.user_id = '${userId}'
												limit ${limit} offset ${offset}`;
		response.items = await this.runSql(sql);

		const countSql: string = `select count(DISTINCT ub.branch_id) as count
															from user_branches ub
															join branches b on b.id = ub.branch_id
															where
																ub.college_id = '${collegeId}' and
																b.deleted = false and
																ub.deleted = false and
																ub.user_id = '${userId}'`;
		response.totalCount = await this.runSqlGetCount(countSql);
		return response;
	}

	public static async getProfessorCollegeSemesters(ctx: ContextWrapper, userId: string, collegeId: string, branchId: string) {
		const { offset, limit } = SystemHelper.getOffsetAndLimit(+ctx.params.offset, +ctx.params.limit);
		const response: PagedResponse<any> = new PagedResponse();

		const sql: string = `select
													DISTINCT ub.semester_id as semesterId,
													sem.name,
													sem.image,
													sem.index,
													sem.is_custom as isCustom
												from user_branches ub
												join semesters sem on sem.id = ub.semester_id
												where
													ub.college_id = '${collegeId}' and
													sem.deleted = false and
													ub.deleted = false and
													ub.user_id = '${userId}' and
													ub.branch_id = '${branchId}'
												limit ${limit} offset ${offset}`;
		response.items = await this.runSql(sql);

		const countSql: string = `select
																count(DISTINCT ub.semester_id) as count
															from user_branches ub
															join semesters sem on sem.id = ub.semester_id
															where
																ub.college_id = '${collegeId}' and
																sem.deleted = false and
																ub.deleted = false and
																ub.user_id = '${userId}' and
																ub.branch_id = '${branchId}'`;
		response.totalCount = await this.runSqlGetCount(countSql);
		return response;
	}

	public static async getProfessorCollegeSemesterSections(
		ctx: ContextWrapper,
		userId: string,
		collegeId: string,
		branchId: string,
		semesterId: string,
	) {
		const { offset, limit } = SystemHelper.getOffsetAndLimit(+ctx.params.offset, +ctx.params.limit);
		const response: PagedResponse<any> = new PagedResponse();

		const sql: string = `select
													DISTINCT ub.section_id as count,
													s.name ,
													s.is_default as isDefault
												from user_branches ub
												join sections s on s.id = ub.section_id
												where
													ub.college_id = '${collegeId}' and
													s.deleted = false and
													ub.deleted = false and
													ub.user_id = '${userId}' and
													ub.branch_id = '${branchId}' and
													ub.semester_id = '${semesterId}'
												limit ${limit} offset ${offset}`;
		response.items = await this.runSql(sql);

		const countSql: string = `select
																count(DISTINCT ub.section_id) as count
															from user_branches ub
															join sections s on s.id = ub.section_id
															where
																ub.college_id = '${collegeId}' and
																s.deleted = false and
																ub.deleted = false and
																ub.user_id = '${userId}' and
																ub.branch_id = '${branchId}' and
																ub.semester_id = '${semesterId}'`;
		response.totalCount = await this.runSqlGetCount(countSql);
		return response;
	}

	public static async getProfessorCollegeSectionSubjects(ctx: ContextWrapper, userId: string, collegeId: string, sectionId: string) {
		const { offset, limit } = SystemHelper.getOffsetAndLimit(+ctx.params.offset, +ctx.params.limit);
		const response: PagedResponse<any> = new PagedResponse();

		const sql: string = `select
													s.*,
													s.id as subjectId,
													ub.college_id as collegedId,
													ub.section_id as sectionId,
													ub.branch_id as branchId,
													ub.semester_id as semesterId
												from user_branches ub
												join branches b on b.id = ub.branch_id
												join subjects s on s.id = ub.subject_id and s.deleted = false
												where
													ub.college_id = '${collegeId}' and
													b.deleted = false and
													ub.deleted = false and
													ub.user_id = '${userId}' and
													ub.section_id = '${sectionId}'
												limit ${limit} offset ${offset}`;
		response.items = await this.runSql(sql);

		const countSql: string = `select count(*) as count
															from user_branches ub
															join branches b on b.id = ub.branch_id
															join subjects s on s.id = ub.subject_id and s.deleted = false
															where
																ub.college_id = '${collegeId}' and
																b.deleted = false and
																ub.deleted = false and
																ub.user_id = '${userId}' and
																ub.section_id = '${sectionId}'`;
		response.totalCount = await this.runSqlGetCount(countSql);
		return response;
	}
}
