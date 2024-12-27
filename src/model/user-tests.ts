import { Entity, Column, PrimaryColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import SystemHelper from '@Helpers/system-helpers';
import { AssignedActivity } from './assigned-activity';
import { ActivityStatus, DiffLevel, TestAnalysisType, UserTestType } from '@Utility/enum';

@Entity({ name: 'user_tests' })
export class UserTest {
	@PrimaryColumn({})
	id: string;

	@Column({ name: 'user_id' })
	userId: string;

	@Column({ name: 'subject_id' })
	subjectId: string;

	@Column({ name: 'chapter_id' })
	chapterId: string;

	@Column({ name: 'topic_id' })
	topicId: string;

	@Column({ name: 'assigned_activity_id' })
	assignedActivityId: string;

	@Column({ name: 'activity_dim_id' })
	activityDimId: string;

	@Column({ name: 'previous_question_paper_id' })
	previousQuestionPaperId: string;

	@Column({ name: 'time_taken' })
	timeTaken: number;

	@Column({ name: 'actual_duration' })
	actualDuration: number;

	@Column({ name: 'test_type' })
	testType: string;

	@Column({})
	status: string;

	@Column({})
	score: number;

	@Column({})
	analysis: string;

	@ManyToOne(() => AssignedActivity, (aa) => aa.id)
	@JoinColumn({ name: 'assigned_activity_id' })
	assignedActivity?: AssignedActivity;

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
		this.assignedActivityId = '';
		this.activityDimId = '';
		this.userId = '';
		this.chapterId = '';
		this.subjectId = '';
		this.topicId = '';
		this.analysis = TestAnalysisType.Poor;
		this.actualDuration = 0;
		this.timeTaken = 0;
		this.score = 0;
		this.testType = UserTestType.Topic;
		this.status = ActivityStatus.NotStarted;
		this.previousQuestionPaperId = '';
	}
}

export class QuestionAndOptions {
	question: string;
	questionId: string;
	options: [{ key: string; value: String }];
	marks: number;
	diffLevel: DiffLevel;
	timeInSec: number;

	constructor() {
		this.question = '';
		this.questionId = '';
		this.options = [{ key: '', value: '' }];
		this.marks = -1;
		this.diffLevel = DiffLevel.Easy;
		this.timeInSec = 0;
	}
}
