import SystemHelper from '@Helpers/system-helpers';
import { UserScheduleType } from '@Utility/enum';
import { Entity, Column, CreateDateColumn, UpdateDateColumn, PrimaryColumn } from 'typeorm';

@Entity({ name: 'user_schedules' })
export class UserSchedule {
	@PrimaryColumn({})
	id: string;

	@Column({ name: 'user_id' })
	userId: string;

	@Column({ name: 'schedule_type' })
	scheduleType: string;

	@Column({ name: 'schedule_type_id' })
	scheduleTypeId: string;

	@Column({ name: 'schedule_date' })
	scheduleDate: Date;

	@Column({ name: 'additional_info' })
	additionalInfo?: string;

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
		this.scheduleType = UserScheduleType.Topic;
		this.scheduleTypeId = '';
		this.deleted = false;
		this.userId = '';
		this.scheduleDate = new Date();
	}
}
