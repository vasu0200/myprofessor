import { ErrorHelper } from '@Helpers/error-helper';
import { ContextWrapper } from '@Helpers/molecular-helper';
import SSOHelper from '@Helpers/sso-helper';
import { JwtPayload } from '@Models/user';
import { Constants } from '@Utility/constants';
import { DeviceType, SSOType, SessionStatusType } from '@Utility/enum';
import { FacebookUserInfo, GoogleUserInfo, UserInfoForLogin } from '@Utility/interface';
import { Messages } from '@Utility/Messages';
import { Method } from 'moleculer-decorators';
import bcrypt from 'bcrypt';
import SystemHelper from '@Helpers/system-helpers';
import { UserSession } from '@Models/user-session';

export class LoginHelper {
	@Method
	public static async getSSOUserInfoForLoginCheck(ctx: ContextWrapper, sso: SSOType, code: string) {
		let userInfo: GoogleUserInfo | FacebookUserInfo | undefined;
		let email: string = '';
		let firstName: string = '';
		let lastName: string = '';

		userInfo = await SSOHelper.getSSOUserInfo(sso, code);

		if (sso == SSOType.Google) {
			const googleUserInfo = userInfo as GoogleUserInfo;

			if (!googleUserInfo.verified_email) {
				ErrorHelper.throwError(Messages.UNVERIFIED_GOOGLE_EMAIL, 400, Constants.SYSTEM_EXCEPTION_TYPES.EXTERNAL_SERVICES_ERROR);
			}

			email = googleUserInfo.email;
		}

		if (sso == SSOType.Facebook) {
			const facebookUserInfo = userInfo as FacebookUserInfo;

			email = facebookUserInfo.email;
			firstName = facebookUserInfo.first_name;
			lastName = facebookUserInfo.last_name;
		}

		return { email, firstName, lastName };
	}

	@Method
	public static async createAccessToken(ctx: ContextWrapper, userInfoLogin: UserInfoForLogin, roleId: string) {
		// create jwt token
		const expiresAt: Date = new Date();
		const expiryInDays: number = Constants.JWT_TOKEN_EXPIRY_DAYS;
		expiresAt.setDate(expiresAt.getDate() + expiryInDays);
		const expiryInSeconds = expiryInDays * 24 * 60 * 60;
		const jwtPayload: JwtPayload = {
			userId: userInfoLogin.userId,
			universityId: userInfoLogin.universityId,
			collegeId: userInfoLogin.collegeId,
			branchId: userInfoLogin.branchId,
			roleId: roleId,
			roleName: userInfoLogin.roleName,
		};

		const jwt: string = await ctx.call('security.createJwt', {
			jwtPayload,
			expiryInSeconds,
		});

		return { jwt, expiresAt };
	}

	@Method
	public static async encryptPassword(password: string): Promise<string> {
		const salt = SystemHelper.getHashSalt();
		const hashPassword = bcrypt.hashSync(password, salt);
		return hashPassword;
	}

	@Method
	public static async validatePassword(password: string, hash: string): Promise<boolean> {
		return bcrypt.compareSync(password, hash);
	}

	@Method
	public static setUserSessionDetails(ctx: ContextWrapper, target: UserSession) {
		target.userId = ctx.params.userId;
		target.deviceId = ctx.params.deviceId.toString() || '';
		target.deviceToken = ctx.params.deviceToken.toString() || '';
		target.deviceType = ctx.params.deviceType || DeviceType.Web;
		target.sessionStatus = SessionStatusType.Active;
		target.jwt = ctx.params.jwt;
		target.expiryDate = ctx.params.expiresAt;
		return target;
	}
}
