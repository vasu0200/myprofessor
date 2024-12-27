import { Entity, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany, PrimaryColumn } from 'typeorm';
import { PreviousOption } from '@Models/previous-option';
import { QuestionPaper } from '@Models/question-paper';
import SystemHelper from '@Helpers/system-helpers';

@Entity({ name: 'previous_questions' })
export class PreviousQuestion {
	@PrimaryColumn({})
	id: string;

	@Column({ name: 'question_paper_id' })
	questionPaperId: string;

	@Column({ name: 'topic_id' })
	topicId: string;

	@Column({})
	question: string;

	@Column({ name: 'correct_options' })
	correctOptions: string;

	@Column({})
	solution: string;

	@Column({})
	explanation?: string;

	@Column({})
	marks: number;

	@Column({ name: 'diff_level' })
	diffLevel: string;

	@Column({ name: 'question_type' })
	questionType: string;

	@Column({})
	idx: number;

	@ManyToOne(() => QuestionPaper, (qp) => qp.id)
	@JoinColumn({ name: 'question_paper_id' })
	questionPapers?: QuestionPaper;

	@OneToMany(() => PreviousOption, (po) => po.previousQuestions, { lazy: true })
	previousOptions?: Promise<PreviousOption[]>;

	@Column({ name: 'created_by' })
	createdBy?: string;

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
		this.questionPaperId = '';
		this.topicId = '';
		this.question = '';
		this.correctOptions = '';
		this.solution = '';
		this.marks = 0;
		this.diffLevel = '';
		this.questionType = '';
		this.idx = 0;
		this.createdBy = '-1';
		this.updatedBy = '-1';
		this.deleted = false;
	}
}
