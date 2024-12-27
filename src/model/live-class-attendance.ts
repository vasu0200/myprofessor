import SystemHelper from '@Helpers/system-helpers';
import { AttendeesRegisterType } from '@Utility/enum';
import { Entity, Column, CreateDateColumn, UpdateDateColumn, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { LiveClass } from './live-class';
import { User } from './user';

@Entity({ name: 'live_class_attendances' })
export class LiveClassAttendance {
	@PrimaryColumn({})
	id: string;

	@Column({ name: 'live_class_id' })
	liveClassId: string;

	@Column({ name: 'user_id' })
	userId: string;

	@Column({ enum: AttendeesRegisterType, default: AttendeesRegisterType.Login })
	type: string;

	@Column({ type: 'timestamp' })
	time: string;

	@ManyToOne(() => LiveClass, (lc) => lc.id)
	@JoinColumn({ name: 'live_class_id' })
	liveClass?: LiveClass;

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
		this.liveClassId = '';
		this.userId = '';
		this.type = '';
		this.time = '';
		this.deleted = false;
	}
}
