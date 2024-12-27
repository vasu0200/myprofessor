import { Entity, Column, PrimaryColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import SystemHelper from '@Helpers/system-helpers';
import { ActivityStatus, QuestionAnalysisType } from '@Utility/enum';

@Entity({ name: 'user_test_questions' })
export class UserTestQuestion {
	@PrimaryColumn({})
	id: string;

	@Column({ name: 'user_test_id' })
	userTestId: string;

	@Column({ name: 'question_id' })
	questionId: string;

	@Column({})
	status: string;

	@Column({ name: 'index' })
	index: number;

	@Column({ name: 'correct_answer' })
	correctAnswer: string;

	@Column({ name: 'user_answer' })
	userAnswer: string;

	@Column({ name: 'actual_duration' })
	actualDuration: number;

	@Column({ name: 'time_taken' })
	timeTaken: number;

	@Column({ name: 'mark_allocation' })
	markAllocation: number;

	@Column({})
	score: number;

	@Column({})
	analysis: string;

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
		this.userTestId = '';
		this.analysis = QuestionAnalysisType.UnAnswered;
		this.questionId = '';
		this.actualDuration = 0;
		this.timeTaken = 0;
		this.score = 0;
		this.index = 0;
		this.correctAnswer = '';
		this.userAnswer = '';
		this.markAllocation = 0;
		this.status = ActivityStatus.NotStarted;
	}
}
