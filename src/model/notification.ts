import SystemHelper from '@Helpers/system-helpers';
import { NotificationTypeEnum } from '@Utility/enum';
import { Entity, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, PrimaryColumn } from 'typeorm';
import { Announcement } from './announcement';
import { User } from './user';

@Entity({ name: 'notifications' })
export class Notification {
	@PrimaryColumn({})
	id: string;

	@Column()
	title: string;

	@Column()
	body: string;

	@Column()
	data: string;

	@Column({ enum: NotificationTypeEnum })
	type: string;

	@Column({ name: 'announcement_id' })
	announcementId?: string;

	@Column({ name: 'user_id' })
	userId: string;

	@Column({ name: 'is_read', type: 'tinyint', default: false })
	isRead: boolean;

	@ManyToOne(() => Announcement, (a) => a.id)
	@JoinColumn({ name: 'announcement_id' })
	announcement?: Announcement;

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
		this.title = '';
		this.body = '';
		this.data = '';
		this.type = '';
		this.isRead = false;
		this.announcementId = '';
		this.userId = '';
		this.createdBy = '';
		this.deleted = false;
	}
}
