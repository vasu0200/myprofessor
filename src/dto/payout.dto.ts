import { BaseDto } from './base.dto';

export class PayoutDto extends BaseDto {}

export class UserFundAccountMapper {
	id: string;
	userId: string;
	contactId: string;
	fundAccountId: string;
	accountType: string;
	ifsc: string;
	bankName: string;
	name: string;
	accountNumber: string;
	vpaAddress: string;
	vpaUserName: string;
	vpaHandle: string;

	constructor() {
		this.id = '';
		this.contactId = '';
		this.fundAccountId = '';
		this.accountType = '';
		this.ifsc = '';
		this.bankName = '';
		this.userId = '';
		this.name = '';
		this.accountNumber = '';
		this.vpaAddress = '';
		this.vpaUserName = '';
		this.vpaHandle = '';
	}
}
