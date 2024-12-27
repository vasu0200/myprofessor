import { Action } from 'moleculer-decorators';
import { LoginDao } from 'src/dao/login.dao';
import { ErrorHelper } from 'src/helpers/error-helper';
import { ContextWrapper } from 'src/helpers/molecular-helper';
import { User } from 'src/model/user';
import { Constants } from 'src/utility/constants';
import { Messages } from 'src/utility/Messages';
import UserService from './user.service';
import AuthSchema from './auth';
import SSOHelper from '@Helpers/sso-helper';
import { DeviceType, LoginResponseType, OtpSourceType, SSOType, SessionStatusType, UserStatusType } from '@Utility/enum';
import { UserInfoForLogin } from '@Utility/interface';
import SystemHelper from '@Helpers/system-helpers';
import { Otp } from '@Models/otp';
import { BaseDto } from 'src/dto/base.dto';
import { UserMapper, UserRoleMapper } from 'src/dto/user.dto';
import { UserAccess } from '@Models/user-access';
import { LoginHelper } from '@Helpers/service-helpers/login.helper';
import { BaseDao } from '@Dao/base.dao';
import { UserSession } from '@Models/user-session';
import { College } from '@Models/college';
const appConfig = require('../app-config.json');

export default class LoginService extends AuthSchema {
	public name: string = 'login';

	@Action({
		params: {
			...UserService.USER_PARAMS,
		},
		auth: {
			ignoreAuthToken: true,
		},
	})
	public async signup(ctx: ContextWrapper): Promise<User> {
		// check passwords
		if (ctx.params.password != ctx.params.confirmPassword) {
			ErrorHelper.throwError(Messages.INVALID_PASSWORD, 400, Constants.SYSTEM_EXCEPTION_TYPES.VALIDATION_ERROR);
		}

		const userInfo = await LoginDao.checkEmail(ctx.params.email);

		// check email exists
		if (userInfo) {
			ErrorHelper.throwError(Messages.USER_ALREADY_EXISTS, 400, Constants.SYSTEM_EXCEPTION_TYPES.VALIDATION_ERROR);
		}

		const info = await LoginDao.checkMobile(ctx.params.mobile);

		if (info) {
			ErrorHelper.throwError(Messages.MOBILE_ALREADY_EXISTS, 400, Constants.SYSTEM_EXCEPTION_TYPES.VALIDATION_ERROR);
		}

		return await ctx.call('user.createUser', ctx.params);
	}

	@Action({
		params: {
			userIdentifier: { type: 'string' },
			password: { type: 'string' },
			deviceId: { type: 'string', optional: true },
			deviceToken: { type: 'string', optional: true },
			deviceType: { type: 'enum', values: [DeviceType.Android, DeviceType.IOS, DeviceType.Web], optional: true },
			additionalDeviceInfo: { type: 'string', optional: true },
			killSession: { type: 'boolean', optional: true },
		},
		auth: {
			ignoreAuthToken: true,
		},
	})
	public async login(ctx: ContextWrapper) {
		// get userInfo for login
		const userInfoLogin: UserInfoForLogin = await LoginDao.getUserInfoForLogin(ctx.params.userIdentifier);

		if (!userInfoLogin || !(userInfoLogin && (await LoginHelper.validatePassword(ctx.params.password, userInfoLogin.password)))) {
			ErrorHelper.throwError(Messages.INVALID_LOGIN_CREDS, 400, Constants.SYSTEM_EXCEPTION_TYPES.VALIDATION_ERROR);
		}

		if (userInfoLogin?.collegeId) {
			const college: College = await LoginDao.getGenericResource(ctx, College, { where: { id: userInfoLogin?.collegeId } });

			if (college?.fromDate && college?.toDate) {
				// Get today's date
				const today = new Date();

				// Convert fromDate and toDate strings to Date objects
				const fromDateObj = new Date(college?.fromDate);
				let toDateObj = new Date(college?.toDate);

				// Adjust toDateObj to include the end of the day
				toDateObj.setHours(23, 59, 59, 999);

				const validateCollege = today >= fromDateObj && today <= toDateObj;
				// Check if today is between from date and to date inclusively
				if (!validateCollege) {
					ErrorHelper.throwError(Messages.COLLEGE_VALIDITY_DONE, 400, Constants.SYSTEM_EXCEPTION_TYPES.VALIDATION_ERROR);
				}

				if (college?.status !== 'active') {
					ErrorHelper.throwError(Messages.COLLEGE_INACTIVE, 400, Constants.SYSTEM_EXCEPTION_TYPES.VALIDATION_ERROR);
				}
			}
		}

		if (userInfoLogin.accountStatus == UserStatusType.InActive || userInfoLogin.accountStatus == UserStatusType.Disabled) {
			ErrorHelper.throwError(Messages.INACTIVE_USER, 400, Constants.SYSTEM_EXCEPTION_TYPES.VALIDATION_ERROR);
		}

		if (ctx.params.killSession) {
			// kill existing sessions for current device
			await LoginDao.killUserCurrentDeviceSessions(userInfoLogin.userId, ctx.params.deviceType);
		} else {
			// check for active session for current device
			const userSession: UserSession = await LoginDao.getGenericResource(ctx, UserSession, {
				where: { userId: userInfoLogin.userId, deviceType: ctx.params.deviceType, sessionStatus: SessionStatusType.Active },
			});

			if (userSession) {
				return { loginResponse: LoginResponseType.SessionExists };
			}
		}

		const {
			roleId,
			roleName,
			roleDescription,
			universityId,
			collegeId,
			branchId,
			semesterId,
			sectionId,
			universityName,
			branchName,
			semesterName,
			password,
			...rest
		} = userInfoLogin;

		// create jwt token
		const { jwt, expiresAt } = await LoginHelper.createAccessToken(ctx, userInfoLogin, roleId);

		if (roleName == Constants.Roles.GENERAL_STUDENT || roleName == Constants.Roles.STUDENT) {
			// capture leader board
			ctx.broadcast('leaderBoard.capture', {
				universityId: universityId,
				collegeId: collegeId,
				branchId: branchId,
				semesterId: semesterId,
				userId: userInfoLogin.userId,
				ruleCode: Constants.LeaderBoardRuleCodes.EVERY_LOGIN,
			});
		}

		const response = {
			role: { roleId, roleName, roleDescription },
			userInfo: { ...rest },
			userOrg: {
				roleId,
				roleName,
				roleDescription,
				universityId,
				collegeId,
				branchId,
				semesterId,
				sectionId,
				universityName,
				branchName,
				semesterName,
			},
			jwt: jwt,
			sessionId: '',
		};

		// build user session
		const newUserSession: UserSession = await ctx.call('login.createUserSession', {
			userId: rest.userId,
			deviceType: ctx.params.deviceType || DeviceType.Web,
			deviceId: ctx.params.deviceId || '',
			deviceToken: ctx.params.deviceToken || '',
			jwt: jwt,
			expiresAt: expiresAt,
		});

		response.sessionId = newUserSession.id;

		return response;
	}

	@Action({
		params: {
			ssoType: { type: 'string' },
		},
		auth: {
			ignoreAuthToken: true,
		},
	})
	public async getSSORedirectUrl(ctx: ContextWrapper): Promise<string> {
		const sso: SSOType = ctx.params.ssoType;
		return await SSOHelper.getSSORedirectUrl(sso);
	}

	@Action({
		params: {
			ssoType: { type: 'string' },
			code: { type: 'string' },
			// state: { type: 'string' }, // first_stage
			boardId: { type: 'string', optional: true },
			gradeId: { type: 'string', optional: true },
		},
		auth: {
			ignoreAuthToken: true,
		},
	})
	public async ssoLogin(ctx: ContextWrapper) {
		const sso: SSOType = ctx.params.ssoType;
		const code: string = ctx.params.code;
		const { email, firstName, lastName } = await LoginHelper.getSSOUserInfoForLoginCheck(ctx, sso, code);
		const user = await LoginDao.checkEmail(email);
		let emailToCheck: string = email;

		if (!user) {
			const userInfo: { user: UserMapper; role: UserRoleMapper } = await ctx.call('user.createSSOUser', { email, firstName, lastName });
			emailToCheck = userInfo.user.email;
			return userInfo;
		}

		if (user && user.account_status == UserStatusType.AccountSetupInProgress) {
			return { id: user.id, email: user.email, firstName: user.first_name, lastName: user.last_name, accountStatus: user.account_status };
		}

		const userInfoLogin: UserInfoForLogin = await LoginDao.getSSOUserInfoForLogin(emailToCheck);

		if (!userInfoLogin) {
			ErrorHelper.throwError(Messages.INVALID_LOGIN_CREDS, 400, Constants.SYSTEM_EXCEPTION_TYPES.VALIDATION_ERROR);
		}

		const {
			roleId,
			roleName,
			roleDescription,
			universityId,
			collegeId,
			branchId,
			semesterId,
			sectionId,
			universityName,
			branchName,
			semesterName,
			...rest
		} = userInfoLogin;

		// create jwt token
		const { jwt, expiresAt } = await LoginHelper.createAccessToken(ctx, userInfoLogin, roleId);

		const response = {
			role: { roleId, roleName, roleDescription },
			userInfo: { ...rest },
			userOrg: {
				roleId,
				roleName,
				roleDescription,
				universityId,
				collegeId,
				branchId,
				semesterId,
				sectionId,
				universityName,
				branchName,
				semesterName,
			},
			jwt: jwt,
		};

		return response;
	}

	@Action({
		params: {
			userId: { type: 'string' },
		},
		auth: {
			ignoreAuthToken: true,
		},
	})
	public async generateOtpForAccountValidation(ctx: ContextWrapper) {
		const user: User = await LoginDao.getGenericResource(ctx, User, { where: { id: ctx.params.userId } });

		if (user.accountStatus != UserStatusType.RegistrationInProgress && user.accountStatus != UserStatusType.WebAccountSetupInProgress) {
			ErrorHelper.throwError(Messages.USER_REGISTRATION_IS_DONE, 400, Constants.SYSTEM_EXCEPTION_TYPES.UNAUTHORIZED);
		}

		// generate otp
		const otpResponse: Otp = await ctx.call('otp.generate', { sendTo: user.email, sourceType: OtpSourceType.Email });

		const mobileOtpResponse: Otp = await ctx.call('otp.generate', { sendTo: user.mobileNumber, sourceType: OtpSourceType.Mobile });

		// get email body and subject
		const { messageBody: emailBody, messageSubject } = SystemHelper.handleEmailAndSmsMessageBody(
			OtpSourceType.Email,
			{ User: user.email, otp: otpResponse.otp, ...appConfig.emailTemplate },
			Constants.EmailCodes.MY_PROFESSOR_EMAIL_VERIFY,
		);

		// send email
		await ctx.broker.call('email.sendEmail', { email: user.email, subject: messageSubject, body: emailBody });

		// send sms
		const { messageBody } = SystemHelper.handleEmailAndSmsMessageBody(
			OtpSourceType.Mobile,
			{ Otp: mobileOtpResponse.otp },
			Constants.SMSCode.MY_PROFESSOR_FORGOT_PASSWORD,
		);

		// send mobile otp
		await ctx.broker.call('sms.sendSms', {
			smsTemplateId: appConfig.smsGateway.otpRequestTemplateId,
			mobile: user.mobileNumber,
			message: messageBody,
			subject: Constants.SMSCode.MY_PROFESSOR_FORGOT_PASSWORD,
		});
	}

	@Action({
		params: {
			userId: { type: 'string' },
			otp: { type: 'string', max: 6 },
		},
		auth: {
			ignoreAuthToken: true,
		},
	})
	public async validateAccount(ctx: ContextWrapper) {
		let user: User = await LoginDao.getGenericResource(ctx, User, { where: { id: ctx.params.userId } });

		if (user.accountStatus != UserStatusType.RegistrationInProgress) {
			ErrorHelper.throwError(Messages.USER_REGISTRATION_IS_DONE, 400, Constants.SYSTEM_EXCEPTION_TYPES.UNAUTHORIZED);
		}

		// TODO: clean up the code
		try {
			await ctx.call('otp.validate', { receiver: user.email, otp: ctx.params.otp });
		} catch (err) {
			await ctx.call('otp.validate', { receiver: user.mobileNumber, otp: ctx.params.otp });
		}

		// TODO:fix this issue
		user.accountStatus = UserStatusType.AccountSetupInProgress;
		user = await LoginDao.saveGenericResource(ctx, user);

		return BaseDto.transformResource(user, new UserMapper());
	}

	@Action({
		params: {
			emailOrMobile: { type: 'string' },
		},
		auth: {
			ignoreAuthToken: true,
		},
	})
	public async forgotPassword(ctx: ContextWrapper) {
		const userIdentifier: string = ctx.params.emailOrMobile;
		const checkIfEmail: number = userIdentifier.indexOf('@');
		let user: User;
		let sendTo: string = '';
		let sourceType: OtpSourceType;

		if (checkIfEmail != -1) {
			// mobile validator
			user = await LoginDao.checkEmail(userIdentifier);
			if (!user) {
				ErrorHelper.throwError(Messages.INVALID_USER_ACCOUNT, 404, Constants.SYSTEM_EXCEPTION_TYPES.UNAUTHORIZED);
			}
			sendTo = user.email;
			sourceType = OtpSourceType.Email;
		} else {
			// email validator
			user = await LoginDao.checkMobile(userIdentifier);
			if (!user) {
				ErrorHelper.throwError(Messages.INVALID_USER_ACCOUNT, 404, Constants.SYSTEM_EXCEPTION_TYPES.UNAUTHORIZED);
			}
			sendTo = user.mobileNumber;
			sourceType = OtpSourceType.Mobile;
		}

		// generate OTP
		const otpResponse: Otp = await ctx.call('otp.generate', { sendTo: sendTo, sourceType: sourceType });

		if (sourceType == OtpSourceType.Email) {
			// get email body and subject
			const { messageBody, messageSubject } = SystemHelper.handleEmailAndSmsMessageBody(
				sourceType,
				{ user: user.email, otp: otpResponse.otp, ...appConfig.emailTemplate },
				Constants.EmailCodes.MY_PROFESSOR_FORGET_PASSWORD_VERIFY,
			);

			// send email
			await ctx.broker.call('email.sendEmail', { email: user.email, subject: messageSubject, body: messageBody });
		}

		if (sourceType == OtpSourceType.Mobile) {
			// get sms body
			const { messageBody } = SystemHelper.handleEmailAndSmsMessageBody(
				sourceType,
				{ Otp: otpResponse.otp },
				Constants.SMSCode.MY_PROFESSOR_FORGOT_PASSWORD,
			);

			// send otp
			await ctx.broker.call('sms.sendSms', {
				smsTemplateId: appConfig.smsGateway.otpRequestTemplateId,
				mobile: user.mobileNumber,
				message: messageBody,
				subject: Constants.SMSCode.MY_PROFESSOR_FORGOT_PASSWORD,
			});
		}

		return BaseDto.transformResource(user, new UserMapper());
	}

	@Action({
		params: {
			userId: { type: 'string' },
			oldPassword: { type: 'string', min: 3, max: 16 },
			newPassword: { type: 'string', min: 3, max: 16 },
			confirmPassword: { type: 'string', min: 3, max: 16 },
		},
	})
	public async changePassword(ctx: ContextWrapper) {
		if (ctx.params.newPassword !== ctx.params.confirmPassword) {
			ErrorHelper.throwError(Messages.INVALID_PASSWORD, 404, Constants.SYSTEM_EXCEPTION_TYPES.VALIDATION_ERROR);
		}
		let userAccess: UserAccess = await LoginDao.getGenericResource(ctx, UserAccess, { where: { userId: ctx.params.userId } });

		if (userAccess?.password && !(await LoginHelper.validatePassword(ctx.params.oldPassword, userAccess.password))) {
			ErrorHelper.throwError(Messages.INVALID_OLD_PASSWORD, 404, Constants.SYSTEM_EXCEPTION_TYPES.VALIDATION_ERROR);
		}

		userAccess.password = await LoginHelper.encryptPassword(ctx.params.newPassword);
		await LoginDao.saveGenericResource(ctx, userAccess);
	}

	@Action({
		params: {
			otp: { type: 'string', max: 6 },
			userId: { type: 'string' },
			emailOrMobile: { type: 'string' },
			password: { type: 'string', min: 3, max: 16 },
			confirmPassword: { type: 'string', min: 3, max: 16 },
		},
		auth: {
			ignoreAuthToken: true,
		},
	})
	public async validateForgotPasswordOtp(ctx: ContextWrapper) {
		if (ctx.params.password != ctx.params.confirmPassword) {
			ErrorHelper.throwError(Messages.INVALID_PASSWORD, 400, Constants.SYSTEM_EXCEPTION_TYPES.VALIDATION_ERROR);
		}

		const user: User = await LoginDao.getGenericResource(ctx, User, { where: { id: ctx.params.userId } });

		if (!user) {
			ErrorHelper.throwError(Messages.INVALID_USER, 400, Constants.SYSTEM_EXCEPTION_TYPES.DATA_NOT_FOUND);
		}

		await ctx.call('otp.validate', { receiver: ctx.params.emailOrMobile, otp: ctx.params.otp });

		// get userAccess
		const userAccess: UserAccess = await LoginDao.getGenericResource(ctx, UserAccess, { where: { userId: user.id } });
		userAccess.password = await LoginHelper.encryptPassword(ctx.params.password);
		await LoginDao.saveGenericResource(ctx, userAccess);
	}

	@Action({
		params: {
			userId: { type: 'string' },
			device: { type: 'string', optional: true },
			deviceId: { type: 'string', optional: true },
			deviceToken: { type: 'string', optional: true },
		},
		auth: {
			ignoreAuthToken: true,
		},
	})
	public async createUserSession(ctx: ContextWrapper) {
		let userSession = LoginHelper.setUserSessionDetails(ctx, new UserSession());
		userSession = await BaseDao.saveGenericResource(ctx, userSession);
		return userSession;
	}

	@Action({
		params: {},
	})
	public async logout(ctx: ContextWrapper) {
		const userSession: UserSession = await LoginDao.getGenericResource(ctx, UserSession, { where: { jwt: ctx.meta.jwt } });

		if (!userSession) {
			ErrorHelper.throwError(Messages.INVALID_SESSION, 404);
		}

		userSession.sessionStatus = SessionStatusType.LoggedOut;
		await LoginDao.saveGenericResource(ctx, userSession);
	}

	@Action({
		params: {
			jwt: { type: 'string' },
		},
		auth: {
			ignoreAuthToken: true,
		},
	})
	public async killCurrentJwtTokenSession(ctx: ContextWrapper) {
		const userSession = await LoginDao.getUserSessionByJwt(ctx.params.jwt);

		if (userSession) {
			await LoginDao.updateUserSessionByJwt(ctx.params.jwt);
		}
	}

	@Action({
		params: {
			userId: { type: 'string' },
			otp: { type: 'string', max: 6 },
		},
		auth: {
			ignoreAuthToken: true,
		},
	})
	public async validateAccountForWebsiteUser(ctx: ContextWrapper) {
		let user: User = await LoginDao.getGenericResource(ctx, User, { where: { id: ctx.params.userId } });

		if (user.accountStatus != UserStatusType.WebAccountSetupInProgress) {
			ErrorHelper.throwError(Messages.USER_REGISTRATION_IS_DONE, 400, Constants.SYSTEM_EXCEPTION_TYPES.UNAUTHORIZED);
		}

		// TODO: clean up the code
		try {
			await ctx.call('otp.validate', { receiver: user.email, otp: ctx.params.otp });
		} catch (err) {
			await ctx.call('otp.validate', { receiver: user.mobileNumber, otp: ctx.params.otp });
		}

		// TODO:fix this issue
		user.accountStatus = UserStatusType.Active;
		user = await LoginDao.saveGenericResource(ctx, user);

		// Welcome emails

		// get email body and subject
		const { messageBody, messageSubject } = SystemHelper.handleEmailAndSmsMessageBody(
			OtpSourceType.Email,
			{ email: user.email, password: '***********', ...appConfig.emailTemplate },
			Constants.EmailCodes.MY_PROFESSOR_CONFIRM_EMAIL,
		);

		// send email
		await ctx.broker.call('email.sendEmail', { email: user.email, subject: messageSubject, body: messageBody });

		if (user.mobileNumber) {
			// get sms body
			const { messageBody } = SystemHelper.handleEmailAndSmsMessageBody(
				OtpSourceType.Mobile,
				{
					UserInfo: `Mobile/Passwd: ${user.mobileNumber}/***********`,
					AppDownloadInfo: `${appConfig.emailTemplate.shortPlayStoreImgUrl} or ${appConfig.emailTemplate.shortAppStoreLink}`,
				},
				Constants.SMSCode.MY_PROFESSOR_WELCOME_MESSAGE,
			);

			// send otp
			await ctx.broker.call('sms.sendSms', {
				smsTemplateId: appConfig.smsGateway.welcomeUserTemplateId,
				mobile: user.mobileNumber,
				message: messageBody,
				subject: Constants.SMSCode.MY_PROFESSOR_WELCOME_MESSAGE,
			});
		}

		return BaseDto.transformResource(user, new UserMapper());
	}
}

module.exports = new LoginService();
