import SystemHelper from '@Helpers/system-helpers';
import { DiffLevel, QuestionType } from '@Utility/enum';
import { Entity, Column,  CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany, PrimaryColumn } from 'typeorm';
import { AssignedActivity } from './assigned-activity';
import { Option } from './option';

@Entity({ name: 'questions' })
export class Question {
	@PrimaryColumn({})
	id: string;

	@Column({ name: 'assigned_activity_id' })
	assignedActivityId: string;

	@Column({})
	question: string;

	@Column({})
	solution: string;

	@Column({})
	explanation: string; // added out of schema design

	@Column({ nullable: true })
	marks: number;

	@Column({ nullable: true, name: 'scheduler_id' })
	schedulerId?: string;

	@Column({ nullable: true, name: 'video_id' })
	videoId?: string;

	@Column({ nullable: true })
	timeinsec: number;

	@Column({ type: 'enum', enum: DiffLevel, name: 'diff_level' })
	diffLevel: string;

	@Column({ type: 'enum', enum: QuestionType, name: 'question_type' })
	questionType: string;

	@Column({ nullable: true, name: 'grade_id' })
	gradeId?: string;

	@Column({ nullable: true, name: 'topic_id' })
	topicId?: string;

	@ManyToOne(() => AssignedActivity, (aa) => aa.id)
	@JoinColumn({ name: 'assigned_activity_id' })
	assignedActivity?: AssignedActivity;

	@OneToMany(() => Option, (o) => o.question)
	options?: Option[];

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
		this.assignedActivityId = '';
		this.question = '';
		this.solution = '';
		this.explanation = '';
		this.marks = -1;
		this.timeinsec = -1;
		this.questionType = QuestionType.Remember;
		this.diffLevel = DiffLevel.Easy;
		this.deleted = false;
	}
}
