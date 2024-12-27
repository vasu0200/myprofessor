import SystemHelper from '@Helpers/system-helpers';
import { Entity, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, PrimaryColumn } from 'typeorm';
import { University } from './university';
import { Branch } from './branch';
import { College } from './college';
import { Section } from './section';
import { Subject } from './subject';
import { User } from './user';
import { Semester } from './semester';

@Entity({ name: 'user_branches' })
export class UserBranch {
	@PrimaryColumn({})
	id: string;

	@Column({ name: 'university_id' })
	universityId: string;

	@Column({ name: 'branch_id' })
	branchId: string;

	@Column({ name: 'college_id' })
	collegeId: string;

	@Column({ name: 'semester_id' })
	semesterId: string;

	@Column({ name: 'section_id' })
	sectionId: string;

	@Column({ name: 'subject_id' })
	subjectId: string;

	@Column({ name: 'user_id' })
	userId: string;

	@ManyToOne(() => University, (b) => b.id)
	@JoinColumn({ name: 'university_id' })
	university?: University;

	@ManyToOne(() => Branch, (b) => b.id)
	@JoinColumn({ name: 'branch_id' })
	branch?: Branch;

	@ManyToOne(() => Semester, (b) => b.id)
	@JoinColumn({ name: 'college_id' })
	semester?: Semester;

	@ManyToOne(() => College, (c) => c.id)
	@JoinColumn({ name: 'college_id' })
	college?: College;

	@ManyToOne(() => Subject, (s) => s.id)
	@JoinColumn({ name: 'subject_id' })
	subject?: Subject;

	@ManyToOne(() => Section, (s) => s.id)
	@JoinColumn({ name: 'section_id' })
	section?: Section;

	@ManyToOne(() => User, (u) => u.id)
	@JoinColumn({ name: 'user_id' })
	user?: User;

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
		this.universityId = '';
		this.branchId = '';
		this.semesterId = '';
		this.subjectId = '';
		this.collegeId = '';
		this.sectionId = '';
		this.userId = '';
		this.deleted = false;
	}
}
