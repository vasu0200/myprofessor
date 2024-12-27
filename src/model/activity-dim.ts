import SystemHelper from '@Helpers/system-helpers';
import { ActivityStatus } from '@Utility/enum';
import { Entity, Column, CreateDateColumn, UpdateDateColumn, PrimaryColumn } from 'typeorm';

@Entity({ name: 'activity_dim' })
export class ActivityDim {
	@PrimaryColumn({})
	id: string;

	@Column({ name: 'activity_id' })
	activityId?: string; // assignedActivityId

	@Column({})
	status: string;

	@Column({ name: 'activity_type' })
	activityType: string;

	@Column({ name: 'video_paused_at' })
	videoPausedAt: number;

	@Column({ name: 'pdf_page_paused_at' })
	pdfPagePausedAt: number;

	@Column({ name: 'pdf_pages_read' })
	pdfPagesRead: string;

	@Column({ name: 'pre_test_score' })
	preTestScore: number;

	@Column({ name: 'post_test_score' })
	postTestScore: number;

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
		this.deleted = false;
		this.status = ActivityStatus.NotStarted;
		this.pdfPagePausedAt = -1;
		this.videoPausedAt = -1;
		this.preTestScore = -1;
		this.postTestScore = -1;
		this.activityType = '';
		this.pdfPagesRead = '';
	}
}
