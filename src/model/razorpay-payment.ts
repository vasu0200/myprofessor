import SystemHelper from '@Helpers/system-helpers';
import { PaymentRequestType } from '@Utility/enum';
import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity({ name: 'razorpay_payments' })
export class RazorpayPayment {
	@PrimaryColumn({})
	id: string;

	@Column({ name: 'user_id' })
	userId: string;

	@Column({ name: 'order_id' })
	orderId: string;

	@Column({ name: 'payment_id' })
	paymentId: string;

	@Column({ name: 'request_type' })
	requestType: string;

	@Column({ name: 'request_type_id' })
	requestTypeId: string;

	@Column({})
	amount?: number;

	@Column({})
	status: string;

	@Column({ name: 'invoice_id' })
	invoiceId?: string;

	@Column({})
	method: string;

	@Column({ name: 'refund_status' })
	refundStatus?: string;

	@Column({ nullable: true })
	fee?: number;

	@Column({ nullable: true })
	tax?: number;

	@Column()
	international?: boolean;

	@Column({ type: 'tinyint' })
	deleted: boolean;

	constructor() {
		this.id = SystemHelper.getUUID();
		this.userId = '';
		this.orderId = '';
		this.paymentId = '';
		this.method = '';
		this.status = '';
		this.requestType = PaymentRequestType.Subscription;
		this.requestTypeId = '';
		this.deleted = false;
	}
}
