import { LiveClassInvite } from '@Models/live-class-invite';
import { BaseDao } from './base.dao';

export class LiveClassInviteDao extends BaseDao {
	public static async getLiveClassInvites(ids: string[]): Promise<LiveClassInvite[]> {
		const sql: string = `select lci.id
                         from live_class_invites lci
                         where lci.deleted = false AND lci.id IN ('${ids.join("','")}')`;
		const response = await this.runSql(sql);

		return response;
	}

	public static async isUserInvited(liveClassId: string, userId: string): Promise<boolean> {
		const sql: string = `select u.id, ug.grade_id as gradeId, lci.id as liveClassInviteId
                         from users u
												 left join user_grades ug on ug.user_id = '${userId}'
												 left join live_class_invites lci on lci.live_class_id = '${liveClassId}' AND lci.grade_id = ug.grade_id AND lci.section_id = ug.section_id AND ug.deleted = false
                         where u.id = '${userId}'`;

		const response = await this.runSql(sql);

		if (response[0] && response[0].liveClassInviteId) return true;
		return false;
	}
}
// /${ids.toString()}
