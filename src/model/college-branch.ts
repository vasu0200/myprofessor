import SystemHelper from '@Helpers/system-helpers';
import { Entity, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany, PrimaryColumn } from 'typeorm';
import { Branch } from './branch';
import { College } from './college';

@Entity({ name: 'college_branches' })
export class CollegeBranch {
	@PrimaryColumn({})
	id: string;

	@Column({ name: 'college_id' })
	collegeId: string;

	@Column({ name: 'branch_id' })
	branchId: string;

	@ManyToOne(() => Branch, (g) => g.id)
	@JoinColumn({ name: 'branch_id' })
	branch?: Branch;

	@ManyToOne(() => College, (s) => s.id)
	@JoinColumn({ name: 'college_id' })
	colleges?: College;

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
		this.collegeId = '';
		this.branchId = '';
		this.deleted = false;
	}
}
