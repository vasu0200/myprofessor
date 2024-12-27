import { ContextWrapper } from '@Helpers/molecular-helper';
import { BaseDao } from './base.dao';

export class AppVersiontDao extends BaseDao {
	public static async getAppLatestVersion(ctx: ContextWrapper) {
		const sql: string = `select * from app_versions av
												 where
														av.deleted = false
                            order by av.updated_at desc
													limit 1`;
		return await this.runSqlFindOne(sql);
	}
}
