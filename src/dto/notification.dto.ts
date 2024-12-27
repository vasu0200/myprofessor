import { BaseDto } from './base.dto';

export class NotificationDto extends BaseDto {}

export class NotificationMapper {
	id: string;
	title: string;
	body: string;
	data: string;
	type: string;
	announcementId: string;
	userId: string;
	isRead: boolean;

	constructor() {
		this.id = '';
		this.title = '';
		this.body = '';
		this.data = '';
		this.type = '';
		this.announcementId = '';
		this.userId = '';
		this.isRead = false;
	}
}
