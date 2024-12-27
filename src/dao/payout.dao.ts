import { ContextWrapper } from '@Helpers/molecular-helper';
import SystemHelper from '@Helpers/system-helpers';
import { PagedResponse } from 'src/dto/base.dto';
import { BaseDao } from './base.dao';

export class PayoutDao extends BaseDao {
	public static async getUserPayouts(ctx: ContextWrapper) {
		const { offset, limit } = SystemHelper.getOffsetAndLimit(+ctx.params.offset, +ctx.params.limit);
		const response: PagedResponse<any> = new PagedResponse();
		const sql: string = `select
                          rp.payout_created_at as payoutRequestedAt,
                          pt.user_id as userId ,
                          pt.points,
                          pt.amount,
                          pt.status as payoutStatus,
                          rp.mode,
                          pt.id as payoutId
                        from payout_transactions pt
                        join razorpay_payouts rp on rp.reference_id = pt.id
                        where
                          pt.user_id = '${ctx.params.userId}' and
                          pt.deleted = false
                        order by pt.updated_at desc
                        limit ${limit} offset ${offset}`;
		response.items = await this.runSql(sql);

		const countSql: string = `select count(*) as count
														 from payout_transactions pt
                             join razorpay_payouts rp on rp.reference_id = pt.id
                             where
                              pt.user_id = '${ctx.params.userId}' and
                              pt.deleted = false`;
		response.totalCount = await this.runSqlGetCount(countSql);
		return response;
	}

	public static async getAllPayouts(ctx: ContextWrapper) {
		const { offset, limit } = SystemHelper.getOffsetAndLimit(+ctx.params.offset, +ctx.params.limit);
		const response: PagedResponse<any> = new PagedResponse();
    const sql: string = `select
                          pt.user_id as userId,
                          u.email as userEmail,
                          u.first_name as userFirstName,
                          u.last_name as userLastName,
                          pt.id as payoutId,
                          rp.payout_id as razorpayPayoutId,
                          rp.payout_created_at as payoutRequestedAt,
                          pt.points,
                          pt.amount,
                          rp.fees,
                          rp.tax ,
                          pt.status as payoutStatus,
                          rp.mode,
                          rp.fund_account_id as userFundAccountId,
                          rp.status as razorpayPayoutStatus,
                          rfa.account_number,
                          rfa.bank_name,
                          rfa.account_type,
                          rfa.bank_name,
                          rfa.vpa_address,
                          rfa.vpa_handle ,
                          rfa.vpa_username
                        from payout_transactions pt
                        join razorpay_payouts rp on rp.reference_id = pt.id and rp.deleted = false
                        join users u on u.id = pt.user_id and u.deleted = false
                        join razorpay_fund_accounts rfa on rfa.fund_account_id = rp.fund_account_id and rfa.deleted = false
                        where
                          pt.deleted = false
                        limit ${limit} offset ${offset}`;
		response.items = await this.runSql(sql);

		const countSql: string = `select count(*) as count
														 from payout_transactions pt
                             join razorpay_payouts rp on rp.reference_id = pt.id and rp.deleted = false
                             join users u on u.id = pt.user_id and u.deleted = false
                             join razorpay_fund_accounts rfa on rfa.fund_account_id = rp.fund_account_id and rfa.deleted = false
                            where
                              pt.deleted = false`;
		response.totalCount = await this.runSqlGetCount(countSql);
		return response;
	}
}
