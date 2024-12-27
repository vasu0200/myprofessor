import { BaseDao } from '@Dao/base.dao';
import { ErrorHelper } from '@Helpers/error-helper';
import { ContextWrapper } from '@Helpers/molecular-helper';
import { RazorpayHelper } from '@Helpers/service-helpers/razorpay-helper';
import SystemHelper from '@Helpers/system-helpers';
import { RazorpayContact } from '@Models/razorpay-contact';
import { RazorpayFundAccount } from '@Models/razorpay-fund-account';
import { RazorpayOrder } from '@Models/razorpay-order';
import { RazorpayPayment } from '@Models/razorpay-payment';
import { RazorpayPayout } from '@Models/razorpay-payout';
import { User } from '@Models/user';
import { Constants } from '@Utility/constants';
import { RazorpayXContactType, RazorpayXPayoutPurposeType } from '@Utility/enum';
import { RazorpayUtils } from '@Utility/namespace/razorpay';
import { RazorpayXUtils } from '@Utility/namespace/razorpay-x';
import { Action } from 'moleculer-decorators';
import { RazorpayDto, RazorpayOrderMapper } from 'src/dto/razorpay.dto';
import AuthSchema from './auth';
const appConfig = require('../app-config.json');

export default class RazorpayService extends AuthSchema {
	public name: string = 'razorpay';

	@Action({
		params: {
			requestType: { type: 'string' },
			requestTypeId: { type: 'string' },
			amount: { type: 'number' },
			userId: { type: 'string' },
		},
		auth: {
			ignoreAuthToken: true,
		},
	})
	public async createOrder(ctx: ContextWrapper): Promise<RazorpayOrderMapper> {
		const razorpay = await RazorpayHelper.getRazorpayObject();
		const orderOptions: RazorpayUtils.CreateOrderRequestParams = {
			amount: Math.floor(+ctx.params.amount * 100),
			currency: Constants.RAZORPAY_BASE_CURRENCY,
			receipt: 'R-' + SystemHelper.getUUID(),
			// RazorpayHelper.getRazorpayReceipt(ctx.params.requestType, ctx.params.userId),
			notes: {
				requesterId: ctx.params.userId,
				requestType: ctx.params.requestType,
				requestTypeId: ctx.params.requestTypeId,
			},
		};
		let order: RazorpayOrder = new RazorpayOrder();
		try {
			const response: RazorpayUtils.CreateOrderResponseParams = await razorpay.orders.create(orderOptions);
			order = RazorpayHelper.setOrderDetails(ctx, order, response);
		} catch (err) {
			const razorpayErrorInfo = err as RazorpayUtils.ErrorResponse;
			ErrorHelper.throwError(razorpayErrorInfo.error.description, 400, Constants.SYSTEM_EXCEPTION_TYPES.EXTERNAL_SERVICES_ERROR);
		}
		// TODO: create a wrapper to send data to client
		order = await BaseDao.saveGenericResource(ctx, order);
		return RazorpayDto.transformResource(order, new RazorpayOrderMapper());
	}

	@Action({
		params: {},
		auth: {
			ignoreAuthToken: true,
		},
	})
	public async capturePaymentWebHooks(ctx: ContextWrapper) {
		await ctx.broadcast('razorpay.capturePaymentWebHook', { ...ctx.params });
		return true;
	}

	@Action({
		params: {},
		auth: {
			ignoreAuthToken: true,
		},
	})
	public async capturePaymentWebHooksEvent(ctx: ContextWrapper) {
		const paymentCapturedWebhookInfo = ctx.params as RazorpayUtils.PaymentWebhookParams;
		const userId: string = paymentCapturedWebhookInfo.payload.payment.entity.notes.requesterId || '';

		// set user meta info
		ctx.params.userId = userId;

		// validate signature header
		const verifyPaymentHookSecretKey: string = appConfig.razorpay.paymentCaptureWebHookKey || '';
		// RazorpayHelper.validateRazorpaySignatureHeader(ctx, verifyPaymentHookSecretKey);

		// validate orderId
		const razorpayOrder: RazorpayOrder = await BaseDao.getGenericResource(ctx, RazorpayOrder, {
			where: { orderId: paymentCapturedWebhookInfo.payload.payment.entity.order_id },
		});

		if (!razorpayOrder) {
			return false;
		}

		// check if Razorpay paymentInfo exist
		let razorpayPaymentInfo: RazorpayPayment = await BaseDao.getGenericResource(ctx, RazorpayPayment, {
			where: { userId: userId, orderId: paymentCapturedWebhookInfo.payload.payment.entity.order_id },
		});

		razorpayPaymentInfo = razorpayPaymentInfo ? razorpayPaymentInfo : new RazorpayPayment();

		// set payment details
		razorpayPaymentInfo = RazorpayHelper.setPaymentDetails(userId, razorpayPaymentInfo, paymentCapturedWebhookInfo.payload.payment.entity);
		razorpayPaymentInfo = await BaseDao.saveGenericResource(ctx, razorpayPaymentInfo);

		// TODO: send notification to user
		// await RazorpayHelper.handlePaymentNotification(ctx, paymentCapturedWebhookInfo);

		// handle events that needs to occur post payment
		await RazorpayHelper.handlePaymentActivity(ctx, paymentCapturedWebhookInfo, razorpayPaymentInfo);

		return razorpayPaymentInfo;
	}

	@Action({
		params: {},
		auth: {
			ignoreAuthToken: true,
		},
	})
	public async captureOrderWebHooks(ctx: ContextWrapper) {
		await ctx.broadcast('razorpay.captureOrderWebHook', { ...ctx.params });
		return true;
	}

	@Action({
		params: {},
		auth: {
			ignoreAuthToken: true,
		},
	})
	public async captureOrderWebHooksEvent(ctx: ContextWrapper) {
		const orderCapturedWebhookInfo = ctx.params as RazorpayUtils.OrderWebhookParams;
		const userId: string = orderCapturedWebhookInfo.payload.payment.entity.notes.requesterId || '';

		// set meta info
		ctx.params.userId = userId;

		// validate signature header
		const verifyOrderWebHookSecretKey: string = appConfig.razorpay.orderCaptureWebHookKey || '';
		// RazorpayHelper.validateRazorpaySignatureHeader(ctx, verifyOrderWebHookSecretKey);

		//get order
		const order: RazorpayOrder = await BaseDao.getGenericResource(ctx, RazorpayOrder, {
			where: { orderId: orderCapturedWebhookInfo.payload.order.entity.id },
		});

		if (order) {
			order.status = orderCapturedWebhookInfo.payload.order.entity.status;
			await BaseDao.saveGenericResource(ctx, order);
		}

		return order;
	}

	@Action({
		params: {
			orderId: { type: 'string' },
		},
	})
	public async getOrder(ctx: ContextWrapper): Promise<RazorpayUtils.CreateOrderResponseParams> {
		const orderId: string = ctx.params.orderId;
		const razorpay = await RazorpayHelper.getRazorpayObject();
		const response: RazorpayUtils.CreateOrderResponseParams = await razorpay.orders.fetch(orderId);
		return response;
	}

	@Action({
		params: {
			userId: { type: 'string' },
		},
	})
	public async getrazorpayXContact(ctx: ContextWrapper) {
		const razorpayContact: RazorpayContact = await BaseDao.getGenericResource(ctx, RazorpayContact, {
			where: {
				userId: ctx.params.userId,
			},
		});

		return razorpayContact;
	}

	@Action({
		params: {
			userId: { type: 'string' },
		},
		auth: {
			ignoreAuthToken: true,
		},
	})
	public async handleRazorpayXPayoutPrequisites(ctx: ContextWrapper) {
		// check razorpayContact
		const razorpayContact: RazorpayContact = await BaseDao.getGenericResource(ctx, RazorpayContact, {
			where: {
				userId: ctx.params.userId,
				referenceId: ctx.params.userId,
			},
		});

		if (razorpayContact) {
			return;
		}

		const user: User = await BaseDao.getGenericResource(ctx, User, { where: { id: ctx.params.userId } });
		const razorpayContactResponse: RazorpayContact = await ctx.call('razorpay.createRazorpayXContact', {
			email: user.email,
			name: (user.firstName || '') + user.lastName,
			contact: user.mobileNumber,
			type: RazorpayXContactType.Customer,
			referenceId: ctx.params.userId,
			userId: ctx.params.userId,
		});

		return razorpayContactResponse;
	}

	@Action({
		params: {
			email: { type: 'string' },
			name: { type: 'string' },
			contact: { type: 'string' },
			type: { type: 'string' },
			referenceId: { type: 'string' },
			userId: { type: 'string' },
		},
		auth: {
			ignoreAuthToken: true,
		},
	})
	public async createRazorpayXContact(ctx: ContextWrapper): Promise<RazorpayContact> {
		const bodyParams: RazorpayXUtils.CreateContactRequestParams = {
			name: ctx.params.name,
			email: ctx.params.email,
			contact: ctx.params.contact,
			type: ctx.params.type,
			notes: {},
			reference_id: ctx.params.referenceId,
		};

		const razorpayContactResponse = (await RazorpayHelper.razorpayX(ctx, 'contacts', 'POST', {
			...bodyParams,
		})) as RazorpayXUtils.CreateContactResponseParams;

		// create razorpaycontactAccount
		let newContact = RazorpayHelper.setRazorpayXContactDetails(ctx, new RazorpayContact(), razorpayContactResponse);
		newContact = await BaseDao.saveGenericResource(ctx, newContact);

		return newContact;
	}

	@Action({
		params: {
			userId: { type: 'string' },
			name: { type: 'string' },
			contact: { type: 'string' },
		},
	})
	public async updateRazorpayXContact(ctx: ContextWrapper): Promise<RazorpayContact | boolean> {
		const razorpayContact: RazorpayContact = await BaseDao.getGenericResource(ctx, RazorpayContact, {
			where: {
				userId: ctx.params.userId,
				referenceId: ctx.params.userId,
			},
		});

		if (!razorpayContact) {
			return false;
		}

		const bodyParams: RazorpayXUtils.CreateContactRequestParams = {
			name: ctx.params.name || razorpayContact.name,
			email: ctx.params.email || razorpayContact.email,
			contact: ctx.params.contact || razorpayContact.contact,
			type: ctx.params.type || razorpayContact.type,
			notes: {},
			reference_id: ctx.params.referenceId || razorpayContact.referenceId,
		};

		const razorpayContactResponse = await RazorpayHelper.razorpayX(ctx, `contacts/${razorpayContact.contactId}`, 'POST', { ...bodyParams });

		// create razorpaycontactAccount
		let contact = RazorpayHelper.setRazorpayXContactDetails(ctx, razorpayContact, razorpayContactResponse);
		contact = await BaseDao.saveGenericResource(ctx, contact);

		return contact;
	}

	@Action({
		params: {
			userId: { type: 'string' },
			accountType: { type: 'string' },
			razorpayXContactId: { type: 'string' },
			name: { type: 'string', optional: true },
			ifsc: { type: 'string', optional: true },
			accountNumber: { type: 'string', optional: true },
			address: { type: 'string', optional: true },
		},
		auth: {
			ignoreAuthToken: true,
		},
	})
	public async createRazorpayXFundAccount(ctx: ContextWrapper): Promise<RazorpayFundAccount> {
		const razorpayFundAccount: RazorpayFundAccount = await BaseDao.getGenericResource(ctx, RazorpayFundAccount, {
			where: {
				userId: ctx.params.userId,
				contactId: ctx.params.razorpayXContactId,
			},
		});

		if (razorpayFundAccount) {
			return razorpayFundAccount;
		}

		const fundAccountBodyParams = RazorpayHelper.getRazorpayXFundAccountParams(ctx);

		const razorpayFundAccountResponse = (await RazorpayHelper.razorpayX(ctx, 'fund_accounts', 'POST', {
			...fundAccountBodyParams,
		})) as RazorpayXUtils.CreateFundAccountResponseParams;

		// create razorpayFundAccount
		let newFundAccount = RazorpayHelper.setRazorpayFundAccountDetails(ctx, new RazorpayFundAccount(), razorpayFundAccountResponse);
		newFundAccount = await BaseDao.saveGenericResource(ctx, newFundAccount);

		return newFundAccount;
	}

	@Action({
		params: {
			userId: { type: 'string' },
			accountType: { type: 'string' },
			razorpayXContactId: { type: 'string' },
			name: { type: 'string', optional: true },
			ifsc: { type: 'string', optional: true },
			accountNumber: { type: 'string', optional: true },
			address: { type: 'string', optional: true },
		},
	})
	public async updateRazorpayXFundAccount(ctx: ContextWrapper): Promise<RazorpayFundAccount> {
		const razorpayFundAccount: RazorpayFundAccount = await BaseDao.getGenericResource(ctx, RazorpayFundAccount, {
			where: {
				userId: ctx.params.userId,
			},
		});

		if (!razorpayFundAccount) {
			ErrorHelper.throwError('Invalid Fund account', 400, Constants.SYSTEM_EXCEPTION_TYPES.DATA_NOT_FOUND);
		}

		const fundAccountBodyParams = RazorpayHelper.getRazorpayXFundAccountParams(ctx, razorpayFundAccount);

		const razorpayFundAccountResponse = await RazorpayHelper.razorpayX(ctx, `fund_accounts/${razorpayFundAccount.fundAccountId}`, 'POST', {
			...fundAccountBodyParams,
		});

		// update razorpayFundAccount
		let fundAccount = RazorpayHelper.setRazorpayFundAccountDetails(ctx, razorpayFundAccount, razorpayFundAccountResponse);
		fundAccount = await BaseDao.saveGenericResource(ctx, fundAccount);

		return fundAccount;
	}

	@Action({
		params: {
			userId: { type: 'string' },
			razorpayXContactId: { type: 'string' },
			razorpayXFundAccountId: { type: 'string' },
			payoutPoints: { type: 'number' },
			payoutMode: { type: 'string' },
			transactionId: { type: 'string' },
		},
	})
	public async createRazorpayXPayout(ctx: ContextWrapper) {
		const accountNumber: string = appConfig.razorpayX.accountNumber;
		const payoutBodyParams: RazorpayXUtils.CreatePayoutRequestParams = {
			account_number: accountNumber,
			fund_account_id: ctx.params.razorpayXFundAccountId,
			amount: +ctx.params.payoutPoints * 100,
			currency: Constants.RAZORPAY_BASE_CURRENCY,
			mode: ctx.params.payoutMode,
			purpose: RazorpayXPayoutPurposeType.cashback,
			queue_if_low_balance: true,
			reference_id: ctx.params.transactionId,
			narration: 'Payout for cashback points',
			notes: [],
		};

		const razorpayPayoutResponse = await RazorpayHelper.razorpayX(ctx, 'payouts', 'POST', {
			...payoutBodyParams,
		});

		// create razorpay payout
		let razorpayPayout: RazorpayPayout = RazorpayHelper.setRazorpayPayoutDetails(ctx, new RazorpayPayout(), razorpayPayoutResponse);
		razorpayPayout = await BaseDao.saveGenericResource(ctx, razorpayPayout);

		return razorpayPayout;
	}

	@Action({
		params: {
			razorpayXPayoutId: { type: 'string' },
		},
	})
	public async cancelRazorpayXPayout(ctx: ContextWrapper) {
		//TODO: can cancel only payouts which are in Queued state

		let razorpayPayout: RazorpayPayout = await BaseDao.getGenericResource(ctx, RazorpayPayout, {
			where: {
				userId: ctx.params.userId,
				payoutId: ctx.params.razorpayXPayoutId,
			},
		});

		if (!razorpayPayout) {
			ErrorHelper.throwError('Invalid Payout', 400, Constants.SYSTEM_EXCEPTION_TYPES.DATA_NOT_FOUND);
		}

		const razorpayPayoutResponse = await RazorpayHelper.razorpayX(ctx, `payouts/${ctx.params.razorpayXPayoutId}`, 'POST', {});

		// update razorpay payout
		razorpayPayout = RazorpayHelper.setRazorpayPayoutDetails(ctx, new RazorpayPayout(), razorpayPayoutResponse);
		razorpayPayout = await BaseDao.saveGenericResource(ctx, razorpayPayout);

		return razorpayPayoutResponse as RazorpayXUtils.CreatePayoutResponseParams;
	}

	@Action({
		params: {
			userId: { type: 'string' },
			email: { type: 'string' },
			name: { type: 'string' },
			contact: { type: 'string' },
			payoutPoints: { type: 'number' },
		},
	})
	public async createRazorpayXPayoutLink(ctx: ContextWrapper): Promise<string> {
		const accountNumber: string = appConfig.razorpayX.accountNumber;

		// create razorpayXPayout Url
		const bodyParams: RazorpayXUtils.CreatePayoutUrlRequestParams = {
			account_number: accountNumber,
			contact: {
				name: ctx.params.name,
				email: ctx.params.email,
				contact: ctx.params.contact,
				type: RazorpayXContactType.Customer,
			},
			amount: +ctx.params.payoutPoints * 100,
			currency: Constants.RAZORPAY_BASE_CURRENCY,
			purpose: RazorpayXPayoutPurposeType.cashback,
			description: `Payout Link for ${ctx.params.name}`,
			receipt: '',
			send_sms: true,
			send_email: true,
			notes: {},
			expire_by: new Date().setMinutes(new Date().getMinutes() + 30).valueOf(),
		};

		const razorpayPayoutLinkData: RazorpayXUtils.CreatePayoutUrlResponseParams = await RazorpayHelper.razorpayX(ctx, 'payout-links', 'POST', {
			...bodyParams,
		});

		return razorpayPayoutLinkData.short_url;
	}

	@Action({
		params: {},
		auth: {
			ignoreAuthToken: true,
		},
	})
	public async capturePayoutWebhook(ctx: ContextWrapper) {
		const payoutWebhookParams = ctx.params as RazorpayXUtils.CapturePayoutWebhookParams;
		ctx.broadcast('razorpay.handlePayoutWorkflow', { ...payoutWebhookParams });
		return true;
	}

	@Action({
		params: {},
		auth: {
			ignoreAuthToken: true,
		},
	})
	public async handlePayoutWorkflow(ctx: ContextWrapper) {
		const payoutWebhookParams = ctx.params as RazorpayXUtils.CapturePayoutWebhookParams;
		const payoutParams = payoutWebhookParams.payload.payout.entity;
		let razorpayPayout: RazorpayPayout = await BaseDao.getGenericResource(ctx, RazorpayPayout, {
			where: {
				payoutId: payoutParams.id,
				fundAccountId: payoutParams.fund_account_id,
			},
		});

		if (!razorpayPayout) {
			return;
		}

		razorpayPayout.status = payoutParams.status;
		razorpayPayout.statusDetails = payoutParams.status_details;
		razorpayPayout.failureReason = payoutParams.failure_reason;
		razorpayPayout.fees = payoutParams.fees;
		razorpayPayout.tax = payoutParams.tax;
		razorpayPayout = await BaseDao.saveGenericResource(ctx, razorpayPayout);

		// update payout transaction
		await ctx.call('payout.handlePayoutTransactionWorkflow', { razorpayPayout: razorpayPayout });
	}
}

module.exports = new RazorpayService();
