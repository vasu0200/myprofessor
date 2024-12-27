import { BaseDto } from './base.dto';

export class QuestionsTemplateDto extends BaseDto {}

export class QuestionsTemplateMapper {
	id: string;
	name: string;

	constructor() {
		this.id = '';
		this.name = '';
	}
}
