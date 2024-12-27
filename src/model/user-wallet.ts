import SystemHelper from '@Helpers/system-helpers';
import { Entity, Column, CreateDateColumn, UpdateDateColumn, PrimaryColumn } from 'typeorm';

@Entity({ name: 'user_wallets' })
export class UserWallet {
	@PrimaryColumn({})
	id: string;

	@Column({ name: 'user_id' })
	userId: string;

	@Column({ name: 'reward_points' })
	rewardPoints: number;

	@Column({ name: 'withdrawable_cash' })
	withdrawableCash: number;

	@Column({ name: 'non_Withdrawable_cash' })
	nonWithdrawableCash: number;

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
    this.withdrawableCash = 0;
    this.nonWithdrawableCash = 0;
		this.rewardPoints = 0;
		this.deleted = false;
		this.userId = '';
	}
}
