import SystemHelper from '@Helpers/system-helpers';
import { Entity, Column, UpdateDateColumn, CreateDateColumn, PrimaryColumn } from 'typeorm';

@Entity({ name: 'firebase_notification_logs' })
export class FirebaseNotificationLog {
	@PrimaryColumn({})
	id: string;

	@Column({ name: 'type' })
	type?: string;

	@Column({ name: 'additional_info' })
	additionalInfo?: string;

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
