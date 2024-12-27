import SystemHelper from '@Helpers/system-helpers';
import { RazorpayXPayoutStatusType } from '@Utility/enum';
import { Entity, Column, CreateDateColumn, UpdateDateColumn, PrimaryColumn } from 'typeorm';

@Entity({ name: 'payout_transactions' })
export class PayoutTransaction {
	@PrimaryColumn({})
	id: string;

	@Column({ name: 'user_id' })
	userId?: string;

	@Column({ name: 'razorpay_payout_id' })
	razorpayPayoutId?: string;

	@Column({})
	points: number;

	@Column({})
	amount: number;

	@Column({})
	status?: string;

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
		this.createdBy = '';
		this.deleted = false;
		this.status = RazorpayXPayoutStatusType.Pending;
		this.points = 0;
		this.amount = 0;
	}
}
