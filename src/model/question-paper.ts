import { Entity, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany, PrimaryColumn } from 'typeorm';
import { QuestionPaperType } from '@Models/question-paper-type';
import { PreviousQuestion } from '@Models/previous-question';
import SystemHelper from '@Helpers/system-helpers';
import { PreviousQuestionPaperTestType } from '@Utility/enum';

@Entity({ name: 'question_papers' })
export class QuestionPaper {
	@PrimaryColumn({})
	id: string;

	@Column({ name: 'question_paper_type_id' })
	questionPaperTypeId: string;

	@Column({ name: 'paper_code' })
	paperCode: string;

	@Column({})
	title: string;

	@Column({ name: 'file_location' })
	fileLocation?: string;

	@Column({})
	month: string;

	@Column({})
	year: string;

	@Column({ type: 'enum', enum: PreviousQuestionPaperTestType, name: 'question_paper_test_type' })
	questionPaperTestType?: string;

	@Column({})
	active: number;

	@Column({ name: 'created_by' })
	createdBy: string;

	@CreateDateColumn({ name: 'created_at' })
	createdAt?: Date;

	@Column({ nullable: false, name: 'updated_by' })
	updatedBy?: string;

	@UpdateDateColumn({ name: 'updated_at' })
	updateAt?: Date;

	@ManyToOne(() => QuestionPaperType, (qpt) => qpt.id)
	@JoinColumn({ name: 'question_paper_type_id' })
	questionPaperType?: QuestionPaperType;

	@OneToMany(() => PreviousQuestion, (pq) => pq.questionPapers, { lazy: true })
	previousQuestions?: Promise<PreviousQuestion[]>;

	@Column({ type: 'tinyint' })
	deleted: boolean;

	constructor() {
		this.id = SystemHelper.getUUID();
		this.questionPaperTypeId = '';
		this.questionPaperTestType = PreviousQuestionPaperTestType.Objective;
		this.title = '-1';
		this.paperCode = '-1';
		this.month = '-1';
		this.year = '-1';
		this.active = 0;
		this.createdBy = '-1';
		this.updatedBy = '-1';
		this.deleted = false;
	}
}
