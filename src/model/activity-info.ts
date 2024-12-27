import SystemHelper from '@Helpers/system-helpers';
import { Entity, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, PrimaryColumn } from 'typeorm';
import { AssignedActivity } from './assigned-activity';

@Entity({ name: 'activity_info' })
export class ActivityInfo {
	@PrimaryColumn({})
	id: string;

	@Column({ name: 'assigned_activity_id' })
	assignedActivityId: string;

	@Column({})
	url?: string;

	@Column({})
	duration?: number;

	@Column({ name: 'pdf_pages' })
	pdfPages: number;

	@Column({ name: 'valid_pdf_pages' })
	validPdfPages: string;

	@Column({ nullable: true })
	status?: number;

	@ManyToOne(() => AssignedActivity, (aa) => aa.id, {})
	@JoinColumn({ name: 'assigned_activity_id' })
	assignedActivity?: AssignedActivity;

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
		this.assignedActivityId = '';
		this.deleted = false;
		this.pdfPages = 0;
		this.validPdfPages ='';
	}
}
