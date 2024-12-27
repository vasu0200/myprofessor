import SystemHelper from '@Helpers/system-helpers';
import { Entity, Column, CreateDateColumn, UpdateDateColumn, PrimaryColumn } from 'typeorm';

@Entity({ name: 'subject_overview' })
export class SubjectOverview {
	@PrimaryColumn({})
	id: string;

	@Column({})
	index: number;

	@Column({})
	description: string;

	@Column({ name: 'university_id' })
	universityId: string;

	@Column({ name: 'subject_id' })
	subjectId: string;

	@Column({ name: 'branch_id' })
	branchId: string;

	@CreateDateColumn({ name: 'created_at' })
	createdAt?: Date;

	@UpdateDateColumn({ name: 'updated_at' })
	updatedAt?: Date;

	@Column({ type: 'tinyint' })
	deleted: boolean;

	@Column({ nullable: true, name: 'updated_by' })
	updatedBy?: string;

	@Column({ name: 'created_by' })
	createdBy: string;

	constructor() {
		this.id = SystemHelper.getUUID();
		this.createdBy = '-1';
		this.index = -1;
		this.description = '';
		this.subjectId = '';
		this.branchId = '';
		this.universityId = '';
		this.deleted = false;
	}
}
