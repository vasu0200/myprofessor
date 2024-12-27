import { ContextWrapper } from '@Helpers/molecular-helper';
import { PayoutTransaction } from '@Models/payout-transaction';
import { RazorpayXPayoutStatusType } from '@Utility/enum';
import { Method } from 'moleculer-decorators';

export class PayoutTransactionHelper {
	@Method
	public static setPayoutTransactionDetails(ctx: ContextWrapper, payoutTransaction: PayoutTransaction) {
		payoutTransaction.userId = ctx.params.userId;
		payoutTransaction.amount = +ctx.params.points * 100;
		payoutTransaction.points = +ctx.params.points;
		payoutTransaction.razorpayPayoutId = '';
		payoutTransaction.status = RazorpayXPayoutStatusType.Pending;
		return payoutTransaction;
	}
}
