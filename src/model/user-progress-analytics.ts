import SystemHelper from '@Helpers/system-helpers';
import { Entity, Column, CreateDateColumn, UpdateDateColumn, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Branch } from './branch';
import { Chapter } from './chapter';
import { College } from './college';
import { Section } from './section';
import { Semester } from './semester';
import { Subject } from './subject';
import { University } from './university';
import { User } from './user';
import { UserProgressAnalyticsType } from '@Utility/enum';

@Entity({ name: 'user_analytics_progress' })
export class UserAnalyticsProgress {
	@PrimaryColumn({})
	id: string;

	@Column({ name: 'user_id' })
	userId?: string;

	@Column({ name: 'university_id' })
	universityId: string;

	@Column({ name: 'college_id' })
	collegeId?: string;

	@Column({ name: 'branch_id' })
	branchId: string;

	@Column({ name: 'semester_id' })
	semesterId: string;

	@Column({ name: 'section_id' })
	sectionId?: string;

	@Column({ name: 'subject_id' })
	subjectId: string;

	@Column({ name: 'chapter_id' })
	chapterId: string;

	@Column({ name: 'topic_id' })
	topicId: string;

	@Column({ name: 'progress_type' })
	progressType: UserProgressAnalyticsType;

	@Column({ name: 'progress' })
	progress: number;

	@ManyToOne(() => University, (b) => b.id)
	@JoinColumn({ name: 'university_id' })
	university?: University;

	@ManyToOne(() => Branch, (s) => s.id)
	@JoinColumn({ name: 'branch_id' })
	branch?: Branch;

	@ManyToOne(() => Section, (s) => s.id)
	@JoinColumn({ name: 'section_id' })
	section?: Section;

	@ManyToOne(() => Semester, (s) => s.id)
	@JoinColumn({ name: 'semester_id' })
	semester?: Semester;

	@ManyToOne(() => College, (s) => s.id)
	@JoinColumn({ name: 'college_id' })
	college?: College;

	@ManyToOne(() => Subject, (s) => s.id)
	@JoinColumn({ name: 'subject_id' })
	subject?: Subject;

	@ManyToOne(() => Chapter, (c) => c.id)
	@JoinColumn({ name: 'chapter_id' })
	chapter?: Chapter;

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
		this.createdBy = '';
		this.deleted = false;
		this.universityId = '';
		this.branchId = '';
		this.semesterId = '';
		this.sectionId = '';
		this.subjectId = '';
		this.chapterId = '';
		this.topicId = '';
		this.progress = 0;
		this.progressType = UserProgressAnalyticsType.Topic;
	}
}


/**
 * userId
 * universityId
 * collegeId
 * subjectId
 * chapterId
 * topicId
 * progressType ('topic','chapter')
 * progress
 */
