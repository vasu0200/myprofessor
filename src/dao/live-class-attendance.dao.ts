import { LiveClassAttendance } from '@Models/live-class-attendance';
import { BaseDao } from './base.dao';

export class LiveClassAttendanceDao extends BaseDao {
	public static async getLiveClassAttendances(userId: string): Promise<LiveClassAttendance[]> {
		const sql: string = `select lca.id, lca.live_class_id as liveClassId, lca.user_id as userId, lca.type, lca.time, u.first_name as userFirstName
                         from live_class_attendances lca
												 left join users u on u.id = '${userId}'
												 left join live_classes lc on lc.id = lca.live_class_id
                         where lca.deleted = false`;
		const response = await this.runSql(sql);

		return response;
	}
}
