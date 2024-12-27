import { ContextWrapper } from '@Helpers/molecular-helper';
import SystemHelper from '@Helpers/system-helpers';
import { UserRoleType } from '@Utility/enum';
import { BaseDao } from './base.dao';

export class LeaderBoardDao extends BaseDao {
	public static async getLeaderBoardLogs(ctx: ContextWrapper) {
		const { offset, limit } = SystemHelper.getOffsetAndLimit(+ctx.params.offset, +ctx.params.limit);
		const sql: string = `select
                          lbl.id,
                          lbr.code,
                          lbr.description,
                          lbl.points,
                          lbl.created_at as createdAt
                        from leader_board_logs lbl
                        join leader_board_rules lbr on lbr.id = lbl.leader_board_rule_id
                        where
                          lbl.deleted = false and
                          lbr.deleted = false and
                          lbl.user_id = '${ctx.params.userId}' and
                          lbl.university_id = '${ctx.params.universityId}'
                        order by lbl.created_at desc
                        limit ${limit} offset ${offset}`;
		const leaderBoardLogs = await this.runSql(sql);

		const countSql: string = `select
                                sum(lbl.points) as totalLeaderBoardPoints
                              from leader_board_logs lbl
                              where
                                lbl.deleted = false and
                                lbl.user_id = '${ctx.params.userId}' and
                                lbl.university_id = '${ctx.params.universityId}' `;
		const totalLeaderBoardPoints = await this.runSqlFindOne(countSql);

		return { leaderBoardLogs, totalLeaderBoardPoints };
	}

  public static async getLeaderBoardStats(ctx: ContextWrapper, role: UserRoleType) {
    const roleQuery: string = role == UserRoleType.Student ? `and lb.college_id = '${ctx.params.collegeId}'` : ` `;
		const leaderBoardListSql: string = `select
                                          lb.user_id as userId,
                                          u.first_name as firstName,
                                          u.last_name as lastName,
                                          u.profile_pic as profilePic,
                                          u.email,
                                          lb.points,
                                          dense_rank() OVER (order by lb.points desc) as 'rank'
                                        from leader_boards lb
                                        join users u on u.id = lb.user_id
                                        join user_roles ur on ur.user_id = u.id and ur.deleted = false
                                        join roles r on r.id = ur.role_id and r.deleted = false
                                        where
                                          u.deleted = false and
                                          lb.deleted = false and
                                          r.name = '${role}' and
                                          lb.university_id = '${ctx.params.universityId}' ${roleQuery}
                                        limit 100 offset 0`;
		const leaderBoardList = await this.runSql(leaderBoardListSql);
		const userLeaderBoardInfo = leaderBoardList.find((lbl) => lbl.userId == ctx.params.userId);
		return { userLeaderBoardInfo, leaderBoard: leaderBoardList.slice(0, 100) };
	}
}
