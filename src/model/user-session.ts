import SystemHelper from '@Helpers/system-helpers';
import { DeviceType, SessionStatusType } from '@Utility/enum';
import { Entity, Column, UpdateDateColumn, CreateDateColumn, PrimaryColumn } from 'typeorm';

@Entity({ name: 'user_sessions' })
export class UserSession {
	@PrimaryColumn({})
	id: string;

	@Column({ name: 'user_id' })
	userId?: string;

	@Column({ name: 'jwt' })
	jwt?: string;

	@Column({ name: 'session_status' })
	sessionStatus: SessionStatusType;

	@Column({ name: 'device_id' })
	deviceId?: string;

	@Column({ name: 'device_token' })
	deviceToken?: string;

	@Column({ name: 'device_type' })
	deviceType?: DeviceType;

	@CreateDateColumn({ name: 'expiry_date' })
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
		this.sessionStatus = SessionStatusType.Active;
		this.deviceType = DeviceType.Web;
	}
}
