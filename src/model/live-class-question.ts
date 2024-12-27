import SystemHelper from '@Helpers/system-helpers';
import { QuestionAnswerType } from '@Utility/enum';
import { Entity, Column, CreateDateColumn, UpdateDateColumn, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { LiveClass } from './live-class';

@Entity({ name: 'live_class_questions' })
export class LiveClassQuestion {
	@PrimaryColumn({})
	id: string;

	@Column({ name: 'live_class_id' })
	liveClassId: string;

	@Column()
	question: string;

	@Column({ name: 'answer_type', enum: QuestionAnswerType })
	answerType: string;

	@Column({ type: 'tinyint' })
	mandatory: boolean;

	@ManyToOne(() => LiveClass, (s) => s.id)
	@JoinColumn({ name: 'live_class_id' })
	liveClass?: LiveClass;

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
		this.liveClassId = '';
		this.question = '';
    this.answerType = '';
    this.mandatory = false;
		this.deleted = false;
	}
}
