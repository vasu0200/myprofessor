import { ActivationCardDao } from '@Dao/activation-card.dao';
import { ContextWrapper } from '@Helpers/molecular-helper';
import { ActivationCardHelper } from '@Helpers/service-helpers/activation-card.helper';
import { ActivationCard } from '@Models/activation-card';
import { Constants } from '@Utility/constants';
import { Action } from 'moleculer-decorators';
import { PagedResponse } from 'src/dto/base.dto';
import { ActivationCardDto, ActivationCardMapper } from 'src/dto/activation-card.dto';
import AuthSchema from './auth';
import { ActivationCardStatusType, UserRoleType } from '@Utility/enum';
import async from 'async';
import { ErrorHelper } from '@Helpers/error-helper';
import { Messages } from '@Utility/Messages';

export default class ActivationCardService extends AuthSchema {
	public name: string = 'activationCard';

	@Action({
		params: {
			...Constants.DEFAULT_PAGINATION_PARAMS,
		},
		auth: {
			role: UserRoleType.SuperAdmin,
		},
	})
	public async getActivationCards(ctx: ContextWrapper): Promise<PagedResponse<ActivationCardMapper>> {
		const activationCards = await ActivationCardDao.getActivationCards(ctx);
		activationCards.items = ActivationCardDto.transformResources(activationCards.items, new ActivationCardMapper());
		return activationCards;
	}

	@Action({
		params: {
			activationCardCounts: { type: 'number' },
			channelPartnerId: { type: 'string' },
			universityId: { type: 'string' },
		},
		auth: {
			role: UserRoleType.SuperAdmin,
		},
	})
	public async createActivationCard(ctx: ContextWrapper): Promise<ActivationCardMapper[]> {
		const activationCards: ActivationCardMapper[] = [];
		const activationCardCodes: string[] = [];
		const activationCardCounts = +ctx.params.activationCardCounts;

		// generate activation codes
		for (let i = 1; i <= activationCardCounts; i++) {
			activationCardCodes.push(
				(Math.random().toString(36).substring(2).toUpperCase() + Date.now().toString(36).substring(4).toUpperCase()).slice(0, 8),
			);
		}

		await async.forEachLimit(activationCardCodes, 1, async (activationCode) => {
			ctx.params.activationCode = activationCode;
			let newActivationCard = ActivationCardHelper.setActivationCardDetails(ctx, new ActivationCard());
			newActivationCard = await ActivationCardDao.saveGenericResource(ctx, newActivationCard);
			activationCards.push(ActivationCardDto.transformResource(newActivationCard, new ActivationCardMapper()));
		});

		return activationCards;
	}

	@Action({
		params: {
			activationCardId: { type: 'string' },
		},
		auth: {
			role: UserRoleType.SuperAdmin,
		},
	})
	public async markActivationCardInactive(ctx: ContextWrapper) {
		let activationCard: ActivationCard = await ActivationCardDao.getGenericResource(ctx, ActivationCard, {
			where: {
				id: ctx.params.activationCardId,
			},
		});

		if (!activationCard) {
			ErrorHelper.throwError(Messages.INVALID_ACTIVATION_CARD, 400, Constants.SYSTEM_EXCEPTION_TYPES.DATA_NOT_FOUND);
		}

		activationCard.status = ActivationCardStatusType.InActive;
		activationCard = await ActivationCardDao.saveGenericResource(ctx, activationCard);
		return ActivationCardDto.transformResource(activationCard, new ActivationCardMapper());
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
		return await ActivationCardDao.searchActivationCards(ctx);
	}

	@Action({
		params: {
			userId: { type: 'string' },
			activationCode: { type: 'string' },
		},
		auth: {
			ignoreAuthToken: true,
		},
	})
	public async validateActivationCardUsage(ctx: ContextWrapper) {
		const activationCard: ActivationCard = await ActivationCardDao.getGenericResource(ctx, ActivationCard, {
			where: { activationCode: ctx.params.activationCode },
		});

		if (!activationCard) {
			ErrorHelper.throwError(Messages.INVALID_ACTIVATION_CARD, 400, Constants.SYSTEM_EXCEPTION_TYPES.DATA_NOT_FOUND);
		}

		if (activationCard.status == ActivationCardStatusType.Used) {
			ErrorHelper.throwError(Messages.ACTIVATION_CARD_USED_BY_USER, 400, Constants.SYSTEM_EXCEPTION_TYPES.VALIDATION_ERROR);
		}

		if (activationCard.status == ActivationCardStatusType.Expired || activationCard.status == ActivationCardStatusType.InActive) {
			ErrorHelper.throwError(Messages.ACTIVATION_CARD_EXPIRED, 400, Constants.SYSTEM_EXCEPTION_TYPES.VALIDATION_ERROR);
		}

		activationCard.redeemUserId = ctx.params.userId;
		activationCard.status = ActivationCardStatusType.Used;

		return await ActivationCardDao.saveGenericResource(ctx, activationCard);
	}
}

module.exports = new ActivationCardService();
