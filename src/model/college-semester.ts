import SystemHelper from '@Helpers/system-helpers';
import { Entity, Column, CreateDateColumn, UpdateDateColumn, PrimaryColumn } from 'typeorm';

@Entity({ name: 'college_semesters' })
export class CollegeSemester {
	@PrimaryColumn({})
	id: string;

	@Column({ name: 'college_id' })
	collegeId: string;

	@Column({ name: 'branch_id' })
	branchId: string;

	@Column({ name: 'semester_id' })
	semesterId: string;

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
    this.semesterId = '';
		this.createdBy = '-1';
		this.collegeId = '';
		this.branchId = '';
		this.deleted = false;
	}
}
