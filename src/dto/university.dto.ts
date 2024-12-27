import { BaseDto } from './base.dto';

export class UniversityDto extends BaseDto {}

export class UniversityMapper {
	id: string;
	name: string;
	description: string;
	image: string;
	constructor() {
		this.id = '';
		this.name = '';
		this.description = '';
		this.image = '';
	}
}
