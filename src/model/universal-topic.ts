import SystemHelper from '@Helpers/system-helpers';
import { Entity, Column,  CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, PrimaryColumn } from 'typeorm';
import { College } from './college';
import { Section } from './section';
import { UniversalSubject } from './universal-subject';

@Entity({ name: 'uni_topics' })
export class UniversalTopic {
	@PrimaryColumn({})
	id: string;

	@Column({ unique: true, name: 'topic_name' })
	topicName: string;

	@Column({ name: 'topic_desc' })
	topicDesc: string;

	@Column({ name: 'topic_code' })
	topicCode?: string;

	@Column('varchar', { nullable: true, array: true, name: 'dependency_topics' })
	dependencyTopics: string[];

	@Column({ nullable: true })
	image?: string;

	@ManyToOne(() => UniversalSubject, (u) => u.id)
	@JoinColumn({ name: 'subject_id' })
	universalSubject?: UniversalSubject;

	@Column({ name: 'subject_id' })
	subjectId?: string;

	@Column({ nullable: true, name: 'college_id' })
	collegeId?: string;

	@Column({ nullable: true, name: 'section_id' })
	sectionId?: string;

	@ManyToOne(() => College, (s) => s.id)
	@JoinColumn({ name: 'college_id' })
	college?: College;

	@ManyToOne(() => Section, (s) => s.id)
	@JoinColumn({ name: 'section_id' })
	section?: Section;

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
		this.dependencyTopics = [];
		this.createdBy = '';
		this.topicName = '';
		this.topicDesc = '';
		this.subjectId = '';
		this.deleted = false;
	}
}
