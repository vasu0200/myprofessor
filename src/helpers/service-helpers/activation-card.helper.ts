import { ContextWrapper } from '@Helpers/molecular-helper';
import { ActivationCard } from '@Models/activation-card';
import { Method } from 'moleculer-decorators';

export class ActivationCardHelper {
	@Method
	public static setActivationCardDetails(ctx: ContextWrapper, target: ActivationCard): ActivationCard {
		target.channelPartnerId = ctx.params.channelPartnerId || target.channelPartnerId;
		target.activationCode = ctx.params.activationCode || target.activationCode;
		target.universityId = ctx.params.universityId || target.universityId;
		return target;
	}
}
