import { BaseDto } from './base.dto';

export class ActivationCardDto extends BaseDto {}

export class ActivationCardMapper {
	id: string;
	activationCode: string;
	channelPartnerId: string;
	channelPartnerFirstName: string;
	channelPartnerLastName: string;
	redeemUserId: string;
	redeemUserFirstName: string;
	redeemUserLastName: string;
	redeemUserEmail: string;
	redeemUserMobile: string;
	createdAt: string;
	updatedAt: string;
	boardId: string;
	boardName: string;
	gradeId: string;
	gradeName: string;
	status: string;

	constructor() {
		this.id = '';
		this.activationCode = '';
		this.channelPartnerId = '';
		this.channelPartnerFirstName = '';
		this.channelPartnerLastName = '';
		this.redeemUserId = '';
		this.redeemUserFirstName = '';
		this.redeemUserLastName = '';
		this.redeemUserEmail = '';
		this.redeemUserMobile = '';
		this.createdAt = '';
		this.updatedAt = '';
		this.boardId = '';
		this.boardName = '';
		this.gradeId = '';
		this.gradeName = '';
		this.status = '';
	}
}
