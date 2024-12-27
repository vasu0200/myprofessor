import { BaseDto } from './base.dto';
export class BannerDto extends BaseDto {}

export class BannerMapper {
	id: string;
	image: string;
	index: number;

	constructor() {
		this.id = '';
		this.image = '';
		this.index = 0;
	}
}
