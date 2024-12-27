import SystemHelper from '@Helpers/system-helpers';
import { CampaignStatus, CampaignType, CashWithdrawableType, CommissionType, MarketingType, RewardType } from '@Utility/enum';
import { Entity, Column, CreateDateColumn, UpdateDateColumn, PrimaryColumn } from 'typeorm';

@Entity({ name: 'campaigns' })
export class Campaign {
	@PrimaryColumn({})
	id: string;

	@Column({})
	name: string;

	@Column({})
	description: string;

	@Column({})
	url: string;

	@Column({})
	status: string;

	@Column({ name: 'start_date' })
	startDate?: Date;

	@Column({ name: 'end_date' })
	endDate?: Date;

	@Column({ name: 'marketing_type' })
	marketingType: MarketingType;

	@Column({ name: 'campaign_type' })
	campaignType: CampaignType;

	@Column({ name: 'reward_type' })
	rewardType: RewardType;

	@Column({ name: 'commission_type' })
	commissionType: CommissionType;

	@Column({ name: 'cash_withdrawable_type' })
	cashWithdrawableType: CashWithdrawableType;

	@Column({ name: 'created_by' })
	createdBy: string;

	@CreateDateColumn({ name: 'created_at' })
	createdAt?: Date;

	@Column({ nullable: true, name: 'updated_by' })
	updatedBy?: string;

	@UpdateDateColumn({ name: 'updated_at' })
	updatedAt?: Date;

	@Column({ type: 'tinyint' })
	deleted: boolean;

	constructor() {
		this.id = SystemHelper.getUUID();
		this.createdBy = '-1';
		this.name = '';
		this.description = '';
		this.url = '';
		this.deleted = false;
		this.status = CampaignStatus.NotStarted;
		this.campaignType = CampaignType.TimeBound;
		this.rewardType = RewardType.Cash;
		this.commissionType = CommissionType.Fixed;
		this.cashWithdrawableType = CashWithdrawableType.NonWithDrawable;
		this.marketingType = MarketingType.ReferAndEarn;
	}
}
