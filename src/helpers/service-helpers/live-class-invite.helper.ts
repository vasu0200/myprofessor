import { ContextWrapper } from '@Helpers/molecular-helper';
import { Method } from 'moleculer-decorators';
import { LiveClassInvite } from '@Models/live-class-invite';

export class LiveClassInviteHelper {
	@Method
	public static async setLiveClassInviteDetails(ctx: ContextWrapper, target: LiveClassInvite): Promise<LiveClassInvite> {
		target.liveClassId = ctx.params.liveClassId;
		target.branchId = ctx.params.branchId;
		target.sectionId = ctx.params.sectionId;

		return target;
	}
}
