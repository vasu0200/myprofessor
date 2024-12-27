import SystemHelper from '@Helpers/system-helpers';
import { PromoCodeType } from '@Utility/enum';
import { Entity, Column, CreateDateColumn, UpdateDateColumn, PrimaryColumn } from 'typeorm';

@Entity({ name: 'promo_codes' })
export class PromoCode {
	@PrimaryColumn({})
	id: string;

	@Column({ name: 'promo_code' })
	promoCode: string;

	@Column({ name: 'valid_from' })
	validFrom: Date;

	@Column({ name: 'valid_to' })
	validTo: Date;

	@Column({ name: 'no_of_allowed_users' })
	noOfAllowedUsers: number;

	@Column()
	discount: number;

	@Column({ name: 'max_discount_amount' })
	maxDiscountAmount: number;

	@Column({ name: 'promo_code_type', enum: PromoCodeType })
	promoCodeType: string;

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
		this.promoCode = '';
		this.validFrom = new Date();
		this.validTo = new Date();
		this.noOfAllowedUsers = 0;
		this.discount = 0;
		this.maxDiscountAmount = 0;
		this.promoCodeType = PromoCodeType.Money;
		this.deleted = false;
	}
}
