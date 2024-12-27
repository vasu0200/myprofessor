import { BaseDto } from './base.dto';

export class SemesterDto extends BaseDto {}

export class SemesterMapper {
	id: string;
	name: string;
	image: string;
	branchId: string;
	isDefault: boolean;
	index: number;

	constructor() {
		this.id = '';
		this.name = '';
		this.image = '';
		this.branchId = '';
		this.isDefault = true;
		this.index = 0;
	}
}
