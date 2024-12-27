import SystemHelper from '@Helpers/system-helpers';
import { Entity, Column, CreateDateColumn, UpdateDateColumn, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { LiveClass } from './live-class';
import { LiveClassQuestion } from './live-class-question';
import { User } from './user';

@Entity({ name: 'live_class_question_feedbacks' })
export class LiveClassQuestionFeedback {
	@PrimaryColumn({})
	id: string;

	@Column({ name: 'live_class_question_id' })
	liveClassQuestionId: string;

	@Column()
	feedback: string;

	@Column({ name: 'user_id' })
	userId: string;

	@ManyToOne(() => LiveClass, (lc) => lc.id)
	@JoinColumn({ name: 'live_class_id' })
	liveClass?: LiveClass;

	@ManyToOne(() => LiveClassQuestion, (lcq) => lcq.id)
	@JoinColumn({ name: 'live_class_question_id' })
	liveClassQuestion?: LiveClassQuestion;

	@ManyToOne(() => User, (u) => u.id)
	@JoinColumn({ name: 'user_id' })
	user?: User;

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
		this.liveClassQuestionId = '';
		this.feedback = '';
		this.userId = '';
		this.deleted = false;
	}
}
