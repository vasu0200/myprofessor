import SystemHelper from '@Helpers/system-helpers';
import { Entity, Column, CreateDateColumn, UpdateDateColumn, PrimaryColumn } from 'typeorm';

@Entity({ name: 'razorpay_payouts' })
export class RazorpayPayout {
	@PrimaryColumn({})
	id: string;

	@Column({ name: 'user_id' })
	userId?: string;

	@Column({ name: 'payout_id' })
	payoutId?: string;

	@Column({ name: 'fund_account_id' })
	fundAccountId?: string;

	@Column({})
	entity?: string;

	@Column({})
	amount?: number;

	@Column({})
	fees?: number;

	@Column({})
	tax?: number;

	@Column({})
	status?: string;

	@Column({})
	utr?: string;

	@Column({})
	mode?: string;

	@Column({})
	purpose?: string;

	@Column({ name: 'reference_id' })
	referenceId?: string;

	@Column({})
	narration?: string;

	@Column({ name: 'failure_reason' })
	failureReason?: string;

	@Column({ name: 'batch_id' })
	batchId?: string;

	@Column({ type: 'json', nullable: true })
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	notes?: any;

	@Column({ type: 'json', nullable: true, name: 'status_details' })
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	statusDetails?: any;

	@Column({ name: 'error_meta', type: 'json', nullable: true })
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	errorMeta?: any;

	@Column({ name: 'payout_created_at' })
	payoutCreatedAt?: number;

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
	}
}
