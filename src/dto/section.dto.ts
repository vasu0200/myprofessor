import { BaseDto } from './base.dto';

export class SectionDto extends BaseDto {}

export class SectionMapper {
	id: string;
	name: string;
	schoolGradeId: string;
	isDefault: boolean;

	constructor() {
		this.id = '';
		this.name = '';
		this.schoolGradeId = '';
		this.isDefault = true;
	}
}
