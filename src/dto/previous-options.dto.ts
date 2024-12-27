import { BaseDto } from './base.dto';

export class PreviousOptionsDto extends BaseDto {}

export class PreviousOptionsMapper {
	id: string;
	questionId: string;
	key: string;
	val: string;

	constructor() {
		this.id = '';
		this.questionId = '';
		this.key = '-1';
		this.val = '-1';
	}
}
