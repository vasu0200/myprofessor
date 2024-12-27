import { ContextWrapper } from '@Helpers/molecular-helper';
import { Campaign } from '@Models/campaign';
import { CampaignType } from '@Utility/enum';
import { Method } from 'moleculer-decorators';

export class CampaignHelper {
	@Method
	public static setCampaignDetails(ctx: ContextWrapper, target: Campaign): Campaign {
		target.name = ctx.params.name;
    target.description = ctx.params.description;
    target.url = ctx.params.url;
		target.status = ctx.params.status || CampaignType.Infinite;
		target.marketingType = ctx.params.marketingType;
		target.startDate = ctx.params.startDate;
		target.endDate = ctx.params.endDate;
		target.campaignType = ctx.params.campaignType;
		target.rewardType = ctx.params.rewardType;
		target.commissionType = ctx.params.commissionType;
		target.cashWithdrawableType = ctx.params.cashWithdrawableType;

		return target;
	}
}
