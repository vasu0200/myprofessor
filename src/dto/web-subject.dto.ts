import { BaseDto } from './base.dto';

export class WebSubjectDto extends BaseDto {}

export class WebSubjectMapper {
	id: string;
	index: number;
	universityId: string;
	branchId: string;
	subjectId: string;
	subjectName: string;
	universityName: string;
	branchName: string;
	subjectImage: string;

	constructor() {
		this.id = '';
		this.index = 0;
		this.universityId = '';
		this.branchId = '';
		this.universityName = '';
		this.branchName = '';
		this.subjectId = '';
		this.subjectName = '';
		this.subjectImage = '';
	}
}
