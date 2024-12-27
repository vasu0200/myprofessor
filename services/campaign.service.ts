import { CampaignDao } from '@Dao/campaign.dao';
import { ErrorHelper } from '@Helpers/error-helper';
import { ContextWrapper } from '@Helpers/molecular-helper';
import { CampaignHelper } from '@Helpers/service-helpers/campaign.helper';
import { Campaign } from '@Models/campaign';
import { Constants } from '@Utility/constants';
import { Messages } from '@Utility/Messages';
import { Action } from 'moleculer-decorators';
import { PagedResponse } from 'src/dto/base.dto';
import { CampaignDto, CampaignMapper } from 'src/dto/campaign.dto';
import AuthSchema from './auth';

export default class CampaignService extends AuthSchema {
	public name: string = 'campaign';

	@Action({
		params: {},
	})
	public async getCampaigns(ctx: ContextWrapper): Promise<PagedResponse<CampaignMapper[]>> {
		const campaigns = await CampaignDao.getCampaigns(ctx);
		campaigns.items = CampaignDto.transformResources(campaigns.items, new CampaignMapper());
		return campaigns;
	}

	@Action({
		params: {
			campaignId: { type: 'string' },
		},
	})
	public async getCampaign(ctx: ContextWrapper): Promise<CampaignMapper> {
		const campaign = await CampaignDao.getGenericResource(ctx, Campaign, { where: { id: ctx.params.campaignId } });

		if (!campaign) {
			ErrorHelper.throwError(Messages.INVALID_CAMPAIGN, 404, Constants.SYSTEM_EXCEPTION_TYPES.DATA_NOT_FOUND);
		}

		return CampaignDto.transformResource(campaign, new CampaignMapper());
	}

	@Action({
		params: {
			name: { type: 'string' },
			description: { type: 'string', optional: true },
			url: { type: 'string' },
			status: { type: 'string', optional: true },
			startDate: { type: 'string', optional: true },
			endDate: { type: 'string', optional: true },
			marketingType: { type: 'string' },
			campaignType: { type: 'string' },
			rewardType: { type: 'string' },
			commissionType: { type: 'string' },
			cashWithdrawableType: { type: 'string' },
		},
	})
	public async addCampaign(ctx: ContextWrapper): Promise<CampaignMapper> {
		// Question: do we need to check duplicate name ?
		let newCampaign: Campaign = CampaignHelper.setCampaignDetails(ctx, new Campaign());
		newCampaign = await CampaignDao.saveGenericResource(ctx, newCampaign);

		return CampaignDto.transformResource(newCampaign, new CampaignMapper());
	}

	@Action({
		params: {
			campaignId: { type: 'string' },
			status: { type: 'string' },
			endDate: { type: 'string' },
		},
	})
	public async updateCampaign(ctx: ContextWrapper): Promise<CampaignMapper> {
		let campaign = await CampaignDao.getGenericResource(ctx, Campaign, { where: { id: ctx.params.campaignId } });

		if (!campaign) {
			ErrorHelper.throwError(Messages.INVALID_CAMPAIGN, 404, Constants.SYSTEM_EXCEPTION_TYPES.DATA_NOT_FOUND);
		}

		campaign.status = ctx.params.status;
		campaign.endDate = ctx.params.endDate;
		campaign = await CampaignDao.saveGenericResource(ctx, campaign);

		return CampaignDto.transformResource(campaign, new CampaignMapper());
	}

	@Action({
		params: {
			campaignId: { type: 'string' },
		},
	})
	public async deleteCampaign(ctx: ContextWrapper): Promise<boolean> {
		const campaign = await CampaignDao.getGenericResource(ctx, Campaign, { where: { id: ctx.params.campaignId } });

		if (!campaign) {
			ErrorHelper.throwError(Messages.INVALID_CAMPAIGN, 404, Constants.SYSTEM_EXCEPTION_TYPES.DATA_NOT_FOUND);
		}

		await CampaignDao.softDeleteResource(ctx, campaign);
		return true;
	}
}
module.exports = new CampaignService();
