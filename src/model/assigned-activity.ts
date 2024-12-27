import SystemHelper from '@Helpers/system-helpers';
import { TargetSourceType } from '@Utility/enum';
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn, UpdateDateColumn } from 'typeorm';
import { Activity } from './activity';
import { ActivityInfo } from './activity-info';
import { Section } from './section';
import { Topic } from './topic';
import { UniversalTopic } from './universal-topic';

@Entity({ name: 'assigned_activities' })
export class AssignedActivity {
	@PrimaryColumn({})
	id: string;

	@Column({ name: 'activity_id' })
	activityId: string;

	@Column({})
	name: string;

	@Column({})
	seq?: number;

	@Column({ name: 'topic_id' })
	topicId: string;

	@Column({ name: 'universal_topic_id' })
	universalTopicId: string;

	@Column({ name: 'section_id' })
	sectionId?: string;

	@Column({ name: 'resource_type' })
	resourceType: string;

	@ManyToOne(() => Activity, (a) => a.id)
	@JoinColumn({ name: 'activity_id' })
	activity?: Activity;

	@ManyToOne(() => Topic, (t) => t.id)
	@JoinColumn({ name: 'topic_id' })
	topic?: Topic;

	@ManyToOne(() => UniversalTopic, (ut) => ut.id)
	@JoinColumn({ name: 'universal_topic_id' })
	universalTopic?: UniversalTopic;

	@ManyToOne(() => Section, (s) => s.id)
	@JoinColumn({ name: 'section_id' })
	section?: Section;

	@OneToMany(() => ActivityInfo, (t) => t.assignedActivity, { lazy: true }) // lazy for only parent table
	activityInfo?: Promise<ActivityInfo[]>;

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
		this.name = '';
		this.createdBy = '';
		this.topicId = '';
		this.activityId = '';
		this.deleted = false;
		this.universalTopicId = '';
		this.resourceType = TargetSourceType.Admin;
	}
}

export class AssignedActivityInfoByUniversalTopic {
	id: string;
	name: string;
	universalTopicId: string;
	seq: number;
	activityId: string;
	faIcon: string;

	constructor() {
		this.id = '';
		this.name = '';
		this.seq = 0;
		this.universalTopicId = '';
		this.activityId = '';
		this.faIcon = '';
	}
}
