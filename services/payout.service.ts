import { PayoutDao } from '@Dao/payout.dao';
import { ErrorHelper } from '@Helpers/error-helper';
import { ContextWrapper } from '@Helpers/molecular-helper';
import { PayoutTransactionHelper } from '@Helpers/service-helpers/payout-transaction.helper';
import { PayoutTransaction } from '@Models/payout-transaction';
import { RazorpayContact } from '@Models/razorpay-contact';
import { RazorpayFundAccount } from '@Models/razorpay-fund-account';
import { RazorpayPayout } from '@Models/razorpay-payout';
import { UserWallet } from '@Models/user-wallet';
import { Constants } from '@Utility/constants';
import { RazorpayPayoutModeType, RazorpayXFundAccountType, RazorpayXPayoutStatusType } from '@Utility/enum';
import { Messages } from '@Utility/Messages';
import { Action } from 'moleculer-decorators';
import { PayoutDto, UserFundAccountMapper } from 'src/dto/payout.dto';
import AuthSchema from './auth';

export default class PayoutService extends AuthSchema {
	public name: string = 'payout';

	@Action({
		params: {
			userId: { type: 'string' },
			points: { type: 'number' },
			accountType: { type: 'string' },
			fundAccountId: { type: 'string', optional: true },
			name: { type: 'string', optional: true },
			ifsc: { type: 'string', optional: true },
			accountNumber: { type: 'string', optional: true },
			vpaAddress: { type: 'string', optional: true },
		},
	})
	public async requestPayout(ctx: ContextWrapper) {
		// validate points
		const userWallet: UserWallet = await PayoutDao.getGenericResource(ctx, UserWallet, {
			where: { userId: ctx.params.userId },
		});

		if (+ctx.params.points < Constants.MIN_POINTS_FOR_PAYOUT) {
			ErrorHelper.throwError(Messages.MIN_PAYOUT_POINTS, 400, Constants.SYSTEM_EXCEPTION_TYPES.VALIDATION_ERROR);
		}

		if (userWallet.rewardPoints < ctx.params.points) {
			ErrorHelper.throwError(Messages.INVALID_REWARD_POINTS, 400, Constants.SYSTEM_EXCEPTION_TYPES.VALIDATION_ERROR);
		}

		const razorpayContact: RazorpayContact = await PayoutDao.getGenericResource(ctx, RazorpayContact, { where: { userId: ctx.params.userId } });

		if (!razorpayContact) {
			ctx.broker.logger.error('PAYOUT :: RAZORPAY :: CONTACT :: NOT CREATED');
			return;
		}

		let razorpayFundAccount: RazorpayFundAccount = new RazorpayFundAccount();

		if (ctx.params.fundAccountId) {
			razorpayFundAccount = await PayoutDao.getGenericResource(ctx, RazorpayFundAccount, {
				where: {
					userId: ctx.params.userId,
					fundAccountId: ctx.params.fundAccountId,
				},
			});

			if (!razorpayFundAccount) {
				ErrorHelper.throwError('Invalid Fund account', 400, Constants.SYSTEM_EXCEPTION_TYPES.DATA_NOT_FOUND);
			}
		} else {
			// create fundAccount
			razorpayFundAccount = await ctx.call('razorpay.createRazorpayXFundAccount', {
				userId: ctx.params.userId,
				accountType: ctx.params.accountType,
				razorpayXContactId: razorpayContact.contactId,
				name: ctx.params.name || '',
				ifsc: ctx.params.ifsc || '',
				accountNumber: ctx.params.accountNumber || '',
				address: ctx.params.vpaAddress || '',
			});
		}

		// deduct wallet points
		// TODO: do it in sql function using locks
		userWallet.rewardPoints = userWallet.rewardPoints - +ctx.params.points;
		userWallet.withdrawableCash = userWallet.withdrawableCash - +ctx.params.points;
		await PayoutDao.saveGenericResource(ctx, userWallet);

		// TODO: use sql function with locks for creating and updating payout transaction
		// create payout transaction
		let newPayoutTransaction = PayoutTransactionHelper.setPayoutTransactionDetails(ctx, new PayoutTransaction());
		newPayoutTransaction = await PayoutDao.saveGenericResource(ctx, newPayoutTransaction);

		// create razorpay payout
		const razorpayPayout: RazorpayPayout = await ctx.call('razorpay.createRazorpayXPayout', {
			userId: ctx.params.userId,
			razorpayXContactId: razorpayContact.contactId,
			razorpayXFundAccountId: razorpayFundAccount.fundAccountId,
			payoutPoints: newPayoutTransaction.points,
			payoutMode: ctx.params.accountType === RazorpayXFundAccountType.BankAccount ? RazorpayPayoutModeType.NEFT : RazorpayPayoutModeType.UPI,
			transactionId: newPayoutTransaction.id,
		});

		// update and return payout transaction
		newPayoutTransaction.razorpayPayoutId = razorpayPayout.payoutId;
		newPayoutTransaction = await PayoutDao.saveGenericResource(ctx, newPayoutTransaction);

		return newPayoutTransaction;
	}

	@Action({
		params: {},
		auth: {
			ignoreAuthToken: true,
		},
	})
	public async handlePayoutTransactionWorkflow(ctx: ContextWrapper) {
		const razorpayPayout: RazorpayPayout = ctx.params.razorpayPayout;
		let payoutTransaction: PayoutTransaction = await PayoutDao.getGenericResource(ctx, PayoutTransaction, {
			where: { userId: razorpayPayout.userId, razorpayPayoutId: razorpayPayout.payoutId },
		});

		if (!payoutTransaction) {
			return;
		}

		payoutTransaction.status = razorpayPayout.status;
		payoutTransaction = await PayoutDao.saveGenericResource(ctx, payoutTransaction);

		if (
			payoutTransaction.status == RazorpayXPayoutStatusType.Cancelled ||
			payoutTransaction.status == RazorpayXPayoutStatusType.Rejected ||
			payoutTransaction.status == RazorpayXPayoutStatusType.Reversed
		) {
			// add points and cash to user wallet
			const userWallet: UserWallet = await PayoutDao.getGenericResource(ctx, UserWallet, {
				where: { userId: razorpayPayout.userId },
			});
			// TODO: do it in sql function using locks
			userWallet.rewardPoints = userWallet.rewardPoints + +payoutTransaction.points;
			userWallet.withdrawableCash = userWallet.withdrawableCash + +payoutTransaction.points;
			await PayoutDao.saveGenericResource(ctx, userWallet);
		}
	}

	@Action({
		params: {
			userId: { type: 'string' },
		},
	})
	public async getUserFundAccountInfo(ctx: ContextWrapper) {
		const razorpayFundAccount: RazorpayFundAccount = await PayoutDao.getGenericResource(ctx, RazorpayFundAccount, {
			where: {
				userId: ctx.params.userId,
			},
		});
		if (razorpayFundAccount) {
			return PayoutDto.transformResource(razorpayFundAccount, new UserFundAccountMapper());
		}
		return false
	}

	@Action({
		params: {
			userId: { type: 'string' },
		},
	})
	public async getUserPayouts(ctx: ContextWrapper) {
		return await PayoutDao.getUserPayouts(ctx);
	}

	@Action({
		params: {},
	})
	public async getAllPayouts(ctx: ContextWrapper) {
		return await PayoutDao.getAllPayouts(ctx);
	}
}

module.exports = new PayoutService();
