/* eslint-disable @typescript-eslint/camelcase */
import { ErrorHelper } from '@Helpers/error-helper';
import { ContextWrapper } from '@Helpers/molecular-helper';
import { JwtPayload } from '@Models/user';
import { Constants } from '@Utility/constants';
import { Messages } from '@Utility/Messages';
import { BaseSchema, Method } from 'moleculer-decorators';
import jwt from 'jsonwebtoken';
import { SessionStatusType } from '@Utility/enum';
import { LoginDao } from '@Dao/login.dao';
const appConfig = require('../app-config.json');

export default class AuthSchema extends BaseSchema {
	public hooks = {
		before: {
			'*': ['securityCheck'],
		},
		error: {
			'*': 'handleError',
		},
		after: {
			'*': 'handleUndefined',
		},
	};

	@Method
	private async securityCheck(ctx: ContextWrapper) {
		const authAction = ctx.action;

		// Action don't need token validation, i.e. public api
		if (authAction && authAction.auth && authAction.auth.ignoreAuthToken) {
			return;
		}

		// validate Authtoken
		await this.validateAuthToken(ctx);

		if (authAction && authAction.auth && authAction.auth.role) {
			await this.validateRole(ctx);
		}

		return;
	}

		@Method
	private async validateAuthToken(ctx: ContextWrapper) {
		if (!ctx.meta.jwt) {
			ErrorHelper.throwError(Messages.NO_AUTH_TOKEN, 400, Constants.SYSTEM_EXCEPTION_TYPES.UNAUTHORIZED);
		}
		// get current
		const userSession = await LoginDao.getUserSessionByJwt(ctx.meta.jwt);

		if (!userSession || (userSession && userSession.session_status != SessionStatusType.Active)) {
			ErrorHelper.throwError(Messages.INVALID_AUTH_TOKEN, 400, Constants.SYSTEM_EXCEPTION_TYPES.UNAUTHORIZED);
		}

		try {
			const jwtInfo: JwtPayload = jwt.verify(ctx.meta.jwt, appConfig.jwt.secretKey) as JwtPayload;

			if (!jwtInfo) {
				ctx.broadcast('userSession.kill', { ...ctx, jwt: ctx.meta.jwt });
				ErrorHelper.throwError(Messages.INVALID_AUTH_TOKEN, 400, Constants.SYSTEM_EXCEPTION_TYPES.UNAUTHORIZED);
			}

			// set meta info
			ctx.meta.userId = jwtInfo.userId;
			ctx.meta.universityId = jwtInfo.universityId;
			ctx.meta.collegeId = jwtInfo.collegeId;
			ctx.meta.branchId = jwtInfo.branchId;
			ctx.meta.roleId = jwtInfo.roleId;
			ctx.meta.roleName = jwtInfo.roleName;
		} catch (err) {
			const error = err as any;
			ctx.broadcast('userSession.kill', { ...ctx, jwt: ctx.meta.jwt });
			ErrorHelper.throwError(error.message, 400, Constants.SYSTEM_EXCEPTION_TYPES.UNAUTHORIZED);
		}
	}

	@Method
	private async validateRole(ctx: ContextWrapper) {
		const role: string = ctx.params.auth;
		ctx.broker.logger.info('Entered validateRole');
	}

	@Method
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	private async handleError(ctx: ContextWrapper, err: any) {
		throw err;
	}

	@Method
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	private async handleUndefined(ctx: ContextWrapper, res: any) {
		return res === undefined ? null : res;
	}

	@Method
	private async logServiceCalls(ctx: ContextWrapper) {
		if (appConfig.other.env != 'prod') {
			ctx.broker.logger.info(`${ctx.action?.name}`, JSON.stringify(ctx.params));
		}
	}
}
