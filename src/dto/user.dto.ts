import { BaseDto } from './base.dto';

export class UserDto extends BaseDto {}

export class UserMapper {
	id: string;
	firstName: string;
	lastName: string;
	email: string;
	gender: string;
	dob: string;
	mobile: string;
	accountStatus: string;
	profilePic: string;

	constructor() {
		this.id = '';
		this.lastName = '';
		this.firstName = '';
		this.email = '';
		this.gender = '';
		this.dob = '';
		this.mobile = '';
		this.accountStatus = '';
		this.profilePic = '';
	}
}

export class UserAddressMapper {
	state: string;
	zipCode: string;

	constructor() {
		this.state = '';
		this.zipCode = '';
	}
}

export class UserRoleMapper {
	id: string;
	name: string;
	description: string;

	constructor() {
		this.id = '';
		this.name = '';
		this.description = '';
	}
}

export class UserSearchViewMapper extends UserMapper {
	accountStatus: string;
	state: string;
	zipCode: string;
	userType: string;
	college: string;
	branch: string;
	semester: string;
	section: string;

	constructor() {
		super();
		this.accountStatus = '';
		this.state = '';
		this.zipCode = '';
		this.userType = '';
		this.college = '';
		this.branch = '';
		this.semester = '';
		this.section = '';
	}
}

export class UserParentViewMapper extends UserMapper {
	p1FirstName: string;
	p1LastName: string;
	p1Email: string;
	p2FirstName: string;
	p2LastName: string;
	p2Email: string;

	constructor() {
		super();
		this.p1FirstName = '';
		this.p1LastName = '';
		this.p1Email = '';
		this.p2FirstName = '';
		this.p2LastName = '';
		this.p2Email = '';
	}
}
