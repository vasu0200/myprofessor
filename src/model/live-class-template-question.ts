import SystemHelper from '@Helpers/system-helpers';
import {  QuestionAnswerType } from '@Utility/enum';
import { Entity, Column, CreateDateColumn, UpdateDateColumn, PrimaryColumn } from 'typeorm';

@Entity({ name: 'live_class_template_questions' })
export class LiveClassTemplateQuestion {
	@PrimaryColumn({})
	id: string;

	@Column({ name: 'questions_template_id' })
	questionsTemplateId: string;

	@Column({})
	question: string;

	@Column({ name: 'answer_type', type: 'enum', enum: QuestionAnswerType })
	answerType: string;

	@Column({ type: 'tinyint' })
	mandatory: boolean;

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
		this.questionsTemplateId = '';
		this.question = '';
		this.answerType = '';
		this.mandatory = false;
		this.deleted = false;
	}
}
