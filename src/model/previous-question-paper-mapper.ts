import SystemHelper from '@Helpers/system-helpers';
import { PreviousQuestionPaperMapperStatus } from '@Utility/enum';
import { Entity, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, PrimaryColumn } from 'typeorm';
import { Branch } from './branch';
import { QuestionPaper } from './question-paper';
import { Subject } from './subject';
import { University } from './university';

@Entity({ name: 'previous_question_paper_mappers' })
export class PreviousQuestionPaperMapper {
	@PrimaryColumn({})
	id: string;

	@Column({ name: 'university_id' })
	universityId: string;

	@Column({ name: 'branch_id' })
	branchId: string;

	@Column({ name: 'semester_id' })
	semesterId: string;

	@Column({ name: 'subject_id' })
	subjectId: string;

	@Column({ name: 'previous_question_paper_id' })
	previousQuestionPaperId: string;

	@Column({})
	status: string;

	@ManyToOne(() => University, (b) => b.id)
	@JoinColumn({ name: 'university_id' })
	university?: University;

	@ManyToOne(() => Branch, (g) => g.id)
	@JoinColumn({ name: 'branch_id' })
	branch?: Branch;

	@ManyToOne(() => Subject, (g) => g.id)
	@JoinColumn({ name: 'subject_id' })
	subject?: Subject;

	@ManyToOne(() => QuestionPaper, (g) => g.id)
	@JoinColumn({ name: 'previous_question_paper_id' })
	previousQuestionPaper?: QuestionPaper;

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
		this.status = PreviousQuestionPaperMapperStatus.Active;
		this.universityId = '';
		this.branchId = '';
		this.subjectId = '';
		this.semesterId = '';
		this.deleted = false;
		this.previousQuestionPaperId = '';
	}
}
