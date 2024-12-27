import SystemHelper from "@Helpers/system-helpers";
import { Entity,Column, CreateDateColumn, UpdateDateColumn, PrimaryColumn } from "typeorm";

@Entity({ name: 'blogs' })
export class Blog {
	@PrimaryColumn({})
	id: string;

	@Column({})
	image: string;

	@Column({})
	title: string;

	@Column({})
	description: string;

	@Column({})
	idx: number;

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
    this.title = '';
    this.description = '';
    this.image = '';
    this.idx = -1;
    this.createdBy = '-1';
    this.deleted = false;
  }
}
