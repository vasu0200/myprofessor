import SystemHelper from '@Helpers/system-helpers';
import { Entity, Column, CreateDateColumn, UpdateDateColumn, PrimaryColumn } from 'typeorm';

@Entity({ name: 'razorpay_orders' })
export class RazorpayOrder {
	@PrimaryColumn({})
	id: string;

	@Column({ name: 'user_id' })
	userId?: number;

	@Column({ name: 'order_id' })
	orderId?: string;

	@Column({})
	entity?: string;

	@Column({})
	amount?: number;

	@Column({ name: 'amount_paid' })
	amountPaid?: number;

	@Column({ name: 'amount_due' })
	amountDue?: number;

	@Column({})
	currency?: string;

	@Column({})
	receipt?: string;

	@Column({})
	status?: string;

	@Column({})
	attempts?: number;

	@Column({ type: 'json', nullable: true })
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	notes?: any;

	@Column({ name: 'order_created_at' })
	orderCreatedAt?: number;

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
