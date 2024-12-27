import SystemHelper from '@Helpers/system-helpers';
import { SchoolStatusType, StepupProductType } from '@Utility/enum';
import { Entity, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToOne, OneToMany, PrimaryColumn } from 'typeorm';
import { Address } from './address';
import { CollegeBranch } from './college-branch';
import { University } from './university';

@Entity({ name: 'colleges' })
export class College {
	@PrimaryColumn({})
	id: string;

	@Column({})
	name: string;

	@Column({})
	email?: string;

	@Column({ name: 'phone_number' })
	phoneNumber?: string;

	@Column({ name: 'mobile_number' })
	mobileNumber?: string;

	@Column({})
	logo?: string;

	@Column({ name: 'university_id' })
	universityId: string;

	@Column({ name: 'product_type' })
	productType: string;

	@Column({ name: 'no_of_users' })
	noOfUsers?: number;

	@Column({ name: 'status' })
	status: string;

	@ManyToOne(() => University, (aa) => aa.id)
	@JoinColumn({ name: 'university_id' })
	university?: University;

	@Column({ name: 'address_id' })
	addressId: string;

	@OneToOne(() => Address, (a) => a.id, { lazy: true })
	@JoinColumn({ name: 'address_id' })
	address?: Promise<Address>;

	@OneToMany(() => CollegeBranch, (sg) => sg.colleges, { lazy: true })
	collegeBranches?: Promise<CollegeBranch[]>;

	@Column({ name: 'created_by' })
	createdBy: string;

	@CreateDateColumn({ name: 'created_at' })
	createdAt?: Date;

	@Column({ nullable: true, name: 'updated_by' })
	updatedBy?: string;

	@UpdateDateColumn({ name: 'updated_at' })
	updatedAt?: Date;

	@Column({ type: 'tinyint' })
	deleted: boolean;

	@Column({ name: 'from_date' })
	fromDate: Date;

	@Column({ name: 'to_date' })
	toDate: Date;

	constructor() {
		this.id = SystemHelper.getUUID();
		this.createdBy = '-1';
		this.name = '';
		this.universityId = '';
		this.addressId = '';
		this.productType = StepupProductType.FourteenDaysTrail;
		this.deleted = false;
		this.status = SchoolStatusType.Active;
		this.fromDate = new Date();
		this.toDate = new Date();
	}
}

// export class SchoolUserReturnType {
// 	userInfo: { user: UserMapper; role: UserRoleMapper; address: UserAddressMapper } | any;
// 	userRole: UserRole;
// 	userGrade: UserGradeMapper;
// 	constructor() {
// 		this.userRole = new UserRole();
// 		this.userGrade = new UserGrade();
// 	}
// }
