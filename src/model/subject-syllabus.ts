import SystemHelper from '@Helpers/system-helpers';
import { Entity, Column, CreateDateColumn, UpdateDateColumn, PrimaryColumn } from 'typeorm';

@Entity({ name: 'subject_syllabus' })
export class SubjectSyllabus {
	@PrimaryColumn({})
	id: string;

	@Column({})
	description: string;

	@Column({})
	idx: number;

	@Column({ name: 'university_id' })
	universityId: string;

	@Column({ name: 'branch_id' })
	branchId: string;

	@Column({ name: 'subject_id' })
	subjectId: string;

	@Column({ name: 'chapter_id' })
	chapterId: string;

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
		this.description = '';
		this.idx = -1;
		this.universityId = '';
		this.branchId = '';
		this.subjectId = '';
		this.chapterId = '';
		this.createdBy = '-1';
		this.deleted = false;
	}
}
