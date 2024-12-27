import SystemHelper from '@Helpers/system-helpers';
import { Entity, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, PrimaryColumn } from 'typeorm';
import { University } from './university';
import { Branch } from './branch';
import { User } from './user';
import { UserPackageStatusType, UserPaymentStatusType } from '@Utility/enum';

@Entity({ name: 'user_packages' })
export class UserPackage {
	@PrimaryColumn({})
	id: string;

	@Column({ name: 'university_id' })
	universityId: string;

	@Column({ name: 'branch_id' })
	branchId: string;

	@Column({ name: 'package_id' })
	packageId: string;

	@Column({ name: 'package_name' })
	packageName: string;

	@Column({ name: 'promo_code_id' })
	promoCodeId: string;

	@Column({ name: 'activation_card_id' })
	activationCardId: string;

	@Column({ name: 'user_id' })
	userId: string;

	@Column({ name: 'subscription_status' })
	subscriptionStatus: string;

	@Column({ name: 'payment_status' })
	paymentStatus: string;

	@Column({ name: 'payment_id' })
	paymentId: string;

	@Column({ name: 'razorpay_order_id' })
	razorpayOrderId: string;

	@Column({ name: 'total_payment_cost' })
	totalPaymentCost: number;

	@ManyToOne(() => University, (b) => b.id)
	@JoinColumn({ name: 'university_id' })
	university?: University;

	@ManyToOne(() => Branch, (b) => b.id)
	@JoinColumn({ name: 'branch_id' })
	branch?: Branch;

	@ManyToOne(() => User, (u) => u.id)
	@JoinColumn({ name: 'user_id' })
	user?: User;

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
		this.createdBy = '-1';
		this.universityId = '';
		this.branchId = '';
		this.promoCodeId = '';
		this.packageId = '';
		this.packageName = '';
		this.activationCardId = '';
		this.subscriptionStatus = UserPackageStatusType.Free;
		this.paymentStatus = UserPaymentStatusType.NotStarted;
		this.paymentId = '';
		this.razorpayOrderId = '';
		this.totalPaymentCost = -1;
		this.userId = '';
		this.deleted = false;
	}
}
