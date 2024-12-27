import { BaseDto } from './base.dto';

export class RazorpayDto extends BaseDto {}

export class RazorpayOrderMapper {
	orderId: string;
	userId: string;
	amount: string;
	currency: string;

	constructor() {
		this.orderId = '';
		this.userId = '';
		this.amount = '';
		this.currency = '';
	}
}
