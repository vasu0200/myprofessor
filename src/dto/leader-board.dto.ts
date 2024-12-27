import { BaseDto } from './base.dto';

export class LeaderBoardDto extends BaseDto {}

export class LeaderBoardRuleMapper {
	id: string;
	code: string;
	description: string;
	points: number;

	constructor() {
		this.id = '';
		this.code = '';
		this.description = '';
		this.points = 0;
	}
}
