import { PaymentDao } from '@Dao/payment.dao';
import { ContextWrapper } from '@Helpers/molecular-helper';
import { ActivationCard } from '@Models/activation-card';
import { Package } from '@Models/package';
import { Payment } from '@Models/payment';
import { PaymentModeType, PaymentRequestType, PromoCodeRedeemStatus, UserPaymentStatusType } from '@Utility/enum';
import { Method } from 'moleculer-decorators';
import { RazorpayOrderMapper } from 'src/dto/razorpay.dto';

export class PaymentHelper {
	@Method
	public static async handlePayments(ctx: ContextWrapper, paymentType: PaymentModeType, packageInfo: Package) {
		let paymentResponse: any = {};
		switch (paymentType) {
			case PaymentModeType.ActivationCard:
				paymentResponse = await this.handlePaymentViaActivationCard(ctx, packageInfo);
				break;
			case PaymentModeType.Razorpay:
				paymentResponse = await this.handlePaymentViaRazorpay(ctx, packageInfo);
				break;
			default:
				break;
		}
		return paymentResponse;
	}

	@Method
	public static async handlePaymentViaActivationCard(ctx: ContextWrapper, packageInfo: Package) {
		// validate activation-card
		const activationCard: ActivationCard = await ctx.call('activationCard.validateActivationCardUsage', {
			userId: ctx.params.userId,
			activationCode: ctx.params.activationCode,
		});

		// set params for payment details
		ctx.params.activationCardId = activationCard.id;
		ctx.params.activationCode = activationCard.activationCode;
		ctx.params.paymentStatus = UserPaymentStatusType.Success;
		ctx.params.packageName = packageInfo.name;

		// handle payments
		let paymentInfo: Payment = this.setPaymentDetails(ctx, new Payment());
		paymentInfo = await PaymentDao.saveGenericResource(ctx, paymentInfo);

		// handle referral points
		ctx.broadcast('user.captureReferralPoints', { userId: ctx.params.userId });

		// handle user packages
		return await ctx.call('package.handleUserPackages', { userId: ctx.params.userId, activationCard: activationCard, paymentInfo: paymentInfo });
	}

	@Method
	public static async handlePaymentViaRazorpay(ctx: ContextWrapper, packageInfo: Package) {
		const razorpayOrderInfo: RazorpayOrderMapper = await ctx.call('razorpay.createOrder', {
			requestType: PaymentRequestType.Package,
			requestTypeId: packageInfo.id,
			amount: ctx.params.totalPrice,
			userId: ctx.params.userId,
		});

		// handle payments
		ctx.params.razorpayOrderId = razorpayOrderInfo.orderId;
		ctx.params.packageName = packageInfo.name;

		let paymentInfo: Payment = this.setPaymentDetails(ctx, new Payment());
		paymentInfo = await PaymentDao.saveGenericResource(ctx, paymentInfo);

		return razorpayOrderInfo;
	}

	@Method
	public static setPaymentDetails(ctx: ContextWrapper, target: Payment): Payment {
		target.userId = ctx.params.userId;
		target.packageId = ctx.params.packageId || target.packageId;
		target.packageCost = ctx.params.packageCost || target.packageCost;
		target.packageName = ctx.params.packageName || target.packageName;
		target.cgst = ctx.params.cgst || target.cgst;
		target.sgst = ctx.params.sgst || target.sgst;
		target.promoCodeId = ctx.params.promoCodeId || target.promoCodeId;
		target.promoCode = ctx.params.promoCode || target.promoCode;
		target.promoCodeAmount = ctx.params.promoCodeAmount || target.promoCodeAmount;
		target.paymentType = ctx.params.paymentType || target.paymentType;
		target.paymentStatus = ctx.params.paymentStatus || target.paymentStatus;
		target.activationCardId = ctx.params.activationCardId || target.activationCardId;
		target.activationCode = ctx.params.activationCode || target.activationCode;
		target.orderCreationId = ctx.params.orderCreationId || target.orderCreationId;
		target.razorpayPaymentId = ctx.params.razorpayPaymentId || target.razorpayPaymentId;
		target.razorpayOrderId = ctx.params.razorpayOrderId || target.razorpayOrderId;
		target.createdBy = ctx.params.createdBy;
		target.totalPrice = ctx.params.totalPrice || target.totalPrice;

		return target;
	}
}
