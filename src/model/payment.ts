import SystemHelper from '@Helpers/system-helpers';
import { PaymentModeType, UserPaymentStatusType } from '@Utility/enum';
import { Entity, Column, CreateDateColumn, UpdateDateColumn, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';

@Entity({ name: 'payments' })
export class Payment {
	@PrimaryColumn({})
	id: string;

	@Column({ name: 'user_id' })
	userId: string;

	@Column({ name: 'package_id' })
	packageId: string;

	@Column({ name: 'package_name' })
	packageName: string;

	@Column({ name: 'package_cost', type: 'float' })
	packageCost: number;

	@Column()
	cgst: number;

	@Column()
	sgst: number;

	@Column({ name: 'promo_code_id' })
	promoCodeId: string;

	@Column({ name: 'promo_code' })
	promoCode: string;

	@Column({ name: 'promo_code_amount', type: 'float' })
	promoCodeAmount: number;

	@Column({ name: 'total_price', type: 'float' })
	totalPrice: number; // packageCost - promocodeAmount + cgst + sgst

	@Column({ name: 'payment_type' })
	paymentType: string;

	@Column({ name: 'payment_status' })
	paymentStatus: string;

	@Column({ name: 'activation_card_id', nullable: true })
	activationCardId: string;

	@Column({ name: 'activation_code', nullable: true })
	activationCode: string;

	@Column({ name: 'order_creation_id', nullable: true })
	orderCreationId: string;

	@Column({ name: 'razorpay_payment_id', nullable: true })
	razorpayPaymentId: string;

	@Column({ name: 'razorpay_order_id', nullable: true })
	razorpayOrderId: string;

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
		this.createdBy = '';
		this.userId = '';
		this.packageId = '';
		this.packageName = '';
		this.packageCost = 0;
		this.cgst = 0;
		this.sgst = 0;
		this.promoCodeId = '';
		this.promoCode = '';
		this.promoCodeAmount = 0;
		this.totalPrice = 0;
		this.paymentType = PaymentModeType.Razorpay;
		this.paymentStatus = UserPaymentStatusType.NotStarted;
		this.activationCardId = '';
		this.activationCode = '';
		this.orderCreationId = '';
		this.razorpayPaymentId = '';
		this.razorpayOrderId = '';
		this.deleted = false;
	}
}
