import SystemHelper from '@Helpers/system-helpers';
import { Entity, Column, CreateDateColumn, UpdateDateColumn, PrimaryColumn, ManyToOne, JoinColumn, OneToOne } from 'typeorm';
import { College } from './college';
import { Role } from './role';
import { University } from './university';
import { User } from './user';

@Entity({ name: 'user_roles' })
export class UserRole {
	@PrimaryColumn({})
	id: string;

	@Column({ name: 'user_id' })
	userId: string;

	@Column({ name: 'role_id' })
	roleId: string;

	@Column({ name: 'university_id' })
	universityId: string;

	@Column({ name: 'college_id' })
	collegeId: string;

	@ManyToOne(() => Role, (r) => r.id, { lazy: true })
	@JoinColumn({ name: 'role_id' })
	role?: Role;

	@ManyToOne(() => University, (b) => b.id)
	@JoinColumn({ name: 'university_id' })
	university?: University;

	@OneToOne(() => User, (u) => u.id)
	@JoinColumn({ name: 'user_id' })
	user?: User;

	@ManyToOne(() => College, (s) => s.id)
	@JoinColumn({ name: 'college_id' })
	college?: College;

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
		this.deleted = false;
		this.roleId = '';
		this.universityId = '';
		this.collegeId = '';
	}
}
