import SystemHelper from '@Helpers/system-helpers';
import { SMSStatus } from '@Utility/enum';
import { Entity, Column, PrimaryColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'sms_logs' })
export class SMSLog {
	@PrimaryColumn({})
	id: string;

	@Column({ comment: 'PII' })
	mobile?: string;

	@Column({})
	subject?: string;

	@Column({})
	message?: string;

	@Column({})
	status: SMSStatus;

	// @Column({ name: 'additional_info' })
	// additionalInfo?: string;

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
		this.status = SMSStatus.Sent;
		this.id = SystemHelper.getUUID();
		this.createdBy = '';
		this.deleted = false;
	}
}
