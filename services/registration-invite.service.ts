const appConfig = require('../app-config.json');
import { RegistrationInviteDao } from '@Dao/registration-invite.dao';
import { ErrorHelper } from '@Helpers/error-helper';
import { ContextWrapper } from '@Helpers/molecular-helper';
import { RegistrationInviteHelper } from '@Helpers/service-helpers/registration-invite.helper';
import SystemHelper from '@Helpers/system-helpers';
import { RegistrationInvite } from '@Models/registration-invite';
import { User } from '@Models/user';
import { UserWallet } from '@Models/user-wallet';
import { Constants } from '@Utility/constants';
import { RegistrationInviteStatusType } from '@Utility/enum';
import { Messages } from '@Utility/Messages';
import { Action } from 'moleculer-decorators';
import AuthSchema from './auth';

export default class RegistrationInviteService extends AuthSchema {
	private static inviteUrl: string = appConfig.other.clientUrl + '/account/register/';
	// private static inviteUrl: string = appConfig.other.clientUrl ;
	public name: string = 'registrationInvite';

	@Action({
		params: {
			inviteCode: { type: 'string' },
		},
		auth: {
			ignoreAuthToken: true,
		},
	})
	public async validateInviteCode(ctx: ContextWrapper) {
		const inviterInfo: User = await RegistrationInviteDao.getGenericResource(ctx, User, { where: { inviteCode: ctx.params.inviteCode } });

		if (!inviterInfo) {
			ErrorHelper.throwError(Messages.INVALID_INVITE_CODE, 400, Constants.SYSTEM_EXCEPTION_TYPES.DATA_NOT_FOUND);
		}

		return true;
	}

	@Action({
		params: {
			inviteCode: { type: 'string' },
			userId: { type: 'string' },
		},
		auth: {
			ignoreAuthToken: true,
		},
	})
	public async handleUserInvites(ctx: ContextWrapper) {
		const inviterInfo: User = await RegistrationInviteDao.getGenericResource(ctx, User, { where: { inviteCode: ctx.params.inviteCode } });

		if (!inviterInfo) {
			return;
		}

		const newInvite: RegistrationInvite = RegistrationInviteHelper.setInviteDetails(ctx, new RegistrationInvite(), inviterInfo.id);
		newInvite.registrationStatus = RegistrationInviteStatusType.Accepted;

		await RegistrationInviteDao.saveGenericResource(ctx, newInvite);
	}

	@Action({
		params: {
			userId: { type: 'string' },
		},
	})
	public async getUserInviteRegistrationMetrics(ctx: ContextWrapper) {
		let user: User = await RegistrationInviteDao.getGenericResource(ctx, User, { where: { id: ctx.params.userId } });

		if (!user) {
			ErrorHelper.throwError(Messages.INVALID_USER, 400, Constants.SYSTEM_EXCEPTION_TYPES.DATA_NOT_FOUND);
		}

		if (!user.inviteCode) {
			user.inviteCode = SystemHelper.generateUniqueCode();
			user = await RegistrationInviteDao.saveGenericResource(ctx, user);
		}

		const inviteUrl: string = RegistrationInviteService.inviteUrl + 'R-' + user.inviteCode;
		// const inviteUrl: string = RegistrationInviteService.inviteUrl;


		// check user-wallet
		let userWallet: UserWallet = await RegistrationInviteDao.getGenericResource(ctx, UserWallet, { where: { userId: ctx.params.userId } });

		if (!userWallet) {
			userWallet = new UserWallet();
			userWallet.userId = ctx.params.userId;
			userWallet = await RegistrationInviteDao.saveGenericResource(ctx, userWallet);
		}

		ctx.broadcast('razorpay.captureContact', { userId: userWallet.userId });

		return { inviteUrl, userWallet };
	}

	@Action({
		params: {
			userId: { type: 'string' },
		},
		auth: {
			ignoreAuthToken: true,
		},
	})
	public async handleUserInvitePoints(ctx: ContextWrapper) {
		// check If user has been invited by any
		const registrationInvite: RegistrationInvite = await RegistrationInviteDao.getGenericResource(ctx, RegistrationInvite, {
			where: { userId: ctx.params.userId },
		});

		if (!registrationInvite) {
			return;
		}

		const userIdToAddPoints: string = registrationInvite.inviterId;

		const userWallet: UserWallet = await RegistrationInviteDao.getGenericResource(ctx, UserWallet, {
			where: { userId: userIdToAddPoints },
		});
		userWallet.rewardPoints = +userWallet.rewardPoints + Constants.DEFAULT_REFERRAL_POINTS;
		userWallet.withdrawableCash = +userWallet.withdrawableCash + Constants.DEFAULT_REFERRAL_POINTS;
		await RegistrationInviteDao.saveGenericResource(ctx, userWallet);
	}

	@Action({
		params: {
			userId: { type: 'string' },
		},
	})
	public async getUserRegistrationInvites(ctx: ContextWrapper) {
		return await RegistrationInviteDao.getUserRegistrationInvites(ctx);
	}

	@Action({
		params: {},
	})
	public async getAllUsersRegistrations(ctx: ContextWrapper) {
		return await RegistrationInviteDao.getAllUsersRegistrations(ctx);
	}

	@Action({
		params: {},
	})
	public async getAllUsersRegistrationMetrics(ctx: ContextWrapper) {
		return await RegistrationInviteDao.getAllUsersRegistrationMetrics(ctx);
	}

	@Action({
		params: {
			userId: { type: 'string' },
		},
	})
	public async getUsersRegistrations(ctx: ContextWrapper) {
		return await RegistrationInviteDao.getUserRegistrationInvites(ctx);
	}
}

module.exports = new RegistrationInviteService();
