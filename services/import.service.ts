import { ContextWrapper } from '@Helpers/molecular-helper';
import { ImportEntity } from '@Models/import';
import { ImportStatusType } from '@Utility/enum';
import { Action } from 'moleculer-decorators';
import AuthSchema from './auth';
import * as json2csv from 'json2csv';
import { BaseDao } from '@Dao/base.dao';
import SystemHelper from '@Helpers/system-helpers';
import { ImportDao } from '@Dao/import.dao';
const appConfig = require('../app-config.json');

export default class ImportService extends AuthSchema {
	public name: string = 'import';

	@Action({
		params: {
			importType: { type: 'string' },
			importData: { type: 'array' },
			fileName: { type: 'string', optional: true },
		},
	})
	public async createImport(ctx: ContextWrapper) {
		// upload importData to s3
		const inputFileUrl: string = await ctx.call('s3.upload', {
			fileData: Buffer.from(json2csv.parse(ctx.params.importData)).toString('base64'),
			fileName: `imports/colleges/${ctx.params.importType}/input_files/input_file_${
				ctx.params.fileName || ''
			}_${SystemHelper.getUUID()}.csv`.toLocaleLowerCase(),
			bucketName: appConfig.aws.bucketName,
			viewableInline: false,
			contentType: 'application/csv',
		});

		let newImport = new ImportEntity();
		newImport.type = ctx.params.importType;
		newImport.userId = ctx.meta.userId;
		newImport.status = ImportStatusType.InProgress;
		newImport.universityId = ctx.params.universityId;
		newImport.collegeId = ctx.params.collegeId;
		newImport.inputFileUrl = inputFileUrl;
		newImport.totalRecords = ctx.params.importData.length;
		newImport = await BaseDao.saveGenericResource(ctx, newImport);

		return newImport;
	}

	@Action({
		params: {
			failedRecords: { type: 'number' },
			successfulRecords: { type: 'number' },
			importId: { type: 'string' },
			responseData: { type: 'array' },
		},
		auth: {
			ignoreAuthToken: true,
		},
	})
	public async updateImport(ctx: ContextWrapper) {
		const importRecord: ImportEntity = await BaseDao.getGenericResource(ctx, ImportEntity, { where: { id: ctx.params.importId } });
		importRecord.failedRecords = ctx.params.failedRecords;
		importRecord.successfulRecords = ctx.params.successfulRecords;

		// upload importData to s3
		const responseFileUrl: string = await ctx.call('s3.upload', {
			fileData: Buffer.from(json2csv.parse(ctx.params.responseData)).toString('base64'),
			fileName: `imports/colleges/${importRecord.type}/response_files/response_file_${SystemHelper.getUUID()}.csv`.toLocaleLowerCase(),
			bucketName: appConfig.aws.bucketName,
			viewableInline: false,
			contentType: 'application/csv',
		});

		importRecord.responseFileUrl = responseFileUrl;
		importRecord.status = ImportStatusType.Completed;
		await BaseDao.saveGenericResource(ctx, importRecord);
	}

	@Action({
		params: {},
	})
	public async getUserImports(ctx: ContextWrapper) {
		return await ImportDao.getImports(ctx);
	}
}

module.exports = new ImportService();
