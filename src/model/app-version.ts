import SystemHelper from '@Helpers/system-helpers';
import { Entity, Column, PrimaryColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'app_versions' })
export class AppVersion {
	@PrimaryColumn({})
	id: string;

	@Column({ comment: 'PII' })
	title?: string;

	@Column({})
	description?: string;

	@Column({})
	version?: string;

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
