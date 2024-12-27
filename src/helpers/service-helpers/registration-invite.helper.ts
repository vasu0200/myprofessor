import { ContextWrapper } from '@Helpers/molecular-helper';
import { RegistrationInvite } from '@Models/registration-invite';
import { RegistrationInviteStatusType } from '@Utility/enum';
import { Method } from 'moleculer-decorators';

export class RegistrationInviteHelper {
	@Method
	public static setInviteDetails(ctx: ContextWrapper, registrationInvite: RegistrationInvite, inviterId: string): RegistrationInvite {
		registrationInvite.inviteCode = ctx.params.inviteCode || registrationInvite.inviteCode;
		registrationInvite.userId = ctx.params.userId || registrationInvite.userId;
		registrationInvite.inviterId = ctx.params.inviterId || inviterId;
		registrationInvite.registrationStatus = ctx.params.registrationStatus || RegistrationInviteStatusType.Sent;

		return registrationInvite;
	}
}
