import SystemHelper from '@Helpers/system-helpers';
import { Entity, Column, CreateDateColumn, UpdateDateColumn, PrimaryColumn } from 'typeorm';

@Entity({ name: 'razorpay_contacts' })
export class RazorpayContact {
	@PrimaryColumn({})
	id: string;

	@Column({ name: 'user_id' })
	userId?: string;

	@Column({ name: 'contact_id' })
	contactId?: string;

	@Column({})
	entity?: string;

	@Column({})
	name?: string;

	@Column({})
	contact?: string;

	@Column({})
	email?: string;

	@Column({})
	type?: string;

	@Column({ name: 'reference_id' })
	referenceId?: string;

	@Column({ name: 'batch_id' })
	batchId?: string;

	@Column({})
	active?: boolean;

	@Column({ type: 'json', nullable: true })
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	notes?: any;

	@Column({ name: 'contact_created_at' })
	contactCreatedAt?: number;

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
