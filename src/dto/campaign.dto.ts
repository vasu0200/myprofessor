import { BaseDto } from './base.dto';

export class CampaignDto extends BaseDto {}

export class CampaignMapper {
	id: string;
	name: string;
	description: string;
	status: string;
	startDate: string;
	endDate: string;
	marketingType: string;
	campaignType: string;
	rewardType: string;
	commissionType: string;
	cashWithdrawableType: string;

	constructor() {
		this.id = '';
		this.name = '';
		this.description = '';
		this.status = '';
		this.startDate = '';
		this.endDate = '';
		this.marketingType = '';
		this.campaignType = '';
		this.rewardType = '';
		this.commissionType = '';
		this.cashWithdrawableType = '';
	}
}
