import { Entity, Column, CreateDateColumn, UpdateDateColumn, OneToMany, PrimaryColumn } from 'typeorm';
import { QuestionPaper } from '@Models/question-paper';
import SystemHelper from '@Helpers/system-helpers';

@Entity({ name: 'question_paper_types' })
export class QuestionPaperType {
	@PrimaryColumn({})
	id: string;

	@Column({})
	title: string;

	@Column({ name: 'is_mock_test' })
	isMockTest: boolean;

	@Column({})
	status: string;

	@Column({})
	image?: string;

	@Column({ name: 'created_by' })
	createdBy: string;

	@OneToMany(() => QuestionPaper, (qp) => qp.questionPaperType, { lazy: true })
	questionPapers?: Promise<QuestionPaper[]>;

	@CreateDateColumn({ name: 'created_at' })
	createdAt?: Date;

	@Column({ nullable: true, name: 'updated_by' })
	updatedBy?: string;

	@UpdateDateColumn({ name: 'updated_at' })
	updateAt?: Date;

	@Column({ type: 'tinyint' })
	deleted: boolean;

	constructor() {
		this.id = SystemHelper.getUUID();
		this.createdBy = '-1';
		this.title = '-1';
		this.isMockTest = false;
		this.status = '';
		this.updatedBy = '-1';
		this.deleted = false;
	}
}
