import SystemHelper from '@Helpers/system-helpers';
import { Entity, Column, CreateDateColumn, UpdateDateColumn, OneToMany, PrimaryColumn } from 'typeorm';
import { Branch } from './branch';
import { College } from './college';

@Entity({ name: 'universities' })
export class University {
	@PrimaryColumn({})
	id: string;

	@Column({})
	name: string;

	@Column({})
	description: string;

	@Column({})
	image?: string;

	@OneToMany(() => Branch, (b) => b.universityId, { lazy: true })
	branches?: Promise<Branch[]>;

	@OneToMany(() => College, (c) => c.universityId, { lazy: true })
	colleges?: Promise<College[]>;

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
		this.name = '';
		this.description = '';
		this.deleted = false;
	}
}
