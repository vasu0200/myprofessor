import { BaseDto } from './base.dto';

export class UniversalSubjectDto extends BaseDto {}

export class UniversalSubjectMapper {
	id: string;
	name: string;
	description: string;
	color: string;
	image: string;
	noOfTopics: number;

	constructor() {
		this.id = '';
		this.name = '';
		this.image = '';
		this.description = '';
		this.color = '';
		this.noOfTopics = 0;
	}
}
