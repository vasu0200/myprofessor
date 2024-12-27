import SystemHelper from '@Helpers/system-helpers';
import { Entity, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany, PrimaryColumn } from 'typeorm';
import { Chapter } from './chapter';
import { Semester } from './semester';
import { TargetSourceType } from '@Utility/enum';

@Entity({ name: 'subjects' })
export class Subject {
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

	@Column({})
	color?: string;

	@Column({ name: 'semester_id' })
	semesterId: string;

	@Column({ name: 'college_semester_id' })
	collegeSemesterId: string;

	@Column({ name: 'target_source' })
	targetSource: TargetSourceType;

	@Column({ default: false, name: 'is_default' })
	isDefault: boolean;

	@ManyToOne(() => Semester, (aa) => aa.id)
	@JoinColumn({ name: 'semester_id' })
	semester?: Semester;

	@OneToMany(() => Chapter, (c) => c.subject, { lazy: true })
	chapters?: Promise<Chapter[]>;

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
		this.semesterId = '';
		this.deleted = false;
		this.collegeSemesterId = '';
		this.isDefault = true;
		this.targetSource = TargetSourceType.Admin;
	}
}
