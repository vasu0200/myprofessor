import SystemHelper from '@Helpers/system-helpers';
import { ImportStatusType, ImportType } from '@Utility/enum';
import { Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'imports' })
export class ImportEntity {
	@PrimaryColumn({})
	id: string;

	@Column({ name: 'user_id' })
	userId: string;

	@Column({ name: 'university_id' })
	universityId: string;

	@Column({ name: 'college_id' })
	collegeId: string;

	@Column({ name: 'input_file_url' })
	inputFileUrl: string;

	@Column({ name: 'response_file_url' })
	responseFileUrl: string;

	@Column({ name: 'type' })
	type: ImportType;

	@Column({ name: 'status' })
	status: ImportStatusType;

	@Column({ name: 'total_records' })
	totalRecords: number;

	@Column({ name: 'successful_records' })
	successfulRecords: number;

	@Column({ name: 'failed_records' })
	failedRecords: number;

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
		this.deleted = false;
		this.userId = '';
		this.inputFileUrl = '';
		this.responseFileUrl = '';
		this.universityId = '';
		this.collegeId = '';
		this.type = ImportType.Professor;
		this.status = ImportStatusType.NotStarted;
		this.totalRecords = 0;
		this.successfulRecords = 0;
		this.failedRecords = 0;
	}
}
