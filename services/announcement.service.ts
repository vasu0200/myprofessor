import { AnnouncementDao } from '@Dao/announcement.dao';
import { ErrorHelper } from '@Helpers/error-helper';
import { ContextWrapper } from '@Helpers/molecular-helper';
import { AnnouncementHelper } from '@Helpers/service-helpers/announcement.helper';
import { Announcement } from '@Models/announcement';
import { Constants } from '@Utility/constants';
import { Messages } from '@Utility/Messages';
import { Action } from 'moleculer-decorators';
import { PagedResponse } from 'src/dto/base.dto';
import { AnnouncementDto, AnnouncementMapper } from 'src/dto/announcement.dto';
import AuthSchema from './auth';
import { NotificationActionType, NotificationType, NotificationTypeEnum } from '@Utility/enum';
import async from 'async';
import { User } from '@Models/user';

export default class AnnouncementService extends AuthSchema {
	public name: string = 'announcement';

	static ANNOUNCEMENT_PARAMS = {
		title: { type: 'string' },
		description: { type: 'string', optional: true },
		fromDate: { type: 'string' },
		toDate: { type: 'string' },
		sections: { type: 'array', optional: true },
		branches: { type: 'array' },
		semesters: { type: 'array', optional: true },
	};

	@Action({
		params: {
			...Constants.DEFAULT_PAGINATION_PARAMS,
		},
	})
	public async getAnnouncements(ctx: ContextWrapper): Promise<PagedResponse<AnnouncementMapper>> {
		const announcements = await AnnouncementDao.getAnnouncements(ctx);
		announcements.items = AnnouncementDto.transformResources(announcements.items, new AnnouncementMapper());
		return announcements;
	}

	@Action({
		params: {
			announcementId: { type: 'string' },
		},
	})
	public async getAnnouncement(ctx: ContextWrapper): Promise<PagedResponse<AnnouncementMapper>> {
		let announcement = await AnnouncementDao.getAnnouncement(ctx);
		announcement = AnnouncementDto.transformResources(announcement, new AnnouncementMapper());
		return announcement[0];
	}

	@Action({
		params: {
			...AnnouncementService.ANNOUNCEMENT_PARAMS,
		},
	})
	public async createAnnouncement(ctx: ContextWrapper): Promise<AnnouncementMapper> {
		let newAnnouncement = await AnnouncementHelper.setAnnouncementDetails(ctx, new Announcement());

		newAnnouncement = await AnnouncementDao.saveGenericResource(ctx, newAnnouncement);

		ctx.broadcast('announcement.send', { ...newAnnouncement });

		return AnnouncementDto.transformResource(newAnnouncement, new AnnouncementMapper());
	}

	@Action({
		params: {
			...AnnouncementService.ANNOUNCEMENT_PARAMS,
			announcementId: { type: 'string' },
		},
	})
	public async updateAnnouncement(ctx: ContextWrapper): Promise<AnnouncementMapper> {
		let announcementData: Announcement = await AnnouncementDao.getGenericResource(ctx, Announcement, { where: { id: ctx.params.announcementId } });

		if (!announcementData) {
			ErrorHelper.throwError(Messages.INVALID_ANNOUNCEMENT, 400, Constants.SYSTEM_EXCEPTION_TYPES.DATA_NOT_FOUND);
		}

		announcementData = await AnnouncementHelper.setAnnouncementDetails(ctx, announcementData);
		announcementData = await AnnouncementDao.saveGenericResource(ctx, announcementData);
		return AnnouncementDto.transformResource(announcementData, new AnnouncementMapper());
	}

	@Action({
		params: {
			announcementId: { type: 'string' },
		},
	})
	public async deleteAnnouncement(ctx: ContextWrapper): Promise<boolean> {
		const announcementData: Announcement = await AnnouncementDao.getGenericResource(ctx, Announcement, { where: { id: ctx.params.announcementId } });
		if (!announcementData) {
			ErrorHelper.throwError(Messages.INVALID_ANNOUNCEMENT, 400, Constants.SYSTEM_EXCEPTION_TYPES.DATA_NOT_FOUND);
		}

		await AnnouncementDao.softDeleteResource(ctx, announcementData);
		return true;
	}

	@Action({
		params: {},
		auth: {
			ignoreAuthToken: true,
		},
	})
	public async handleAnnouncements(ctx: ContextWrapper) {
		const announcement = ctx.params;

		// broadcast service call to create/send notifications
		const users = await AnnouncementDao.getAnnouncementUsers(ctx);

		const filteredUsers: string[] = [...new Set(users.map((e) => e.id))];

		await async.forEachLimit(filteredUsers, 1, async (userId: string) => {
			const params = {
				title: `${announcement.title}-${Messages.ANNOUNCEMENT_CREATED}`,
				body: `${announcement.description}. @${announcement.fromDate}-@${announcement.toDate}`,
				data: JSON.stringify({
					notificationAction: NotificationActionType.Create,
					notificationDescription: announcement.description,
					notificationName: announcement.title,
					notificationType: NotificationType.AnnouncementCreated,
					additionalData: {
						...announcement,
					},
				}),
				userId: userId,
				type: NotificationTypeEnum.Announcement,
				announcementId: announcement.id,
			};
			await ctx.call('notification.createNotification', params);
		});
	}
}

module.exports = new AnnouncementService();
