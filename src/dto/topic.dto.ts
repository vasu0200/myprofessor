import { BaseDto } from './base.dto';

export class TopicDto extends BaseDto {}

export class TopicMapper {
	id: string;
	name: string;
	description: string;
	image: string;
	idx: number;
	code: string;
	chapterId: string;
	universalTopicId: string;
	targetSource: string;

	constructor() {
		this.id = '';
		this.name = '';
		this.image = '';
		this.description = '';
		this.idx = 0;
		this.chapterId = '';
		this.universalTopicId = '';
		this.code = '';
		this.targetSource = '';
	}
}

export class TeacherTopicMapper {
	id: string;
	name: string;
	description: string;
	image: string;
	idx: number;
	code: string;
	chapterId: string;
	universalTopicId: string;
	topicsCount: number;

	constructor() {
		this.id = '';
		this.name = '';
		this.image = '';
		this.description = '';
		this.idx = 0;
		this.chapterId = '';
		this.universalTopicId = '';
		this.code = '';
		this.topicsCount = 0;
	}
}
