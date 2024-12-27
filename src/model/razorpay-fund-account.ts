import SystemHelper from '@Helpers/system-helpers';
import { Entity, Column, CreateDateColumn, UpdateDateColumn, PrimaryColumn } from 'typeorm';

@Entity({ name: 'razorpay_fund_accounts' })
export class RazorpayFundAccount {
	@PrimaryColumn({})
	id: string;

	@Column({ name: 'user_id' })
	userId?: string;

	@Column({ name: 'contact_id' })
	contactId?: string;

	@Column({ name: 'fund_account_id' })
	fundAccountId?: string;

	@Column({ name: 'account_type' })
	accountType?: string;

	@Column({})
	entity?: string;

	@Column({})
	ifsc?: string;

	@Column({ name: 'bank_name' })
	bankName?: string;

	@Column({})
	name?: string;

	@Column({ name: 'account_number' })
	accountNumber?: string;

	@Column({ name: 'vpa_address' })
  vpaAddress?: string;

	@Column({ name: 'vpa_username' })
	vpaUserName?: string;

	@Column({ name: 'vpa_handle' })
	vpaHandle?: string;

	@Column({ name: 'batch_id' })
	batchId?: string;

	@Column({})
	active?: boolean;

	@Column({ type: 'json', nullable: true })
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	notes?: any;

	@Column({ name: 'fund_account_created_at' })
	fundAccountCreatedAt?: number;

	@Column({ name: 'error_meta', type: 'json', nullable: true })
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	errorMeta?: any;

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
