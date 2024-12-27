import SystemHelper from '@Helpers/system-helpers';
import { Entity, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, PrimaryColumn } from 'typeorm';
import { CollegeBranch } from './college-branch';

@Entity({ name: 'sections' })
export class Section {
	@PrimaryColumn({})
	id: string;

	@Column({})
	name: string;

	@Column({ name: 'is_default', type: 'tinyint' })
	isDefault: boolean;

	@Column({ name: 'college_branch_id' })
	collegeBranchId: string;

	@ManyToOne(() => CollegeBranch, (sg) => sg.id, { onDelete: 'CASCADE' })
	@JoinColumn({ name: 'college_branch_id' })
	collegeBranch?: CollegeBranch;

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
		this.isDefault = true;
		this.collegeBranchId = '';
		this.deleted = false;
	}
}
