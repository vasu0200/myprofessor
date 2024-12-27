import SystemHelper from '@Helpers/system-helpers';
import { Entity, Column, CreateDateColumn, UpdateDateColumn, PrimaryColumn } from 'typeorm';

@Entity({ name: 'time_dim' })
export class TimeDim {
	@PrimaryColumn({})
	id: string;

	@Column({ name: 'start_time' })
	startTime?: Date;

	@Column({ name: 'end_time' })
	endTime?: Date;

	@Column({})
	week?: string;

	@Column({})
	quarter?: string;

	@Column({})
	year?: string;

	@Column({})
	duration: number;

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
		this.duration = 0;
		this.deleted = false;
	}
}
