import { ContextWrapper } from '@Helpers/molecular-helper';
import { Action } from 'moleculer-decorators';
import AuthSchema from './auth';
import jwt from 'jsonwebtoken';
import { JwtPayload } from '@Models/user';
const appConfig = require('../app-config.json');

export default class SecurityService extends AuthSchema {
	public name: string = 'security';

	@Action({
		params: {
			expiryInSeconds: { type: 'number' },
		},
		auth: {
			ignoreAuthToken: true,
		},
	})
	public createJwt(ctx: ContextWrapper): string {
		const jwtPayload: JwtPayload = ctx.params.jwtPayload;
		const expiryInSeconds: number = +ctx.params.expiryInSeconds; // should be in sync with session timeout
		const options = {
			expiresIn: expiryInSeconds,
			issuer: appConfig.jwt.issuer,
		};

		return jwt.sign(jwtPayload, appConfig.jwt.secretKey, options);
	}

	@Action({
		params: {
			jwtToken: { type: 'string' },
		},
		auth: {
			ignoreAuthToken: true,
		},
	})
	public verifyJwtToken(ctx: ContextWrapper): JwtPayload {
		const jwtToken: string = ctx.params.jwtToken;
		return jwt.verify(jwtToken, appConfig.jwt.secretKey) as JwtPayload;
	}
}

module.exports = new SecurityService();
