import SystemHelper from '@Helpers/system-helpers';
import { Entity, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany, PrimaryColumn } from 'typeorm';
import { Subject } from './subject';
import { Topic } from './topic';
import { TargetSourceType } from '@Utility/enum';

@Entity({ name: 'chapters' })
export class Chapter {
	@PrimaryColumn({})
	id: string;

	@Column({})
	name: string;

	@Column({})
	description: string;

	@Column({})
	image?: string;

	@Column({})
	idx: number;

	@Column({ name: 'subject_id' })
	subjectId: string;

	@Column({ default: false, name: 'is_default' })
	isDefault: boolean;

	@Column({ name: 'target_source' })
	targetSource: TargetSourceType;

	@ManyToOne(() => Subject, (g) => g.id)
	@JoinColumn({ name: 'subject_id' })
	subject?: Subject;

	@OneToMany(() => Topic, (t) => t.chapter, { lazy: true })
	topics?: Promise<Topic[]>;

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
		this.createdBy = '-1';
		this.name = '';
		this.description = '';
		this.idx = -1;
		this.subjectId = '';
		this.deleted = false;
		this.isDefault = true;
		this.targetSource = TargetSourceType.Admin;
	}
}
