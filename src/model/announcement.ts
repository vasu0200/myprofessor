import SystemHelper from '@Helpers/system-helpers';
import { Entity, Column, CreateDateColumn, UpdateDateColumn, PrimaryColumn } from 'typeorm';

@Entity({ name: 'announcements' })
export class Announcement {
	@PrimaryColumn({})
	id: string;

	@Column({})
	title: string;

	@Column({ nullable: true })
	description?: string;

	@Column({ name: 'college_id' })
	collegeId: string;

	@Column({ name: 'from_date' })
	fromDate: Date;

	@Column({ name: 'to_date' })
	toDate: Date;

	@Column('varchar', { nullable: true, array: true })
	branches: string;

	@Column('varchar', { nullable: true, array: true })
	sections?: string;

	@Column('varchar', { nullable: true, array: true })
	semesters: string;

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
		this.title = '';
		this.description = '';
		this.fromDate = new Date();
		this.toDate = new Date();
		this.branches = '';
		this.sections = '';
		this.semesters = '';
		this.createdBy = '';
		this.deleted = false;
		this.collegeId = '';
	}
}
