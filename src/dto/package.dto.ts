import { BaseDto } from './base.dto';

export class PackageDto extends BaseDto {}

export class PackageMapper {
	id: string;
	name: string;
	universityId: string;
	universityName: string;
	branchId: string;
	branchName: string;
	active: boolean;
	semesters: string;
	cost: number;
	duration: number;
	academicYear: number;
	academicMonth: number;
	toYear: number;
	toMonth: number;
	key: string;
	semestersInfo: string[];

	constructor() {
		this.id = '';
		this.name = '';
		this.universityId = '';
		this.universityName = '';
		this.branchId = '';
		this.branchName = '';
		this.active = true;
		this.cost = 0;
		this.duration = 0;
		this.academicYear = 0;
		this.academicMonth = 0;
		this.toYear = 0;
		this.toMonth = 0;
		this.key = '';
		this.semesters = '';
		this.semestersInfo = [];
	}
}

export class UserPackageMapper {
	id: string;
	packageId: string;
	universityId: string;
	branchId: string;
	packageName: string;
	promoCodeId: string;
	activationCardId: string;
	userId: string;
	subscriptionStatus: string;
	paymentStatus: string;

	constructor() {
		this.id = '';
		this.universityId = '';
		this.packageId = '';
		this.branchId = '';
		this.packageName = '';
		this.promoCodeId = '';
		this.activationCardId = '';
		this.userId = '';
		this.subscriptionStatus = '';
		this.paymentStatus = '';
	}
}
