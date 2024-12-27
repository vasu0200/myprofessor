import { BaseDto } from './base.dto';

export class AnnouncementDto extends BaseDto {}

export class AnnouncementMapper {
	id: string;
	title: string;
	description: string;
	fromDate: string;
	toDate: string;
	branches: string;
	branchNames: string;
	sections: string;
	sectionNames: string;
	semesters: string;
	semesterNames: string;

	constructor() {
		this.id = '';
		this.title = '';
		this.description = '';
		this.fromDate = '';
		this.toDate = '';
		this.branches = '';
		this.branchNames = '';
		this.sections = '';
		this.sectionNames = '';
		this.semesters = '';
		this.semesterNames = '';
	}
}
