import { BaseDto } from './base.dto';

export class SubjectOverviewDto extends BaseDto {}

export class SubjectOverviewMapper {
	id: string;
	description: string;
	universityId: string;
	subjectId: string;
	branchId: string;
	subjectName: string;
	universityName: string;
	branchName: string;
	subjectImage: string;
	index: number;

	constructor() {
		this.id = '';
		this.description = '';
		this.universityId = '';
		this.subjectId = '';
		this.subjectName = '';
		this.subjectImage = '';
		this.branchId = '';
		this.universityName = '';
		this.branchName = '';
		this.index = 0;
	}
}
