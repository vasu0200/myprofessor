import SystemHelper from '@Helpers/system-helpers';
import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryColumn, UpdateDateColumn } from 'typeorm';
import { UserStatusType } from '../utility/enum';
import { Address } from './address';

@Entity({ name: 'users' })
export class User {
	@PrimaryColumn({})
	id: string;

	@Column({ name: 'first_name' })
	firstName?: string;

	@Column({ name: 'last_name' })
	lastName?: string;

	@Column({ name: 'middle_name' })
	middleName?: string;

	@Column({ comment: 'PII' })
	email: string;

	@Column({ nullable: true, name: 'mobile_number' })
	mobileNumber: string;

	@Column({ type: 'enum', enum: UserStatusType, name: 'account_status' })
	accountStatus?: UserStatusType;

	@Column({})
	gender?: string;

	@Column({ nullable: true })
	dob?: Date;

	@Column({ nullable: true, name: 'profile_pic' })
	profilePic?: string;

	@Column({ name: 'address_id' })
	addressId?: string;

	@OneToOne(() => Address, (a) => a.id, { lazy: true })
	@JoinColumn({ name: 'address_id' })
	address?: Promise<Address>;

	@Column({ name: 'p1_first_name' })
	p1FirstName?: string;

	@Column({ name: 'p1_last_name' })
	p1LastName?: string;

	@Column({ name: 'p1_email' })
	p1Email?: string;

	@Column({ name: 'p2_first_name' })
	p2FirstName?: string;

	@Column({ name: 'p2_last_name' })
	p2LastName?: string;

	@Column({ name: 'p2_email' })
	p2Email?: string;

	@Column({ name: 'invite_code' })
	inviteCode?: string;

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

	constructor() {
		this.id = SystemHelper.getUUID();
		this.email = '';
		this.mobileNumber = '';
		this.createdBy = '';
		this.accountStatus = UserStatusType.RegistrationInProgress;
		this.deleted = false;
	}
}

export class JwtPayload {
	userId: string;
	universityId: string;
	branchId: string;
	collegeId?: string;
	roleId: string;
	roleName: string;

	constructor() {
		this.userId = '';
		this.universityId = '';
		this.branchId = '';
		this.roleId = '';
		this.roleName = '';
	}
}
