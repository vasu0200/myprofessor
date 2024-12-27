import { PromoCodeDao } from '@Dao/promo-code.dao';
import { ErrorHelper } from '@Helpers/error-helper';
import { ContextWrapper } from '@Helpers/molecular-helper';
import { PromoCodeHelper } from '@Helpers/service-helpers/promo-code.helper';
import { PromoCode } from '@Models/promo-code';
import { PromoCodeRedeem } from '@Models/promo-code-redeem';
import { Constants } from '@Utility/constants';
import { Messages } from '@Utility/Messages';
import { Action } from 'moleculer-decorators';
import { PagedResponse } from 'src/dto/base.dto';
import { PromoCodeDto, PromoCodeMapper } from 'src/dto/promo-code.dto';
import AuthSchema from './auth';
import { UserRoleType } from '@Utility/enum';

export default class PromoCodeService extends AuthSchema {
	public name: string = 'promoCode';

	static PROMO_CODE_PARAMS = {
		promoCode: { type: 'string' },
		validFrom: { type: 'string' },
		validTo: { type: 'string' },
		noOfAllowedUsers: { type: 'number' },
		discount: { type: 'number' },
		maxDiscountAmount: { type: 'number' },
		promoCodeType: { type: 'string' },
	};

	@Action({
		params: {
			...Constants.DEFAULT_PAGINATION_PARAMS,
		},
		auth: {
			role: UserRoleType.SuperAdmin,
		},
	})
	public async getPromoCodes(ctx: ContextWrapper): Promise<PagedResponse<PromoCodeMapper>> {
		const promoCodes = await PromoCodeDao.getPromoCodes(ctx);
		promoCodes.items = PromoCodeDto.transformResources(promoCodes.items, new PromoCodeMapper());
		return promoCodes;
	}

	@Action({
		params: {
			promoCodeId: { type: 'string' },
		},
		auth: {
			role: UserRoleType.SuperAdmin,
		},
	})
	public async getPromoCodeById(ctx: ContextWrapper): Promise<PromoCodeMapper> {
		const promoCode: PromoCode = await PromoCodeDao.getGenericResource(ctx, PromoCode, { where: { id: ctx.params.promoCodeId } });

		if (!promoCode) {
			ErrorHelper.throwError(Messages.INVALID_PROMO_CODE, 400, Constants.SYSTEM_EXCEPTION_TYPES.DATA_NOT_FOUND);
		}
		return PromoCodeDto.transformResource(promoCode, new PromoCodeMapper());
	}

	@Action({
		params: {
			...PromoCodeService.PROMO_CODE_PARAMS,
		},
		auth: {
			role: UserRoleType.SuperAdmin,
		},
	})
	public async createPromoCode(ctx: ContextWrapper): Promise<PromoCodeMapper> {
		//TODO: validate promoCode
		let newPromoCode = PromoCodeHelper.setPromoCodeDetails(ctx, new PromoCode());
		newPromoCode = await PromoCodeDao.saveGenericResource(ctx, newPromoCode);
		return PromoCodeDto.transformResource(newPromoCode, new PromoCodeMapper());
	}

	@Action({
		params: {
			...PromoCodeService.PROMO_CODE_PARAMS,
		},
		auth: {
			role: UserRoleType.SuperAdmin,
		},
	})
	public async updatePromoCode(ctx: ContextWrapper): Promise<PromoCodeMapper> {
		let promoCodeData: PromoCode = await PromoCodeDao.getGenericResource(ctx, PromoCode, { where: { id: ctx.params.promoCodeId } });

		if (!promoCodeData) {
			ErrorHelper.throwError(Messages.INVALID_PROMO_CODE, 400, Constants.SYSTEM_EXCEPTION_TYPES.DATA_NOT_FOUND);
		}

		promoCodeData = PromoCodeHelper.setPromoCodeDetails(ctx, promoCodeData);
		promoCodeData = await PromoCodeDao.saveGenericResource(ctx, promoCodeData);
		return PromoCodeDto.transformResource(promoCodeData, new PromoCodeMapper());
	}

	@Action({
		params: {
			promoCodeId: { type: 'string' },
		},
		auth: {
			role: UserRoleType.SuperAdmin,
		},
	})
	public async deletePromoCode(ctx: ContextWrapper): Promise<boolean> {
		const promoCodeData: PromoCode = await PromoCodeDao.getGenericResource(ctx, PromoCode, { where: { id: ctx.params.promoCodeId } });

		if (!promoCodeData) {
			ErrorHelper.throwError(Messages.INVALID_PROMO_CODE, 400, Constants.SYSTEM_EXCEPTION_TYPES.DATA_NOT_FOUND);
		}

		await PromoCodeDao.softDeleteResource(ctx, promoCodeData);
		return true;
	}

	@Action({
		params: {
			searchValue: { type: 'string' },
		},
		auth: {
			role: UserRoleType.SuperAdmin,
		},
	})
	public async search(ctx: ContextWrapper) {
		return await PromoCodeDao.searchPromoCodes(ctx);
	}

	@Action({
		params: {
			promoCode: { type: 'string' },
			userId: { type: 'string' },
		},
	})
	public async validatePromoCodeUsage(ctx: ContextWrapper): Promise<PromoCodeMapper> {
		const promoCodeData: PromoCode = await PromoCodeDao.getGenericResource(
			ctx,
			PromoCode,
			{ where: { promoCode: ctx.params.promoCode } }
		);

		if (!promoCodeData) {
			ErrorHelper.throwError(Messages.INVALID_PROMO_CODE, 400, Constants.SYSTEM_EXCEPTION_TYPES.DATA_NOT_FOUND);
		}

		const currentDate = new Date();
		const validToDate = new Date(promoCodeData.validTo);

		if (currentDate > validToDate) {
			ErrorHelper.throwError(Messages.EXPIRED_PROMO_CODE, 400, Constants.SYSTEM_EXCEPTION_TYPES.DATA_NOT_FOUND);
		}

		const validPromoCode = await PromoCodeHelper.validatePromoCode(ctx, promoCodeData);

		if (!validPromoCode) {
			ErrorHelper.throwError(Messages.INVALID_PROMO_CODE, 400, Constants.SYSTEM_EXCEPTION_TYPES.DATA_NOT_FOUND);
		}

		return PromoCodeDto.transformResource(promoCodeData, new PromoCodeMapper());
	}


	@Action({
		params: {
			promoCodeId: { type: 'string' },
			promoCode: { type: 'string' },
			userId: { type: 'string' },
			status: { type: 'string' },
		},
		auth: {
			ignoreAuthToken: true,
		},
	})
	public async redeemUserPromoCode(ctx: ContextWrapper) {
		let promoCodeRedeem: PromoCodeRedeem = await PromoCodeDao.getGenericResource(ctx, PromoCodeRedeem, {
			where: {
				promoCode: ctx.params.promoCode,
				promoCodeId: ctx.params.promoCodeId,
				userId: ctx.params.userId,
			},
		});

		promoCodeRedeem = PromoCodeHelper.setPromoCodeRedeemDetails(ctx, promoCodeRedeem ? promoCodeRedeem : new PromoCodeRedeem());
		await PromoCodeDao.saveGenericResource(ctx, promoCodeRedeem);
	}
}

module.exports = new PromoCodeService();
