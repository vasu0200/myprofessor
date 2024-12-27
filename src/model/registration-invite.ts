import SystemHelper from '@Helpers/system-helpers';
import { RegistrationInviteStatusType } from '@Utility/enum';
import { Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'registration_invites' })
export class RegistrationInvite {
	@PrimaryColumn({})
	id: string;

	@Column({ name: 'user_id' })
	userId: string;

	@Column({ name: 'invite_code' })
	inviteCode: string;

	@Column({ name: 'inviter_id' })
	inviterId: string;

	@Column({ name: 'registration_status' })
	registrationStatus: string;

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
		this.userId = '';
		this.inviteCode = '';
		this.inviterId = '';
		this.registrationStatus = RegistrationInviteStatusType.Sent;
	}
}
