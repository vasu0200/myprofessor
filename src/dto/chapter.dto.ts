import { BaseDto } from './base.dto';

export class ChapterDto extends BaseDto {}

export class ChapterMapper {
	id: string;
	name: string;
	description: string;
	image: string;
	idx: number;
	subjectId: number;
	targetSource: string;

	constructor() {
		this.id = '';
		this.name = '';
		this.image = '';
		this.description = '';
		this.idx = 0;
		this.subjectId = -1;
		this.targetSource = '';
	}
}

export class TeacherChapterMapper {
	id: string;
	name: string;
	description: string;
	image: string;
	idx: number;
	subjectId: number;
	topicsCount: number;

	constructor() {
		this.id = '';
		this.name = '';
		this.image = '';
		this.description = '';
		this.idx = 0;
		this.subjectId = -1;
		this.topicsCount = 0;
	}
}
