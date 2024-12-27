import { BaseDto } from './base.dto';

export class BlogDto extends BaseDto {}

export class BlogMapper {
	id: string;
	title: string;
	description: string;
	image: string;
	idx: number;
	constructor() {
		this.id = '';
		this.title = '';
		this.image = '';
		this.description = '';
		this.idx = 0;
	}
}
