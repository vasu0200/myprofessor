import { BaseDto } from './base.dto';

export class BranchDto extends BaseDto {}

export class BranchMapper {
	id: string;
	name: string;
	image: string;
	universityId: string;
	isDefault: boolean;
	index: number;

	constructor() {
		this.id = '';
		this.name = '';
		this.image = '';
		this.universityId = '';
		this.isDefault = true;
		this.index = 0;
	}
}

export class TeacherBranchMapper {
	id: string;
	name: string;
	image: string;
	universityId: string;
	sectionId: string;
	sectionName: string;
	isDefault: boolean;
	index: number;
	subjectsCount: number;
	chaptersCount: number;
	topicsCount: number;

	constructor() {
		this.id = '';
		this.name = '';
		this.image = '';
		this.universityId = '';
		this.sectionId = '';
		this.sectionName = '';
		this.isDefault = true;
		this.index = 0;
		this.subjectsCount = 0;
		this.chaptersCount = 0;
		this.topicsCount = 0;
	}
}

export class BranchSectionMapper {
	id: string;
	BranchId: string;
	BranchName: string;
	sectionId: string;
	sectionName: string;

	constructor() {
		this.id = '';
		this.BranchId = '';
		this.BranchName = '';
		this.sectionId = '';
		this.sectionName = '';
	}
}
