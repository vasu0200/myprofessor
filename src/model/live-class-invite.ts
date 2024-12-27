import SystemHelper from '@Helpers/system-helpers';
import { Entity, Column, CreateDateColumn, UpdateDateColumn, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
// import { Grade } from './grade';
import { LiveClass } from './live-class';
import { Section } from './section';

@Entity({ name: 'live_class_invites' })
export class LiveClassInvite {
	@PrimaryColumn({})
	id: string;

	@Column({ name: 'live_class_id' })
	liveClassId: string;

	@Column({ name: 'branch_id' })
	branchId: string;

	@Column({ name: 'semester_id' })
	semesterId: string;

	@Column({ name: 'section_id' })
	sectionId: string;

	@ManyToOne(() => LiveClass, (s) => s.id)
	@JoinColumn({ name: 'live_class_id' })
	liveClass?: LiveClass;

	// @ManyToOne(() => Grade, (s) => s.id)
	// @JoinColumn({ name: 'grade_id' })
	// grade?: Grade;

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
		this.createdBy = '';
		this.liveClassId = '';
		this.branchId = '';
		this.semesterId = '';
		this.sectionId = '';
		this.deleted = false;
	}
}
