import { ContextWrapper } from '@Helpers/molecular-helper';
import SystemHelper from '@Helpers/system-helpers';
import { PagedResponse } from 'src/dto/base.dto';
import { BaseDao } from './base.dao';

export class PromoCodeDao extends BaseDao {
	public static async getPromoCodes(ctx: ContextWrapper): Promise<PagedResponse<any>> {
		const { offset, limit } = SystemHelper.getOffsetAndLimit(+ctx.params.offset, +ctx.params.limit);
		const response: PagedResponse<any> = new PagedResponse();
		const sql: string = `select
														pc.id,
														pc.promo_code as promoCode,
														pc.valid_from as validFrom,
														pc.valid_to as validTo,
														pc.no_of_allowed_users as noOfAllowedUsers,
														pc.discount,
														pc.max_discount_amount as maxDiscountAmount,
														pc.promo_code_type as promoCodeType
												 from promo_codes pc
                         where pc.deleted = false
												 order by pc.id desc
                         limit ${limit} offset ${offset}`;
		response.items = await this.runSql(sql);

		const countSql: string = `select count(*) as count
														 from promo_codes pc
														 where pc.deleted = false`;
		response.totalCount = await this.runSqlGetCount(countSql);
		return response;
	}

	public static async searchPromoCodes(ctx: ContextWrapper): Promise<PagedResponse<any>> {
		const { offset, limit } = SystemHelper.getOffsetAndLimit(+ctx.params.offset, +ctx.params.limit);
		const searchValue: string = ctx.params.searchValue;
		const response: PagedResponse<any> = new PagedResponse();
		const filterSql: string = ctx.params.searchValue
			? `and (
				 pc.promo_code like '%${searchValue}%' or
				 pc.no_of_allowed_users like '%${searchValue}%' or
				 pc.discount like '%${searchValue}%' or
				 pc.max_discount_amount like '%${searchValue}%' or
				 pc.promo_code_type like '%${searchValue}%'
				 )`
			: '';
		const baseSql: string = `select
															pc.id,
															pc.promo_code as promoCode,
															pc.valid_from as validFrom,
															pc.valid_to as validTo,
															pc.no_of_allowed_users as noOfAllowedUsers,
															pc.discount,
															pc.max_discount_amount as maxDiscountAmount,
															pc.promo_code_type as promoCodeType
														from promo_codes pc
														where pc.deleted = false ${filterSql}`;

		const sql: string = `${baseSql}
												 order by pc.created_at desc
                         limit ${limit} offset ${offset}`;

		response.items = await this.runSql(sql);

		const countSql: string = `select count(*) as count
														 from promo_codes pc
														 where pc.deleted = false ${filterSql}`;
		response.totalCount = await this.runSqlGetCount(countSql);
		return response;
	}
}
