import { ContextWrapper } from '@Helpers/molecular-helper';
import SystemHelper from '@Helpers/system-helpers';
import { PagedResponse } from 'src/dto/base.dto';
import { BaseDao } from './base.dao';

export class CampaignDao extends BaseDao {
	public static async getCampaigns(ctx: ContextWrapper) {
		const { offset, limit } = SystemHelper.getOffsetAndLimit(+ctx.params.offset, +ctx.params.limit);
		const response: PagedResponse<any> = new PagedResponse();
    const sql: string = `select
                          c.id,
                          c.name,
                          c.description,
                          c.status,
                          c.start_date as startDate,
                          c.end_date as endDate,
                          c.marketing_type as marketingType,
                          c.campaign_type as campaignType,
                          c.reward_type as rewardType,
                          c.commission_type as commissionType,
                          c.cash_withdrawable_type as cashWithdrawableType
                         from campaigns c
                         where c.deleted = false
                         order by c.created_at desc
                         limit ${limit} offset ${offset}`;
		response.items = await this.runSql(sql);

		const countSql: string = `select count(*) as count
															from campaigns
															where deleted = false`;
		response.totalCount = await this.runSqlGetCount(countSql);
		return response;
	}
}
