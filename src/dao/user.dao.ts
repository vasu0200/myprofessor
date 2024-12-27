import { ContextWrapper } from '@Helpers/molecular-helper';
import SystemHelper from '@Helpers/system-helpers';
import { UserRoleType } from '@Utility/enum';
import { PagedResponse } from 'src/dto/base.dto';
import { BaseDao } from './base.dao';

export class UserDao extends BaseDao {
	public static async getUsers(ctx: ContextWrapper, searchValue: string = '', userRoles: string): Promise<PagedResponse<any>> {
		const { offset, limit } = SystemHelper.getOffsetAndLimit(+ctx.params.offset, +ctx.params.limit);
		const response: PagedResponse<any> = new PagedResponse();
		const selectSqlStmt: string = `select
                                   u.id,
                                   u.first_name as firstName,
                                   u.last_name as lastName,
                                   u.email,
                                   u.gender,
                                   u.account_status as accountStatus,
                                   u.mobile_number as mobile,
                                   r.name as "userType",
                                   a.state,
                                   a.zip_code as zipCode,
                                   uni.name as universityName,
																	 b.name as branchName,
																	 s.name as semesterName`;
		const joinSqlStmt: string = `from users u
                                 left join address a on a.id = u.address_id and a.deleted = false
                                 left join user_roles ur on ur.user_id = u.id and ur.deleted = false
								                 left join roles r on r.id = ur.role_id and r.deleted = false
                                 left join user_branches ub on ub.user_id = u.id and ub.deleted = false
																 left join universities uni on uni.id = ub.university_id and uni.deleted = false
																 left join branches b on b.id = ub.branch_id and b.deleted = false
																 left join semesters s on s.id = ub.semester_id and s.deleted = false
																 `;
		const searchSqlStmt: string = ` where u.deleted = false and (u.first_name LIKE '%${searchValue}%'
                                    or u.last_name LIKE '%${searchValue}%'
                                    or u.email LIKE '%${searchValue}%'
                                    or u.account_status LIKE '%${searchValue}%'
                                    or r.name LIKE '%${searchValue}%')`;
		let rolesSqlStmt = '';

		if (userRoles) {
			rolesSqlStmt = ` and r.name in (${userRoles.split(',').map((role) => "'" + role + "'")})`;
		}

		const sql: string = `${selectSqlStmt}
                         ${joinSqlStmt}
                         ${searchSqlStmt}
                         ${rolesSqlStmt}
												 order by u.id desc
                         limit ${limit} offset ${offset}`;

		response.items = await this.runSql(sql);
		const countSql: string = `select count(*) as count
															${joinSqlStmt}
                              ${searchSqlStmt}
                              ${rolesSqlStmt}`;
		response.totalCount = await this.runSqlGetCount(countSql);
		return response;
	}

	public static async getUser(ctx: ContextWrapper, userId: string) {
		const sql: string = `select
													u.id as userId,
													u.first_name as "firstName",
													u.last_name as lastName,
													u.middle_name as middleName,
													u.email,
													u.account_status as accountStatus,
													u.gender,
													u.dob,
													a.state,
                          a.zip_code as zipCode,
													u.mobile_number as "mobileNumber",
													u.profile_pic as "profilePic",
													u.p1_email as p1Email,
													u.p1_first_name as p1FirstName,
													u.p1_last_name as p1LastName,
													u.p1_email,
													u.p1_first_name as p1FirstName,
													u.p1_last_name as p1LastName,
													u.p2_email as p2Email,
													u.p2_first_name as p2FirstName,
													u.p2_last_name as p2LastName,
													r.id as roleId,
													r.name as roleName,
													r.description as "roleDescription",
													ur.university_id as "universityId",
													ur.college_id as "collegeId",
													cl.name as "collegeName",
													ub.branch_id as "branchId",
													s.id as "semesterId",
													uni.name as "universityName",
													b.name as "branchName",
													s.name as semesterName,
													se.id as "sectionId",
													se.name as sectionName
												from users u
												join user_access ua on ua.user_id = u.id
												left join address a on a.id = u.address_id and a.deleted = false
												left join user_roles ur on ur.user_id = u.id
												left join roles r on r.id = ur.role_id and r.deleted = false and ur.deleted = false
												left join user_branches ub  on ub.user_id = u.id and ub.deleted = false
												left join universities uni on uni.id = ur.university_id and uni.deleted = false
												left join branches b on b.id = ub.branch_id and b.deleted = false
												left join sections se on se.id = ub.section_id and se.deleted = false
												left join semesters s on s.id = ub.semester_id and s.deleted = false
												left join colleges cl on cl.id = ub.college_id and cl.deleted = false
												where u.id = '${userId}'
															and u.deleted = false
															and ua.deleted = false`;
		return await BaseDao.runSqlFindOne(sql);
	}

	public static async getCollegeUsers(ctx: ContextWrapper, collegeId: string) {
		const { offset, limit } = SystemHelper.getOffsetAndLimit(+ctx.params.offset, +ctx.params.limit);
		const response: PagedResponse<any> = new PagedResponse();
		const roleName: UserRoleType = ctx.params.roleName;
		const searchValue: string = ctx.params.searchValue;
		let withClauseSqlStmt: string = ``;
		const searchSqlStmt: string = searchValue
			? `where firstName like '%${searchValue}%' or
								lastName like '%${searchValue}%' or
								email like '%${searchValue}%' or
								roleName like '%${searchValue}%' or
								branchName like '%${searchValue}%' or
								semesterName like '%${searchValue}%'`
			: ``;
		const studentSqlStmt: string = `select
															ur.user_id as userId,
															u.first_name as firstName,
															u.last_name as lastName,
															u.email,
															r.name as roleName,
															u.account_status as accountStatus,
															b.name as branchName,
															s.name as semesterName,
															u.created_at as userCreatedAt
														from user_branches ub
														join users u on u.id = ub.user_id
														join user_roles ur on ur.user_id = ub.user_id and ur.deleted = false
														join roles r on r.id = ur.role_id and r.name = '${UserRoleType.Student}'
														join branches b on b.id = ub.branch_id
														join semesters s on s.branch_id = b.id and s.id = ub.semester_id
														left join college_semesters cs on cs.semester_id = s.id and cs.deleted = false
														where
															ub.college_id = '${collegeId}' and
															s.deleted = false and
															b.deleted = false and
															r.deleted = false and
															ur.deleted = false and
															u.deleted = false and
															ub.deleted = false`;
		const professorSqlStmt: string = `select
															ur.user_id as userId,
															u.first_name as firstName,
															u.last_name as lastName,
															u.email,
															r.name as roleName,
															u.account_status as accountStatus,
															'NA' as branchName,
															'NA' as semesterName,
															u.created_at as userCreatedAt
														from user_roles ur
														join roles r on r.id = ur.role_id
														join users u on u.id = ur.user_id
														where
															ur.college_id = '${collegeId}' and
															ur.deleted = false and
															u.deleted = false and
															r.deleted = false and
															r.name = '${UserRoleType.Professor}'`;
		const offsetLimitSqlStmt: string = `limit ${limit} offset ${offset}`;

		if (roleName == UserRoleType.Student) {
			withClauseSqlStmt = `with collegeUsersInfo as (
														${studentSqlStmt}
													)`;
		} else if (roleName == UserRoleType.Professor) {
			withClauseSqlStmt = `with collegeUsersInfo as (
															 ${professorSqlStmt}
															 )`;
		} else {
			withClauseSqlStmt = `with collegeUsersInfo as (
														${studentSqlStmt}
														union
														${professorSqlStmt}
													)`;
		}

		const selectSqlStmt: string = `${withClauseSqlStmt}
																	 select * from collegeUsersInfo
										 							 ${searchSqlStmt}
										 							 order by userCreatedAt desc
										 							 ${offsetLimitSqlStmt}`;

		const countSqlStmt: string = `${withClauseSqlStmt}
																	select count(*) as count from collegeUsersInfo
																	${searchSqlStmt}`;

		response.items = await this.runSql(selectSqlStmt);
		response.totalCount = await this.runSqlGetCount(countSqlStmt);

		return response;
	}

	public static async getUsersByEmails(ctx: ContextWrapper) {
		const sql: string = `select u.email from users u
												where
													u.deleted = false and
													u.email in (${ctx.params.emailIds.map((email) => "'" + email + "'")})
                          `;
		console.log('sql:::::',sql);

		return await this.runSql(sql);
	}

	public static async getCollegeProfessors(ctx: ContextWrapper, searchValue: string, userRoles: string) {
		const { offset, limit } = SystemHelper.getOffsetAndLimit(+ctx.params.offset, +ctx.params.limit);
		const response: PagedResponse<any> = new PagedResponse();
		const sql: string = `select
  												u.id,
  												u.first_name as firstName,
  												u.last_name as lastName,
  												u.email,
  												u.gender,
  												u.account_status as accountStatus,
  												u.mobile_number as mobile,
  												r.name as "userType",
  												a.state,
  												a.zip_code as zipCode,
  												uni.name as universityName
												from users u
  											left join address a on a.id = u.address_id and a.deleted = false
  											left join user_roles ur on ur.user_id = u.id and ur.deleted = false
  											left join roles r on r.id = ur.role_id and r.deleted = false
  											left join universities uni on uni.id = ur.university_id and uni.deleted = false
												where
  												u.deleted = false and (
    												u.first_name LIKE '%${searchValue}%'
    												or u.last_name LIKE '%${searchValue}%'
    												or u.email LIKE '%${searchValue}%'
    												or u.account_status LIKE '%${searchValue}%'
    												or r.name LIKE '%${searchValue}%'
  												) and
													r.name = '${userRoles}'
												order by u.id desc
												limit ${limit} offset ${offset}`;
		response.items = await this.runSql(sql);

		const countSql: string = `select count(*)
															from users u
  														left join address a on a.id = u.address_id and a.deleted = false
  														left join user_roles ur on ur.user_id = u.id and ur.deleted = false
  														left join roles r on r.id = ur.role_id and r.deleted = false
  														left join universities uni on uni.id = ur.university_id and uni.deleted = false
															where
  															u.deleted = false and (
    															u.first_name LIKE '%${searchValue}%' or
																	u.last_name LIKE '%${searchValue}%' or
																	u.email LIKE '%${searchValue}%' or
																	u.account_status LIKE '%${searchValue}%' or
																	r.name LIKE '%${searchValue}%'
  															) and
																r.name = '${userRoles}'`;
		response.totalCount = await this.runSqlGetCount(countSql);
		return response;
	}

	public static async getActiveUsersByCollege(ctx: ContextWrapper) {
		const sql: string = `select
													r.name as rolename,
													count(distinct case when us.session_status = 'active' then u.id end) as activeUsersCount,
													count(distinct case when u.deleted = false then u.id end) as totalUsers
												from users u
												join user_roles ur on ur.user_id = u.id
												join roles r on r.id = ur.role_id
												left join user_sessions us on u.id = us.user_id and us.session_status = 'active'
												left join user_branches ub on u.id = ub.user_id and ub.deleted = false and ub.college_id = '${ctx.params.collegeId}'
												where
														u.deleted = false
														and ur.college_id = '${ctx.params.collegeId}'
												group by r.name`;
		return await this.runSql(sql);
	}

	public static async getUsersCountByCollege(ctx: ContextWrapper) {
		const sql: string = `select
														r.name as roleName,
														count(*) as roleCount
												from users u
												join user_roles ur on ur.user_id = u.id
												join roles r on r.id = ur.role_id
												where
													u.deleted = false and
													ur.college_id = '${ctx.params.collegeId}' and
													r.name IN ('${UserRoleType.CollegeAdmin}', '${UserRoleType.Professor}','${UserRoleType.Student}')
												group by r.name
                          `;
		return await this.runSql(sql);
	}

	public static async getCollegeBranchesCount(ctx: ContextWrapper) {
		const sql: string = `select count(*) as count
													from college_branches cb
													join branches b on b.id = cb.branch_id and b.deleted = false
													where
														cb.deleted = false and
														cb.college_id = '${ctx.params.collegeId}'`;
		return await this.runSqlGetCount(sql);
	}

	public static async getUserCountByBranchesForCollege(ctx: ContextWrapper) {
		const sql: string = `select
														b.name AS branchName,
														b.id AS branchId,
														COUNT(*) AS totalUsers
													from users u
													join user_branches ub on ub.user_id = u.id and ub.deleted=false
													join user_roles ur on ur.user_id = u.id
													join branches b on b.id = ub.branch_id
													join roles r on r.id = ur.role_id
													where
													 u.deleted = false and
													 ub.college_id = '${ctx.params.collegeId}' and
													 r.name IN ('${UserRoleType.Student}')
													 group by r.name, ub.branch_id`;

		return await this.runSql(sql);
	}

	public static async getActiveStudentsByCollege(ctx: ContextWrapper) {
		const sql: string = `select
                            DISTINCT(u.id) as userId,
                            u.first_name as firstName,
                            u.last_name as lastName,
														b.name as branchName,
  													b.id as branchId,
                            ub.college_id as collegeId,
                            r.name as roleName
                          from user_sessions us
                          join users u on u.id=us.user_id and u.deleted=false
                          join user_branches ub on ub.user_id=u.id and ub.deleted=false
													join branches b on b.id=ub.branch_id  and b.deleted=false
                          join user_roles ur on ur.user_id  =u.id
                          join roles r on r.id = ur.role_id
                          where
														us.session_status ='active' and
														ub.college_id = '${ctx.params.collegeId}' and
														r.name IN ('${UserRoleType.Student}')
                          `;
		return await this.runSql(sql);
	}

	public static async getFilterActiveStudents(ctx: ContextWrapper) {
		const sql: string = `select
                            DISTINCT(u.id) as userId,
														u.first_name as firstName,
														u.last_name as lastName,
														ub.college_id as collegeId,
														r.name as roleName,
														b.name as branchName,
														b.id as branchId
                          from user_sessions us
													join users u on u.id=us.user_id and u.deleted=false
													join user_branches ub on ub.user_id=u.id and ub.deleted=false
													join branches b on b.id=ub.branch_id  and b.deleted=false
													join user_roles ur on ur.user_id  =u.id
													join roles r on r.id = ur.role_id
                          where
														us.session_status ='active' and
														ub.college_id = '${ctx.params.collegeId}' and
														ub.branch_id  =  '${ctx.params.branchId}' and
														ub.section_id  =  '${ctx.params.sectionId}'and
														ub.semester_id  =  '${ctx.params.semesterId}' and
														r.name IN ('${UserRoleType.Student}')
                          `;
		return await this.runSql(sql);
	}

	public static async getFilterStudents(ctx: ContextWrapper) {
		const sql: string = `select
                            DISTINCT(u.id) as userId,
                            u.first_name as firstName,
                            u.last_name as lastName,
														b.name as branchName,
  													b.id as branchId,
                            ub.college_id as collegeId,
                            r.name as roleName
                          from user_branches ub
                          join users u on u.id=ub.user_id and u.deleted=false
													join branches b on b.id=ub.branch_id  and b.deleted=false
                          join user_roles ur on ur.user_id  =u.id
                          join roles r on r.id = ur.role_id
                          where
														ub.college_id = '${ctx.params.collegeId}' and
														ub.branch_id  =  '${ctx.params.branchId}' and
														ub.section_id  =  '${ctx.params.sectionId}'and
														ub.semester_id  =  '${ctx.params.semesterId}' and
														r.name IN ('${UserRoleType.Student}')
                          `;
		return await this.runSql(sql);
	}

	public static async getStudentTopTopicModules(ctx: ContextWrapper) {
		const sql: string = `with TopTopics as
												(
														select DISTINCT topic_id as topicId
														from user_analytics_progress uap
														where
																uap.deleted = false and
																uap.college_id = '${ctx.params.collegeId}' and
																uap.branch_id  =  '${ctx.params.branchId}' and
																uap.section_id  =  '${ctx.params.sectionId}'and
																uap.semester_id  =  '${ctx.params.semesterId}' and
																uap.progress > 0 and
																uap.progress_type = 'topic'
														order by uap.updated_at desc
														limit 5
												)
												select t.*
												from TopTopics tt
												join topics t on tt.topicId = t.id
                          `;
		return await this.runSql(sql);
	}

	public static async getStudentActivitiesTimeSpent(ctx: ContextWrapper) {
		const sql: string = `select
														aa.name as activityName,
														ad.activity_type as activityType,
														SUM(td.duration) as duration
												  from user_activity_analytics uaa
											  	join time_dim td on td.id = uaa.time_id and td.deleted = false
													join activity_dim ad on ad.id = uaa.activity_dm_id and ad.deleted = false
													join assigned_activities aa on aa.id = ad.activity_id and aa.deleted = false
													where
														uaa.deleted = false and
														uaa.college_id = '${ctx.params.collegeId}' and
														uaa.branch_id  =  '${ctx.params.branchId}' and
														uaa.section_id  =  '${ctx.params.sectionId}'and
														uaa.semester_id  =  '${ctx.params.semesterId}' and
													uaa.progress > 0 and
													ad.activity_type not in ('pre','post') and ad.status ='completed'
													group by ad.activity_type
                          `;
		return await this.runSql(sql);
	}

	public static async getAllUsersCount(ctx: ContextWrapper) {
		const sql: string = `select
														r.name AS name,
														count(u.id) AS count
													from users u
														join user_roles ur ON ur.user_id = u.id
														join roles r ON r.id = ur.role_id
													where u.deleted = false
													group by r.name
													union all
													select
														'Colleges' AS name,
														 count(*) AS count
													from colleges c
													where c.deleted = false
													union all
													select
														'Universities' AS name,
													   count(*) AS count
													from universities u
													where
														u.deleted = false
													union all
													select
													  'Subscribed Students' as name,
													  count(distinct p.user_id) AS count
													from payments p
													where
													p.payment_status = 'payment_success'
													`;
		return await this.runSql(sql);
	}

	public static async getAllActiveUsersCount(ctx: ContextWrapper) {
		const sql: string = `select
														r.name as name,
														sum(case when us.session_status = 'active' then 1 else 0 end) as activeCount,
														count(distinct u.id) AS totalCount
													from users u
													join user_roles ur on ur.user_id = u.id
													join roles r on r.id = ur.role_id
													left join user_sessions us on u.id = us.user_id and us.session_status = 'active'
													where u.deleted = false
													group by r.name
													`;
		return await this.runSql(sql);
	}

	public static async getRegistrationSubscriptionList(ctx: ContextWrapper) {
		const sql: string = `with GeneralStudents as (
																select
																		r.name as name,
																		count(case when date(u.created_at) >= '${ctx.params.fromDate}' and date(u.created_at) <= '${ctx.params.toDate}' then u.id end) as count
																from users u
																join user_roles ur on ur.user_id = u.id
																join roles r on r.id = ur.role_id
																where u.deleted = false
																and r.name = 'general student'
																group by r.name
														),
														SubscribedStudents as (
																select
																		'subscribed students' as name,
																		count(distinct case when date(p.created_at) >= '${ctx.params.fromDate}' and date(p.created_at) <= '${ctx.params.toDate}' then p.user_id end) as count
																from payments p
																where p.payment_status = 'payment_success'
														)
														select * from GeneralStudents
														union all
														select * from SubscribedStudents
													`;
		return await this.runSql(sql);
	}

	public static async getPlatformUsageByUsers(ctx: ContextWrapper) {
		const sql: string = `select
														us.device_type as platformType,
														count(DISTINCT us.user_id) as count
													from user_sessions us
													group by us.device_type
													`;
		return await this.runSql(sql);
	}
}
