import { BaseDto } from './base.dto';

export class CollegeDto extends BaseDto {}

export class CollegeMapper {
	id: string;
	name: string;
	email: string;
	logo: string;
	noOfUsers: number;
	productType: string;
	universityId: string;
	status: string;
	fromDate: string;
	toDate: string;

	constructor() {
		this.id = '';
		this.name = '';
		this.email = '';
		this.logo = '';
		this.noOfUsers = 0;
		this.productType = '';
		this.universityId = '';
		this.status = '';
		this.fromDate = '';
		this.toDate = '';
	}
}

export class CollegeViewMapper extends CollegeMapper {
	email: string;
	phoneNumber: string;
	mobileNumber: string;

	constructor() {
		super();
		this.email = '';
		this.phoneNumber = '';
		this.mobileNumber = '';
	}
}

export class CollegeAddressMapper {
	id: string;
	address1: string;
	address2: string;
	state: string;
	country: string;
	city: string;
	landMark: string;
	zipCode: string;

	constructor() {
		this.id = '';
		this.address1 = '';
		this.address2 = '';
		this.state = '';
		this.city = '';
		this.country = '';
		this.landMark = '';
		this.zipCode = '';
	}
}

export class SectionMapper {
	id: string;
	name: string;
	isDefault: boolean;
	collegeBranchId: string;

	constructor() {
		this.id = '';
		this.name = '';
		this.isDefault = true;
		this.collegeBranchId = '-1';
	}
}

export class CollegeBranchesMapper {
	branchId: string;
	name: string;
	image: string;
	isDefault: boolean;
	collegeBranchId: string;

	constructor() {
		this.branchId = '';
		this.name = '';
		this.isDefault = true;
		this.image = '';
		this.collegeBranchId = '';
	}
}

export class UserGradeMapper {
	schoolId: string;
	gradeId: string;
	sectionId: string;
	subjectId: string;
	userId: string;

	constructor() {
		this.schoolId = '';
		this.gradeId = '';
		this.sectionId = '';
		this.subjectId = '';
		this.userId = '';
	}
}

export class SubjectGradeMapper {
	id: string;
	name: string;
	gradeId: string;
	schoolGradeId: string;

	constructor() {
		this.id = '';
		this.name = '';
		this.gradeId = '';
		this.schoolGradeId = '';
	}
}
