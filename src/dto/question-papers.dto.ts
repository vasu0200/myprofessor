import { BaseDto } from './base.dto';

export class QuestionPapersDto extends BaseDto {}

export class QuestionPapersMapper {
	id: string;
	questionPaperTypeId: string;
	title: string;
	paperCode: string;
	month: string;
	year: string;
	active: number;

	constructor() {
		this.id = '';
		this.questionPaperTypeId = '';
		this.title = '-1';
		this.paperCode = '-1';
		this.month = '-1';
		this.year = '-1';
		this.active = 0;
	}
}
