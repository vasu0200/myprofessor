import SystemHelper from '@Helpers/system-helpers';
import { Entity, Column,  CreateDateColumn, UpdateDateColumn, PrimaryColumn } from 'typeorm';

@Entity({ name: 'address' })
export class Address {
	@PrimaryColumn({})
	id: string;

	@Column({})
	address1: string;

	@Column({})
	address2: string;

	@Column({})
	city: string;

	@Column({ nullable: true })
	state: string;

	@Column({ nullable: true })
	country?: string;

	@Column({ nullable: true, name: 'land_mark' })
	landMark?: string;

	@Column({ nullable: true, name: 'zip_code' })
	zipCode?: string;

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
		this.address1 = '';
		this.address2 = '';
		this.city = '';
		this.state = '';
		this.country = '';
		this.deleted = false;
	}
}
