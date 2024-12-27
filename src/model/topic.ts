import SystemHelper from '@Helpers/system-helpers';
import { Entity, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, PrimaryColumn } from 'typeorm';
import { Chapter } from './chapter';
import { UniversalTopic } from './universal-topic';
import { TargetSourceType } from '@Utility/enum';

@Entity({ name: 'topics' })
export class Topic {
	@PrimaryColumn({})
	id: string;

	@Column({})
	name: string;

	@Column({})
	description: string;

	@Column({})
	code: string;

	@Column({})
	image?: string;

	@Column({})
	idx: number;

	@Column({ name: 'chapter_id' })
	chapterId: string;

	@Column({ name: 'universal_topic_Id' })
	universalTopicId: string;

	@Column({ default: false, name: 'is_default' })
	isDefault: boolean;

	@Column({ name: 'target_source' })
	targetSource: TargetSourceType;

	@ManyToOne(() => Chapter, (c) => c.id)
	@JoinColumn({ name: 'chapter_id' })
	chapter?: Chapter;

	@ManyToOne(() => UniversalTopic, (ut) => ut.id)
	@JoinColumn({ name: 'universal_topic_Id' })
	universalTopic?: UniversalTopic;

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
		this.name = '';
		this.description = '';
		this.code = '';
		this.idx = -1;
		this.chapterId = '';
		this.universalTopicId = '';
		this.deleted = false;
		this.isDefault = true;
		this.targetSource = TargetSourceType.Admin;
	}
}
