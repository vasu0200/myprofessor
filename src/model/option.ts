import SystemHelper from '@Helpers/system-helpers';
import { Entity, Column,  CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, PrimaryColumn } from 'typeorm';
import { Question } from './question';

@Entity({ name: 'options' })
export class Option {
	@PrimaryColumn({})
	id: string;

	@Column({ name: 'question_id' })
	questionId: string;

	@Column({})
	key: string;

	@Column({})
	value: string;

	@ManyToOne(() => Question, (aa) => aa.id)
	@JoinColumn({ name: 'question_id' })
	question?: Question;

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
		this.questionId = '';
		this.value = '';
		this.key = '';
		this.deleted = false;
	}
}
