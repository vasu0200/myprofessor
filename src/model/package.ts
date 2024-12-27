import SystemHelper from '@Helpers/system-helpers';
import { Entity, Column, CreateDateColumn, UpdateDateColumn, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Branch } from './branch';
import { University } from './university';

@Entity({ name: 'packages' })
export class Package {
	@PrimaryColumn({})
	id: string;

	@Column({})
	name: string;

	@Column({ name: 'university_id' })
	universityId: string;

	@Column({ name: 'branch_id' })
	branchId: string;

	@Column({ type: 'tinyint', default: true })
	active: boolean;

	@Column()
	cost: number;

	@Column()
	duration: number;

	@Column('varchar', { nullable: true, array: true, name: 'semesters' })
	semesters: string;

	@Column({ name: 'academic_year' })
	academicYear: number;

	@Column({ name: 'academic_month' })
	academicMonth: number;

	@Column({ name: 'to_year' })
	toYear: number;

	@Column({ name: 'to_month' })
	toMonth: number;

	@Column({})
	key: string;

	@ManyToOne(() => University, (university) => university.id)
	@JoinColumn({ name: 'university_id' })
	university?: University;

	@ManyToOne(() => Branch, (branch) => branch.id)
	@JoinColumn({ name: 'branch_id' })
	branch?: Branch;

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

	semestersInfo?: string[];

	constructor() {
		this.id = SystemHelper.getUUID();
		this.createdBy = '';
		this.name = '';
		this.universityId = '';
		this.branchId = '';
		this.active = true;
		this.cost = 0;
		this.duration = 0;
		this.academicYear = 0;
		this.academicMonth = 0;
		this.toYear = 0;
		this.toMonth = 0;
		this.key = '';
		this.deleted = false;
		this.semesters = '';
	}
}
