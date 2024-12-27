import { ContextWrapper } from '@Helpers/molecular-helper';
import { PromoCodeRedeemStatus } from '@Utility/enum';
import { BaseDao } from './base.dao';

export class PromoCodeRedeemDao extends BaseDao {
	public static async getPromoCodeRedeemsCount(ctx: ContextWrapper, promoCode: string, promoCodeId: string): Promise<any> {
		const sql: string = `select count(*) as count
												 from promo_code_redeems pcr
                         where
												 		pcr.deleted = false and
														pcr.promo_code = '${promoCode}' and
														pcr.promo_code_id = '${promoCodeId}' and
														pcr.status <> '${PromoCodeRedeemStatus.Failed}'`;
		return await this.runSqlGetCount(sql);
	}
}
