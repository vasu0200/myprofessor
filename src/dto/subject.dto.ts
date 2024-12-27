import { BaseDto } from './base.dto';

export class SubjectDto extends BaseDto {}

export class SubjectMapper {
	id: string;
	name: string;
	description: string;
	color: string;
	image: string;
	idx: number;
	semesterId: string;
	collegeSemesterId: string;
	isDefault: boolean;

	constructor() {
		this.id = '';
		this.name = '';
		this.image = '';
		this.description = '';
		this.color = '';
		this.idx = 0;
		this.semesterId = '';
		this.collegeSemesterId = '';
		this.isDefault = false;
	}
}

export class TeacherSubjectMapper {
	id: string;
	name: string;
	description: string;
	color: string;
	image: string;
	idx: number;
	semesterId: string;
	schoolGradeId: string;
	chaptersCount: number;
	topicsCount: number;

	constructor() {
		this.id = '';
		this.name = '';
		this.image = '';
		this.description = '';
		this.color = '';
		this.idx = 0;
		this.semesterId = '';
		this.schoolGradeId = '';
		this.chaptersCount = 0;
		this.topicsCount = 0;
	}
}
