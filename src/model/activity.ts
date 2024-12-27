import SystemHelper from '@Helpers/system-helpers';
import { ActivityCodeType } from '@Utility/enum';
import { Entity, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, PrimaryColumn } from 'typeorm';
import { Role } from './role';

@Entity({ name: 'activities' })
export class Activity {
	@PrimaryColumn({})
	id: string;

	@Column({})
	activity: string;

	@Column({ type: 'enum', enum: ActivityCodeType, name: 'activity_type' })
	activityType?: string;

	@Column({ name: 'card_image' })
	cardImage?: string;

	@Column({})
	faIcon?: string;

	@Column({ default: false, name: 'is_repeted' })
	isRepeted: boolean;

	@ManyToOne(() => Role, (r) => r.id)
	@JoinColumn({ name: 'role_id' })
	role?: Role;

	@Column({ nullable: true, name: 'role_id' })
	roleId: string;

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
		this.activity = '';
		this.isRepeted = false;
		this.roleId = '';
		this.deleted = false;
	}
}
