import SystemHelper from '@Helpers/system-helpers';
import { Entity, Column, PrimaryColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'web_subjects' })
export class WebSubject {
	@PrimaryColumn({})
	id: string;

	@Column({ name: 'university_id' })
	universityId: string;

	@Column({ name: 'branch_id' })
	branchId: string;

	@Column({ name: 'subject_id' })
	subjectId: string;

	@Column({})
	index: number;

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
		this.index = -1;
		this.createdBy = '-1';
		this.universityId = '';
		this.branchId = '';
		this.subjectId = '';
		this.deleted = false;
	}
}
