import { BaseDto } from './base.dto';

export class QuestionPaperTypeDto extends BaseDto {}

export class QuestionPaperTypeMapper {
	id: string;
	title: string;
	active: number;
	isMockTest: number;
	status: number;
	image: string;
	constructor() {
		this.id = '';
		this.title = '-1';
		this.active = 0;
		this.isMockTest = 0;
		this.status = 0;
		this.image = '-1';
	}
}
