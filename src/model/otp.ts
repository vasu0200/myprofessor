import SystemHelper from '@Helpers/system-helpers';
import { OtpSourceType, OtpStatus } from '@Utility/enum';
import { Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'otps' })
export class Otp {
	@PrimaryColumn({})
	id: string;

	@Column({ name: 'send_to' })
	sendTo: string;

	@Column({})
	otp: string;

	@Column({ name: 'source_type' })
	sourceType: string;

	@Column({ name: 'request_attempts' })
	requestAttempts: number;

	@Column({ name: 'validate_attempts' })
	validateAttempts: number;

	@Column({})
	status: string;

	@Column({ name:'expiry_date' })
	expiryDate?: Date;

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
		this.sendTo = '';
		this.otp = '';
		this.requestAttempts = 0;
		this.validateAttempts = 0;
		this.status = OtpStatus.Sent;
		this.sourceType = OtpSourceType.Email;
	}
}
