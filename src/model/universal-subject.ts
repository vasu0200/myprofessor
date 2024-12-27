import SystemHelper from '@Helpers/system-helpers';
import { Entity, Column, CreateDateColumn, UpdateDateColumn, OneToMany, PrimaryColumn } from 'typeorm';
import { UniversalTopic } from './universal-topic';

@Entity({ name: 'uni_subjects' })
export class UniversalSubject {
	@PrimaryColumn({})
	id: string;

	@Column({ length: 100, name: 'subject_name' })
	name: string;

	@Column({ nullable: true, name: 'subject_desc' })
	description: string;

	@Column({ nullable: true })
	color?: string;

	@Column({ nullable: true })
	image?: string;

	@OneToMany(() => UniversalTopic, (t) => t.universalSubject)
	universalTopics?: UniversalTopic[];

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
		this.name = '';
		this.description = '';
		this.deleted = false;
	}
}
