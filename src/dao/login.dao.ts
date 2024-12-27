import { DeviceType, SessionStatusType } from '@Utility/enum';
import { BaseDao } from './base.dao';

export class LoginDao extends BaseDao {
	public static async checkEmail(email: string) {
		const sql: string = `select * from users u
                         where lower(u.email) = '${email.toLowerCase()}' and
															 u.deleted = false`;
		return await BaseDao.runSqlFindOne(sql);
	}

	public static async getUserInfoForLogin(userIdentifier: string) {
		const sql: string = `select
													u.id as userId,
													u.first_name as "firstName",
													u.last_name as lastName,
													u.middle_name as middleName,
													u.email,
													u.account_status as accountStatus,
													u.gender,
													u.dob,
													u.mobile_number as "mobileNumber",
													u.profile_pic as "profilePic",
													r.id as roleId,
													r.name as roleName,
													r.description as "roleDescription",
													ur.university_id as "universityId",
													ur.college_id as "collegeId",
													ub.branch_id as "branchId",
													s.id as "semesterId",
													uni.name as "universityName",
													b.name as "branchName",
													s.name as semesterName,
													ua.password
												from users u
												join user_access ua on ua.user_id = u.id
												left join user_roles ur on ur.user_id = u.id
												left join roles r on r.id = ur.role_id and r.deleted = false and ur.deleted = false
												left join user_branches ub  on ub.user_id = u.id and ub.deleted = false
												left join universities uni on uni.id = ur.university_id and uni.deleted = false
												left join branches b on b.id = ub.branch_id and b.deleted = false
												left join semesters s on s.id = ub.semester_id and s.deleted = false
												where (u.email = lower('${userIdentifier}') or u.mobile_number = '${userIdentifier}')
															and u.deleted = false
															and ua.deleted = false`;
		return await BaseDao.runSqlFindOne(sql);
	}

	public static async getSSOUserInfoForLogin(email: string) {
		const sql: string = `select
													u.id as userId,
													u.first_name as "firstName",
													u.last_name as lastName,
													u.middle_name as middleName,
													u.email,
													u.account_status as accountStatus,
													u.gender,
													u.dob,
													u.mobile_number as "mobileNumber",
													u.profile_pic as "profilePic",
													r.id as roleId,
													r.name as roleName,
													r.description as "roleDescription",
													ur.board_id as "boardId",
													ur.school_id as "schoolId",
													ug.grade_id as "gradeId",
													b.name as "boardName",
													g.name as "gradeName"
												from users u
												left join user_roles ur on ur.user_id = u.id
												left join roles r on r.id = ur.role_id and r.deleted = false and ur.deleted = false
												left join user_grades ug on ug.user_id = u.id and ug.deleted = false
												left join boards b on b.id = ur.board_id and b.deleted = false
												left join grades g on g.id = ug.grade_id and g.deleted = false
												where u.email = lower('${email}')
															and u.deleted = false`;
		return await BaseDao.runSqlFindOne(sql);
	}

	public static async checkMobile(mobile: string) {
		const sql: string = `select u.mobile_number as "mobileNumber", u.*
												 from users u
                         where mobile_number = '${mobile}' and
															 u.deleted = false`;
		return await this.runSqlFindOne(sql);
	}

	public static async killUserCurrentDeviceSessions(userId: string, deviceType: DeviceType) {
		const sql: string = `update user_sessions set session_status = '${SessionStatusType.Superceded}'
												 where
												 		user_id = '${userId}' and
												 		device_type = '${deviceType}' and
														deleted = false and
														session_status = '${SessionStatusType.Active}'`;
		return await this.runSql(sql);
	}

	public static async getUserSessionByJwt(jwt: string) {
		const sql: string = `select * from user_sessions us
													where
														us.deleted = false and
														us.jwt = '${jwt}'`;
		return await this.runSqlFindOne(sql);
	}

	public static async updateUserSessionByJwt(jwt: string) {
		const sql: string = `update user_sessions set session_status = '${SessionStatusType.Expired}'
														where
														deleted = false and
														jwt = '${jwt}'`;
		return await this.runSqlFindOne(sql);
	}
}
