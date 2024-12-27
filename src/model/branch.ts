import SystemHelper from '@Helpers/system-helpers';
import { Entity, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany, PrimaryColumn } from 'typeorm';
import { University } from './university';
import { Semester } from './semester';

@Entity({ name: 'branches' })
export class Branch {
	@PrimaryColumn({})
	id: string;

	@Column({})
	name: string;

	@Column({})
	image?: string;

	@Column({ name: 'university_id' })
	universityId: string;

	@Column({ default: false, name: 'is_default' })
	isDefault: boolean;

	@Column()
	index: number;

	@ManyToOne(() => University, (aa) => aa.id)
	@JoinColumn({ name: 'university_id' })
	university?: University;

	@OneToMany(() => Semester, (s) => s.branch, { lazy: true })
	semesters?: Promise<Semester[]>;

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
		this.universityId = '';
		this.index = 0;
		this.isDefault = true;
		this.deleted = false;
	}
}
