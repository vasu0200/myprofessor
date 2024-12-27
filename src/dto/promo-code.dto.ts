import { BaseDto } from './base.dto';

export class PromoCodeDto extends BaseDto {}

export class PromoCodeMapper {
	id: string;
	promoCode: string;
	validFrom: Date;
	validTo: Date;
	noOfAllowedUsers: number;
	discount: number;
	maxDiscountAmount: number;
	promoCodeType: string;

	constructor() {
		this.id = '';
		this.promoCode = '';
		this.validFrom = new Date();
		this.validTo = new Date();
		this.noOfAllowedUsers = 0;
		this.discount = 0;
		this.maxDiscountAmount = 0;
		this.promoCodeType = '';
	}
}
