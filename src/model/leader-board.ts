import SystemHelper from '@Helpers/system-helpers';
import { Entity, Column, UpdateDateColumn, CreateDateColumn, PrimaryColumn } from 'typeorm';

@Entity({ name: 'leader_boards' })
export class LeaderBoard {
	@PrimaryColumn({})
	id: string;

	@Column({ name: 'user_id' })
	userId?: string;

	@Column({ name: 'university_id' })
	universityId?: string;

	@Column({ name: 'college_id' })
	collegeId?: string;

	@Column({ name: 'branch_id' })
	branchId?: string;

	@Column({ name: 'semester_id' })
	semesterId?: string;

	@Column({ name: 'points' })
	points: number;

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
		this.createdBy = '';
		this.deleted = false;
		this.points = 0;
	}
}
