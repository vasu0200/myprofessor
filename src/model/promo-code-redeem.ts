import SystemHelper from '@Helpers/system-helpers';
import { PromoCodeRedeemStatus } from '@Utility/enum';
import { Entity, Column, CreateDateColumn, UpdateDateColumn, PrimaryColumn } from 'typeorm';

@Entity({ name: 'promo_code_redeems' })
export class PromoCodeRedeem {
	@PrimaryColumn({})
	id: string;

	@Column({ name: 'user_id' })
	userId: string;

	@Column({ name: 'promo_code_id' })
	promoCodeId: string;

	@Column({ name: 'promo_code' })
	promoCode: string;

	@Column({ enum: PromoCodeRedeemStatus })
	status: string;

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
		this.promoCodeId = '';
		this.promoCode = '';
		this.status = PromoCodeRedeemStatus.Pending;
		this.deleted = false;
	}
}
