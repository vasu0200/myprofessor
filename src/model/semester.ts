import SystemHelper from '@Helpers/system-helpers';
import { Entity, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany, PrimaryColumn } from 'typeorm';
import { Subject } from './subject';
import { Branch } from './branch';

@Entity({ name: 'semesters' })
export class Semester {
	@PrimaryColumn({})
	id: string;

	@Column({})
	name: string;

	@Column({})
	image?: string;

	@Column({ name: 'branch_id' })
	branchId: string;

	@Column()
	index: number;

	@Column({ default: false, name: 'is_custom' })
	isCustom: boolean;

	@ManyToOne(() => Branch, (aa) => aa.id)
	@JoinColumn({ name: 'branch_id' })
	branch?: Branch;

	@OneToMany(() => Subject, (s) => s.semester, { lazy: true })
	semesters?: Promise<Subject[]>;

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
		this.branchId = '';
		this.index = 0;
		this.deleted = false;
		this.isCustom = false;
	}
}
