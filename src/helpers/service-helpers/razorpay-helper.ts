import { ErrorHelper } from '@Helpers/error-helper';
import { ContextWrapper } from '@Helpers/molecular-helper';
import { RazorpayPayment } from '@Models/razorpay-payment';
import { Constants } from '@Utility/constants';
import { PaymentRequestType, RazorpayPaymentStatusType, RazorpayXFundAccountType } from '@Utility/enum';
import { RazorpayUtils } from '@Utility/namespace/razorpay';
import { RazorpayXUtils } from '@Utility/namespace/razorpay-x';
import { Method } from 'moleculer-decorators';
import Razorpay from 'razorpay';
import * as Crypto from 'crypto';
import { Messages } from '@Utility/Messages';
import { RazorpayOrder } from '@Models/razorpay-order';
import Axios, { AxiosRequestConfig } from 'axios';
import { RazorpayContact } from '@Models/razorpay-contact';
import { RazorpayFundAccount } from '@Models/razorpay-fund-account';
import { RazorpayPayout } from '@Models/razorpay-payout';
const appConfig = require('../../../app-config.json');

export class RazorpayHelper {
	@Method
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	public static async getRazorpayObject(): Promise<any> {
		return new Razorpay({
			key_id: appConfig.razorpay.keyId,
			key_secret: appConfig.razorpay.keySecret,
		});
	}

	public static getRazorpayXHeaders() {
		return {
			'Content-Type': 'application/json',
			Authorization: `Basic ${Buffer.from(`${appConfig.razorpayX.keyId}:${appConfig.razorpayX.keySecret}`).toString('base64')}`,
		};
	}

	@Method
	public static getRazorpayReceipt(requestType: string, userId: string): string {
		return `MYPROF-${requestType.toUpperCase()}-${userId.toUpperCase()}`;
	}

	@Method
	public static validateRazorpaySignatureHeader(ctx: ContextWrapper, secretKey: string) {
		// create hmac
		const hmac: Crypto.Hmac = Crypto.createHmac('sha256', secretKey);
		hmac.update(JSON.stringify(ctx.params));
		const hashedRazorpaySignature: string = hmac.digest('hex');
		const incomingRazorpaySignature: string = ctx.meta.headers['x-razorpay-signature'];

		if (hashedRazorpaySignature !== incomingRazorpaySignature) {
			ErrorHelper.throwError('Invalid Signature', 400, Constants.SYSTEM_EXCEPTION_TYPES.EXTERNAL_SERVICES_ERROR);
		}
	}

	@Method
	public static async handlePaymentActivity(
		ctx: ContextWrapper,
		paymentCapturedWebhookInfo: RazorpayUtils.PaymentWebhookParams,
		razorpayPaymentInfo: RazorpayPayment,
	) {
		const requestType: PaymentRequestType = paymentCapturedWebhookInfo.payload.payment.entity.notes.requestType;
		const requestTypeId: string = paymentCapturedWebhookInfo.payload.payment.entity.notes.requestTypeId;
		const userId: number = ctx.params.userId;
		const paymentStatus: RazorpayPaymentStatusType = paymentCapturedWebhookInfo.payload.payment.entity.status;

		switch (requestType) {
			case PaymentRequestType.Package:
				await ctx.call('package.handlePackagesOnPayment', {
					packageId: requestTypeId,
					userId: userId,
					paymentStatus: paymentStatus,
					razorpayPaymentInfo: razorpayPaymentInfo,
				});
				break;
			default:
				break;
		}
	}

	@Method
	public static async handlePaymentNotification(ctx: ContextWrapper, paymentCapturedWebhookInfo: RazorpayUtils.PaymentWebhookParams) {
		const paymentStatus: RazorpayPaymentStatusType = paymentCapturedWebhookInfo.payload.payment.entity.status;
		let notificatioName: string = '';
		let content: string = '';
		switch (paymentStatus) {
			case RazorpayPaymentStatusType.Captured:
				notificatioName = Constants.NOTIFICATION_EVENTS.PAYMENT_SUCCESS;
				content = Messages.PAYMENT_SUCCESS;
				break;
			case RazorpayPaymentStatusType.Failed:
				notificatioName = Constants.NOTIFICATION_EVENTS.PAYMENT_FAILED;
				content = paymentCapturedWebhookInfo.payload.payment.entity.error_description;
				break;
			default:
				notificatioName = Constants.NOTIFICATION_EVENTS.PAYMENT_FAILED;
				break;
		}

		// TODO : send notification
	}

	@Method
	public static setOrderDetails(ctx: ContextWrapper, order: RazorpayOrder, response: RazorpayUtils.CreateOrderResponseParams): RazorpayOrder {
		order.orderId = response.id;
		order.userId = ctx.params.userId;
		order.entity = response.entity;
		order.amount = response.amount;
		order.amountPaid = response.amount_paid;
		order.amountDue = response.amount_due;
		order.currency = response.currency;
		order.receipt = response.receipt;
		order.status = response.status;
		order.notes = response.notes;
		order.attempts = response.attempts;
		order.orderCreatedAt = response.created_at;
		return order;
	}

	@Method
	public static setPaymentDetails(userId: string, payment: RazorpayPayment, response: RazorpayUtils.PaymentResponseParams) {
		payment.userId = userId;
		payment.orderId = response.order_id;
		payment.paymentId = response.id;
		payment.requestType = response.notes.requestType;
		payment.requestTypeId = response.notes.requestTypeId;
		payment.amount = response.amount;
		payment.status = response.status;
		payment.invoiceId = response.invoice_id;
		payment.method = response.method;
		payment.refundStatus = response.refund_status;
		payment.fee = response.fee;
		payment.tax = response.tax;
		payment.international = response.international;
		return payment;
	}

	@Method
	public static async razorpayX(ctx: ContextWrapper, requestType: string, method: AxiosRequestConfig['method'], body: any) {
		const razorpayXUrl: string = appConfig.razorpayX.apiUrl;
		try {
			const axiosConfig: AxiosRequestConfig = {
				url: razorpayXUrl + requestType,
				method: method,
				data: body || {},
				headers: { ...this.getRazorpayXHeaders() },
			};
			ctx.broker.logger.info('RazorpayX :: Before API call ::', JSON.stringify(axiosConfig));
			const { data: apiResponse } = await Axios({ ...axiosConfig });
			ctx.broker.logger.info('RazorpayX :: After API call ::', JSON.stringify(apiResponse));
			return apiResponse;
		} catch (err) {
			ctx.broker.logger.info('RazorpayX :: API Error ::', JSON.stringify(err));
		}
	}

	@Method
	public static setRazorpayXContactDetails(
		ctx: ContextWrapper,
		contact: RazorpayContact,
		response: RazorpayXUtils.CreateContactResponseParams,
	): RazorpayContact {
		contact.userId = ctx.params.userId;
		contact.contactId = response.id;
		contact.entity = response.entity;
		contact.name = response.name;
		contact.contact = response.contact;
		contact.email = response.email;
		contact.referenceId = response.reference_id;
		contact.batchId = response.batch_id;
		contact.active = response.active;
		contact.notes = response.notes;
		contact.contactCreatedAt = response.created_at;
		return contact;
	}

	@Method
	public static getRazorpayXFundAccountParams(ctx: ContextWrapper, fundAccount: RazorpayFundAccount | undefined = undefined) {
		let fundAccountBodyParams: RazorpayXUtils.CreateBankFundAccountRequestParams | RazorpayXUtils.CreateVpaFundAccountRequestParams;
		const accountType: RazorpayXFundAccountType = ctx.params.accountType;
		switch (accountType) {
			case RazorpayXFundAccountType.BankAccount:
				fundAccountBodyParams = {
					contact_id: ctx.params.razorpayXContactId || fundAccount?.contactId,
					account_type: RazorpayXFundAccountType.BankAccount,
					bank_account: {
						name: ctx.params.name || fundAccount?.name,
						ifsc: ctx.params.ifsc || fundAccount?.ifsc,
						account_number: ctx.params.accountNumber || fundAccount?.accountNumber,
					},
				};
				break;
			case RazorpayXFundAccountType.Vpa:
			default:
				fundAccountBodyParams = {
					contact_id: ctx.params.razorpayXContactId,
					account_type: RazorpayXFundAccountType.Vpa,
					vpa: {
						address: ctx.params.address || fundAccount?.vpaAddress,
					},
				};
				break;
		}

		return fundAccountBodyParams;
	}

	@Method
	public static setRazorpayFundAccountDetails(
		ctx: ContextWrapper,
		fundAccount: RazorpayFundAccount,
		razorpayResponse: RazorpayXUtils.CreateFundAccountResponseParams,
	) {
		fundAccount.userId = ctx.params.userId;
		fundAccount.contactId = razorpayResponse.contact_id;
		fundAccount.fundAccountId = razorpayResponse.id;
		fundAccount.accountType = razorpayResponse.account_type;
		fundAccount.entity = razorpayResponse.entity;
		fundAccount.ifsc = razorpayResponse.bank_account?.ifsc || '';
		fundAccount.bankName = razorpayResponse.bank_account?.bank_name || '';
		fundAccount.name = razorpayResponse.bank_account?.name || '';
		fundAccount.accountNumber = razorpayResponse.bank_account?.account_number || '';
		fundAccount.vpaAddress = razorpayResponse.vpa?.address || '';
		fundAccount.vpaHandle = razorpayResponse.vpa?.handle || '';
		fundAccount.vpaUserName = razorpayResponse.vpa?.username || '';
		fundAccount.batchId = razorpayResponse.batch_id;
		fundAccount.active = razorpayResponse.active;
		fundAccount.notes = razorpayResponse.bank_account?.notes;
		fundAccount.fundAccountCreatedAt = razorpayResponse.created_at;

		return fundAccount;
	}

	@Method
	public static setRazorpayPayoutDetails(
		ctx: ContextWrapper,
		razorpayPayout: RazorpayPayout,
		razorpayResponse: RazorpayXUtils.CreatePayoutResponseParams,
	) {
		razorpayPayout.userId = ctx.params.userId;
		razorpayPayout.payoutId = razorpayResponse.id;
		razorpayPayout.fundAccountId = razorpayResponse.fund_account_id;
		razorpayPayout.entity = razorpayResponse.entity;
		razorpayPayout.amount = razorpayResponse.amount;
		razorpayPayout.fees = razorpayResponse.fees;
		razorpayPayout.tax = razorpayResponse.tax;
		razorpayPayout.status = razorpayResponse.status;
		razorpayPayout.utr = razorpayResponse.utr;
		razorpayPayout.mode = razorpayResponse.mode;
		razorpayPayout.purpose = razorpayResponse.purpose;
		razorpayPayout.referenceId = razorpayResponse.reference_id;
		razorpayPayout.narration = razorpayResponse.narration;
		razorpayPayout.batchId = razorpayResponse.batch_id;
		razorpayPayout.notes = razorpayResponse.notes;
		razorpayPayout.statusDetails = razorpayResponse.status_details;
		razorpayPayout.payoutCreatedAt = razorpayResponse.created_at;

		return razorpayPayout;
	}
}
