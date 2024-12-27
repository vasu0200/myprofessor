import SystemHelper from '@Helpers/system-helpers';
import { ActivationCardStatusType } from '@Utility/enum';
import { Entity, Column, CreateDateColumn, UpdateDateColumn, PrimaryColumn, JoinColumn, ManyToOne } from 'typeorm';
import { University } from './university';
import { Branch } from './branch';
import { Semester } from './semester';

@Entity({ name: 'activation_cards' })
export class ActivationCard {
	@PrimaryColumn({})
	id: string;

	@Column({ name: 'channel_partner_id' })
	channelPartnerId: string;

	@Column({ name: 'activation_code' })
	activationCode: string;

	@Column({ name: 'redeem_user_id' })
	redeemUserId: string;

	@Column({ name: 'university_id' })
	universityId: string;

	@Column({ name: 'status' })
	status: string;

	@ManyToOne(() => University, (uni) => uni.id)
	@JoinColumn({ name: 'university_id' })
	university?: University;

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
		this.channelPartnerId = '';
		this.activationCode = '';
		this.redeemUserId = '';
		this.universityId = '';
		this.deleted = false;
		this.status = ActivationCardStatusType.Active;
	}
}
