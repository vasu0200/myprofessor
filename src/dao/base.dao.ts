import { Connection, createConnection, DeleteResult, getConnection, getConnectionManager, getManager, In, ObjectType, Repository } from 'typeorm';
import { ContextWrapper } from '@Helpers/molecular-helper';
import { Constants } from '@Utility/constants';
import { ErrorHelper } from '@Helpers/error-helper';
import { Messages } from '@Utility/Messages';
import path from 'path';
import { TypeOrmError } from '@Utility/interface';
const appConfig = require('../../app-config.json'); //es6 or es7 dosen't provide import option

export class BaseDao {
	public static async getDbConnection(): Promise<Connection> {
		const DEF_CONN_NAME: string = 'default';
		const connections: Connection[] = getConnectionManager().connections;
		const defaultConnections: Connection[] = connections.filter((el) => el.name === DEF_CONN_NAME);

		if (defaultConnections.length > 0 && defaultConnections[0].isConnected) {
			return defaultConnections[0];
		}

		Object.assign(appConfig.mysql, {
			entities: [path.resolve(__dirname, '..', 'model/*.ts')],
		});

		return await createConnection(appConfig.mysql);
	}

	public static async getRepository<E extends {}>(entityClass: ObjectType<E>): Promise<Repository<E>> {
		const connection: Connection = await this.getDbConnection();
		return connection.getRepository(entityClass);
	}

	public static async runSql(sql: string, ...params: any[]): Promise<[any]> {
		const connection: Connection = await this.getDbConnection();
		return await connection.query(sql, params);
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	public static async runSqlFindOne(sql: string, ...params: any[]): Promise<any | undefined> {
		const returnValue: [{}] = await this.runSql(sql, ...params);

		if (returnValue.length > 0) {
			return returnValue[0];
		} else {
			return undefined;
		}
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	public static async runSqlGetCount(sql: string, ...params: any[]): Promise<number> {
		const returnValue: { count: number } = await this.runSqlFindOne(sql, ...params);
		if (returnValue == undefined) {
			return 0;
		}
		return returnValue.count;
	}

	public static async saveGenericResource<E>(ctx: ContextWrapper, object: E): Promise<E> {
		try {
			const conn = await this.getDbConnection();
			object = await conn.manager.save(object);
		} catch (e) {
			const dbError = e as TypeOrmError;
			ctx.broker.logger.error(e);
			ErrorHelper.throwError(ErrorHelper.getDbExceptionErrorMessage(dbError.sqlMessage, dbError.code), 400, dbError.code, {});
		}
		return object;
	}

	public static async saveBulkGenericResources<E>(ctx: ContextWrapper, entityClass: ObjectType<E>, object: any[]) {
		try {
			const conn = await this.getDbConnection();
			await conn.manager.insert(entityClass, object);
		} catch (e) {
			const dbError = e as TypeOrmError;
			ctx.broker.logger.error(e);
			ErrorHelper.throwError(ErrorHelper.getDbExceptionErrorMessage(dbError.sqlMessage, dbError.code), 400, dbError.code, {});
		}
	}

	public static async hardDeleteResourceById<E>(ctx: ContextWrapper, entityClass: ObjectType<E>, id: string): Promise<DeleteResult> {
		let object: DeleteResult = new DeleteResult();
		try {
			const conn = await this.getDbConnection();
			object = await conn.manager.delete<E>(entityClass, { id: id });
		} catch (e) {
			const dbError = e as TypeOrmError;
			ctx.broker.logger.error(e);
			ErrorHelper.throwError(ErrorHelper.getDbExceptionErrorMessage(dbError.sqlMessage, dbError.code), 400, dbError.code, {});
		}
		return object;
	}

	public static async softDeleteResource<E extends { deleted: boolean }>(
		ctx: ContextWrapper,
		parentObject: E,
		ChildModel?: ObjectType<E>,
		options = {},
	) {
		if (ChildModel) {
			// check if child
			const childRecord: E = await this.getGenericResource(ctx, ChildModel, options);

			if (childRecord) {
				ErrorHelper.throwError(Messages.DELETE_NOT_ALLOWED, 404, Constants.SYSTEM_EXCEPTION_TYPES.DEPENDENCY_ERROR);
			}
		}

		parentObject.deleted = true;
		await this.saveGenericResource(ctx, parentObject);
	}

	public static async softDeleteResourceByIds<E>(ctx: ContextWrapper, entityClass: ObjectType<E>, ids: string[]) {
		if (!ids || !ids.length) return;

		const tableName: string = await this.getTableName(entityClass);
		let sqlStmt: string = '';
		ids.forEach((e, index) => (sqlStmt = sqlStmt + `${index == ids.length - 1 ? `'${e}'` : `'${e}',`}`));

		try {
			await this.runSql(`update ${tableName} set deleted = true where id in (${sqlStmt})`);
		} catch (e) {
			const dbError = e as TypeOrmError;
			ctx.broker.logger.error(e);
			ErrorHelper.throwError(ErrorHelper.getDbExceptionErrorMessage(dbError.sqlMessage, dbError.code), 400, dbError.code, {});
		}
	}

	public static async getTableName<E>(entityClass: ObjectType<E>): Promise<string> {
		return await getManager().getRepository(entityClass).metadata.tableName;
	}

	public static async hardDeleteResourceByIds<E>(ctx: ContextWrapper, entityClass: ObjectType<E>, ids: string[]): Promise<DeleteResult> {
		let object: DeleteResult = new DeleteResult();
		try {
			const conn = await this.getDbConnection();
			object = await conn.manager.delete<E>(entityClass, { id: In(ids) });
		} catch (e) {
			const dbError = e as TypeOrmError;
			ctx.broker.logger.error(e);
			ErrorHelper.throwError(ErrorHelper.getDbExceptionErrorMessage(dbError.sqlMessage, dbError.code), 400, dbError.code, {});
		}
		return object;
	}

	public static async getGenericResource<E>(ctx: ContextWrapper, entityClass: ObjectType<E>, options: {}): Promise<E> {
		return await this.getResourceWorker(ctx, entityClass, options);
	}

	public static async getGenericResources<E>(
		ctx: ContextWrapper,
		entityClass: ObjectType<E>,
		options: {},
		allRecords: boolean = false,
	): Promise<E[]> {
		return await this.getResourcesWorker(ctx, entityClass, options, allRecords);
	}

	public static async getCount<E extends {}>(ctx: ContextWrapper, entityClass: ObjectType<E>, options: {}): Promise<number> {
		options = this.addDefaultOptions(ctx, options);

		const repo: Repository<E> = await this.getRepository<E>(entityClass);
		return await repo.count(options);
	}

	// eslint-disable-next-line complexity, @typescript-eslint/no-explicit-any
	private static addDefaultOptions<T>(ctx: ContextWrapper, options: any): {} {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		let orderByLimits: any = {
			orderBy: 'id',
			sortOrder: Constants.SORT_ORDER_ASC,
			offset: 0,
			limit: Constants.DEFAULT_QUERY_LIMIT,
		};

		if (ctx.params.offset) {
			orderByLimits.offset = ctx.params.offset;
		}

		if (ctx.params.limit) {
			orderByLimits.limit = ctx.params.limit;
		}

		orderByLimits = { ...orderByLimits, ...options.orderByLimits };

		if (!options.hasOwnProperty('where')) {
			ErrorHelper.throwError(Messages.NO_WHERE_CLAUSE, 400, Constants.SYSTEM_EXCEPTION_TYPES.VALIDATION_ERROR);
		}

		options.where = { deleted: false, ...options.where };

		options = {
			...options,
			order: {
				[orderByLimits.orderBy]: orderByLimits.sortOrder,
			},
			skip: orderByLimits.offset,
			take: orderByLimits.limit,
		};

		return options;
	}

	private static async getResourcesWorker<E extends {}>(
		ctx: ContextWrapper,
		entityClass: ObjectType<E>,
		options: {},
		allRecords: boolean = false,
	): Promise<E[]> {
		if (allRecords) {
			options = {
				...options,
				orderByLimits: {
					limit: Constants.MAX_LIMIT_FOR_LIST,
				},
			};
		}
		options = this.addDefaultOptions(ctx, options);
		const repo: Repository<E> = await this.getRepository<E>(entityClass);
		return await repo.find(options);
	}

	private static async getResourceWorker<E extends {}>(ctx: ContextWrapper, entityClass: ObjectType<E>, options: {}): Promise<E> {
		options = this.addDefaultOptions(ctx, options);

		const repo: Repository<E> = await this.getRepository<E>(entityClass);
		const resource = await repo.findOne(options);

		return resource as E;
	}
}
