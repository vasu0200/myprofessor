import { PaymentDao } from '@Dao/payment.dao';
import { ErrorHelper } from '@Helpers/error-helper';
import { ContextWrapper } from '@Helpers/molecular-helper';
import { PaymentHelper } from '@Helpers/service-helpers/payment-helper';
import { Package } from '@Models/package';
import { Payment } from '@Models/payment';
import { RazorpayPayment } from '@Models/razorpay-payment';
import { Constants } from '@Utility/constants';
import { PaymentModeType, RazorpayPaymentStatusType, UserPaymentStatusType } from '@Utility/enum';
import { Messages } from '@Utility/Messages';
import { Action } from 'moleculer-decorators';
import AuthSchema from './auth';

export default class PaymentService extends AuthSchema {
	public name: string = 'payment';

	@Action({
		params: {
			packageId: { type: 'string' },
			paymentType: { type: 'string' },
			activationCode: { type: 'string', optional: true },
			packageCost: { type: 'number', optional: true },
			cgst: { type: 'number', optional: true },
			sgst: { type: 'number', optional: true },
			promoCode: { type: 'string', optional: true },
			promoCodeId: { type: 'string', optional: true },
			promoCodeAmount: { type: 'number', optional: true },
			totalPrice: { type: 'number', optional: true },
		},
		auth: {
			ignoreAuthToken: true,
		},
	})
	public async initiatePayment(ctx: ContextWrapper) {
		const paymentType: PaymentModeType = ctx.params.paymentType;
		const packageInfo: Package = await PaymentDao.getGenericResource(ctx, Package, { where: { id: ctx.params.packageId } });

		if (!packageInfo) {
			ErrorHelper.throwError(Messages.INVALID_PACKAGE, 400, Constants.SYSTEM_EXCEPTION_TYPES.DATA_NOT_FOUND);
		}

		return await PaymentHelper.handlePayments(ctx, paymentType, packageInfo);
	}

	@Action({
		params: {
			packageId: { type: 'string' },
			userId: { type: 'string' },
			paymentStatus: { type: 'string' },
		},
		auth: {
			ignoreAuthToken: true,
		},
	})
	public async capturePayment(ctx: ContextWrapper) {
		const razorpayPaymentInfo: RazorpayPayment = ctx.params.razorpayPaymentInfo;
		const paymentStatus: RazorpayPaymentStatusType = ctx.params.paymentStatus;
		let paymentInfo: Payment = await PaymentDao.getGenericResource(ctx, Payment, {
			where: { userId: ctx.params.userId, packageId: ctx.params.packageId, razorpayOrderId: razorpayPaymentInfo.orderId },
		});

		switch (paymentStatus) {
			case RazorpayPaymentStatusType.Captured:
				// payment successful
				paymentInfo.paymentStatus = UserPaymentStatusType.Success;
				break;
			case RazorpayPaymentStatusType.Failed:
				paymentInfo.paymentStatus = UserPaymentStatusType.Failed;
				break;
			case RazorpayPaymentStatusType.Refunded:
				paymentInfo.paymentStatus = UserPaymentStatusType.Refund;
				break;
			case RazorpayPaymentStatusType.Attempted:
			case RazorpayPaymentStatusType.Created:
				paymentInfo.paymentStatus = UserPaymentStatusType.Initiated;
				break;
			default:
				break;
		}
		paymentInfo.razorpayPaymentId = razorpayPaymentInfo.paymentId;
		paymentInfo = await PaymentDao.saveGenericResource(ctx, paymentInfo);
		return paymentInfo;
	}

	@Action({
		params: {
			packageId: { type: 'string' },
			paymentType: { type: 'string' },
			activationCode: { type: 'string', optional: true },
			packageCost: { type: 'number', optional: true },
			cgst: { type: 'number', optional: true },
			sgst: { type: 'number', optional: true },
			promoCode: { type: 'string', optional: true },
			promoCodeId: { type: 'string', optional: true },
			promoCodeAmount: { type: 'number', optional: true },
			totalPrice: { type: 'number', optional: true },
			branchId: { type: 'string', optional: true },
		},
		auth: {
			ignoreAuthToken: true,
		},
	})
	public async initiateWebPayment(ctx: ContextWrapper) {
		const paymentType: PaymentModeType = ctx.params.paymentType;
		const packageInfo: Package = await PaymentDao.getGenericResource(ctx, Package, { where: { id: ctx.params.packageId } });

		if (!packageInfo) {
			ErrorHelper.throwError(Messages.INVALID_PACKAGE, 400, Constants.SYSTEM_EXCEPTION_TYPES.DATA_NOT_FOUND);
		}

		return await PaymentHelper.handlePayments(ctx, paymentType, packageInfo);
	}
}

module.exports = new PaymentService();
