import { PromoCodeRedeemDao } from '@Dao/promo-code-redeem.dao';
import { ErrorHelper } from '@Helpers/error-helper';
import { ContextWrapper } from '@Helpers/molecular-helper';
import { PromoCode } from '@Models/promo-code';
import { PromoCodeRedeem } from '@Models/promo-code-redeem';
import { Constants } from '@Utility/constants';
import { PromoCodeRedeemStatus } from '@Utility/enum';
import { Messages } from '@Utility/Messages';
import { Method } from 'moleculer-decorators';
import moment from 'moment';
import { Not } from 'typeorm';

export class PromoCodeHelper {
	@Method
	public static setPromoCodeDetails(ctx: ContextWrapper, target: PromoCode): PromoCode {
		target.promoCode = ctx.params.promoCode;
		target.validFrom = ctx.params.validFrom;
		target.validTo = ctx.params.validTo;
		target.noOfAllowedUsers = ctx.params.noOfAllowedUsers;
		target.discount = ctx.params.discount;
		target.maxDiscountAmount = ctx.params.maxDiscountAmount;
		target.promoCodeType = ctx.params.promoCodeType;

		return target;
	}

	@Method
	public static async validatePromoCode(ctx: ContextWrapper, promoCodeInfo: PromoCode): Promise<boolean> {
		// check promo code validity
		const currentDate = moment(new Date()).format('YYYY-MM-DD');
		const promoCodeStartDate = moment(promoCodeInfo.validFrom).format('YYYY-MM-DD');
		const promoCodeEndDate = moment(promoCodeInfo.validTo).format('YYYY-MM-DD');
		const maximumUsage: number = promoCodeInfo.noOfAllowedUsers;

		if (currentDate > promoCodeEndDate && currentDate < promoCodeStartDate) {
			ErrorHelper.throwError(Messages.PROMO_CODE_EXPIRED, 400, Constants.SYSTEM_EXCEPTION_TYPES.VALIDATION_ERROR);
		}

		// check promo code usage w.r.t current user
		const currentUserPromoCodeRedeem: PromoCodeRedeem = await PromoCodeRedeemDao.getGenericResource(ctx, PromoCodeRedeem, {
			where: {
				promoCodeId: promoCodeInfo.id,
				promoCode: promoCodeInfo.promoCode,
				status: Not(PromoCodeRedeemStatus.Failed),
			},
		});

		if (currentUserPromoCodeRedeem) {
			ErrorHelper.throwError(Messages.PROMO_CODE_USED_BY_USER, 400, Constants.SYSTEM_EXCEPTION_TYPES.VALIDATION_ERROR);
		}

		// check promo code usage across all the users
		const currentPromoCodeUsageCount = await PromoCodeRedeemDao.getPromoCodeRedeemsCount(ctx, promoCodeInfo.promoCode, promoCodeInfo.id);

		if (currentPromoCodeUsageCount >= maximumUsage) {
			ErrorHelper.throwError(Messages.PROMO_CODE_USAGE_LIMIT, 400, Constants.SYSTEM_EXCEPTION_TYPES.VALIDATION_ERROR);
		}

		return true;
	}

	@Method
	public static setPromoCodeRedeemDetails(ctx: ContextWrapper, target: PromoCodeRedeem): PromoCodeRedeem {
		target.promoCode = ctx.params.promoCode || target.promoCode;
		target.promoCodeId = ctx.params.promoCodeId || target.promoCodeId;
		target.userId = ctx.params.userId;
		target.status = ctx.params.status || PromoCodeRedeemStatus.Pending;

		return target;
	}
}
