import SystemHelper from '@Helpers/system-helpers';
import { PreviousQuestion } from '@Models/previous-question';
import { Entity, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, PrimaryColumn } from 'typeorm';

@Entity({ name: 'previous_options' })
export class PreviousOption {
	@PrimaryColumn({})
	id: string;

	@Column({ name: 'question_id' })
	questionId: string;

	@ManyToOne(() => PreviousQuestion, (pq) => pq.id)
	@JoinColumn({ name: 'question_id' })
	previousQuestions?: PreviousQuestion;

	@Column({})
	key: string;

	@Column({})
	value: string;

	@Column({ nullable: true, name: 'created_by' })
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
		this.questionId = '';
		this.key = '-1';
		this.value = '-1';
		this.createdBy = '-1';
		this.updatedBy = '-1';
		this.deleted = false;
	}
}
