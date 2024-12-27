import { Constants } from '@Utility/constants';
import { SSOType } from '@Utility/enum';
import { FacebookAccessToken, FacebookUserInfo, GoogleUserInfo } from '@Utility/interface';
import { Messages } from '@Utility/Messages';
import axios from 'axios';
import { OAuth2Client, OAuth2ClientOptions } from 'google-auth-library';
import { google } from 'googleapis';
import * as queryString from 'query-string';
import { ErrorHelper } from './error-helper';
const appConfig = require('../../app-config.json');

export default class SSOHelper {
	public static async getSSORedirectUrl(sso: SSOType): Promise<string> {
		let redirectUrl: string = '';

		if (sso == SSOType.Google) {
			redirectUrl = await this.getGoogleRedirectUrl();
		}

		if (sso == SSOType.Facebook) {
			redirectUrl = await this.getFacebookRedirectUrl();
		}

		return redirectUrl;
	}

	public static async getSSOUserInfo(sso: SSOType, code: string): Promise<GoogleUserInfo | FacebookUserInfo | undefined> {
		let userInfo: GoogleUserInfo | FacebookUserInfo | undefined;
		if (sso == SSOType.Google) {
			userInfo = await this.getGoogleAccountInfo(code);
		}

		if (sso == SSOType.Facebook) {
			userInfo = await this.getFacebookUserData(code);
		}
		return userInfo;
	}

	private static async getOAuthConnection(): Promise<OAuth2Client> {
		const oAuth2Parmas: OAuth2ClientOptions = {
			clientId: appConfig.sso.google.clientId,
			clientSecret: appConfig.sso.google.clientSecret,
			redirectUri: appConfig.sso.google.redirectUris,
		};
		return await new google.auth.OAuth2({ ...oAuth2Parmas });
	}

	private static async getGoogleConnectionUrl(auth: OAuth2Client): Promise<string> {
		return await auth.generateAuthUrl({
			access_type: appConfig.sso.google.accessType,
			prompt: appConfig.sso.google.prompt,
			scope: appConfig.sso.google.scope,
		});
	}

	private static async getGoogleRedirectUrl(): Promise<string> {
		const oAuthConnection: OAuth2Client = await this.getOAuthConnection();
		return await this.getGoogleConnectionUrl(oAuthConnection);
	}

	private static async getGoogleAccessToken(googleCode: string) {
		return await (await this.getOAuthConnection()).getToken(googleCode);
	}

	private static async getGoogleAccountInfo(googleCode: string): Promise<GoogleUserInfo> {
		const { tokens } = await this.getGoogleAccessToken(googleCode);
		const googleUser: GoogleUserInfo = await axios
			.get(`${appConfig.sso.google.userInfoUri}/userinfo?alt=json&access_token=${tokens.access_token}`, {
				headers: {
					Authorization: `Bearer ${tokens.id_token}`,
				},
			})
			.then((res) => res.data)
			.catch((error) => {
				ErrorHelper.throwError(Messages.SSO_AUTH_FAID, 400, Constants.SYSTEM_EXCEPTION_TYPES.EXTERNAL_SERVICES_ERROR, error);
			});

		return googleUser;
	}

	private static async getFacebookRedirectUrl() {
		const stringifiedParams = queryString.stringify({
			client_id: appConfig.sso.facebook.appId,
			redirect_uri: appConfig.sso.facebook.redirectUri,
			scope: appConfig.sso.facebook.scope.join(','),
			response_type: appConfig.sso.facebook.responseType,
			auth_type: appConfig.sso.facebook.authType,
			display: appConfig.sso.facebook.display,
		});

		return `${appConfig.sso.facebook.authUrl}?${stringifiedParams}`;
	}

	private static async getFacebookAccessToken(facebookCode: string): Promise<FacebookAccessToken> {
		const { data } = await axios({
			url: appConfig.sso.facebook.accessTokenUrl,
			method: 'get',
			params: {
				client_id: appConfig.sso.facebook.appId,
				client_secret: appConfig.sso.facebook.appSecret,
				redirect_uri: appConfig.sso.facebook.redirectUri,
				facebookCode,
			},
		});
		const tokenInfo: FacebookAccessToken = data;
		return tokenInfo;
	}

	private static async getFacebookUserData(facebookCode: string): Promise<FacebookUserInfo> {
		const tokenInfo: FacebookAccessToken = await this.getFacebookAccessToken(facebookCode);
		const userInfo: FacebookUserInfo = await axios
			.get(appConfig.sso.facebook.userInfoUrl, {
				params: {
					fields: appConfig.sso.facebook.fields.join(','),
					access_token: tokenInfo.access_token,
				},
			})
			.then((res) => res.data)
			.catch((error) => {
				ErrorHelper.throwError(Messages.SSO_AUTH_FAID, 400, Constants.SYSTEM_EXCEPTION_TYPES.EXTERNAL_SERVICES_ERROR, error);
			});

		return userInfo;
	}
}
