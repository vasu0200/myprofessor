import { BaseDto } from './base.dto';

export class UserScheduleDto extends BaseDto {}

export class UserScheduleMapper {
	id: string;
	userId: string;
	scheduleType: string;
	scheduleTypeId: string;
	scheduleDate: string;
	constructor() {
		this.id = '';
		this.userId = '';
		this.scheduleType = '';
		this.scheduleTypeId = '';
		this.scheduleDate = '';
	}
}
