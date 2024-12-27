import { NotificationDao } from '@Dao/notification.dao';
import { ErrorHelper } from '@Helpers/error-helper';
import { ContextWrapper } from '@Helpers/molecular-helper';
import { NotificationHelper } from '@Helpers/service-helpers/notification.helper';
import { Notification } from '@Models/notification';
import { Constants } from '@Utility/constants';
import { Messages } from '@Utility/Messages';
import { Action } from 'moleculer-decorators';
import { PagedResponse } from 'src/dto/base.dto';
import { NotificationDto, NotificationMapper } from 'src/dto/notification.dto';
import AuthSchema from './auth';
import { NotificationTypeEnum, PushNotificationType } from '@Utility/enum';
import async from 'async';
import { FirebaseNotificationLog } from '@Models/firebase-notification-log';
const FCM = require('fcm-node');
const appConfig = require('../app-config.json');
const fcm = new FCM(appConfig.firebase.serverKey);

export default class NotificationService extends AuthSchema {
	public name: string = 'notification';

	@Action({
		params: {
			...Constants.DEFAULT_PAGINATION_PARAMS,
		},
	})
	public async getNotifications(ctx: ContextWrapper): Promise<PagedResponse<NotificationMapper>> {
		const notifications = await NotificationDao.getNotifications(ctx);
		notifications.items = NotificationDto.transformResources(notifications.items, new NotificationMapper());
		return notifications;
	}

	@Action({
		params: {
			title: { type: 'string' },
			body: { type: 'string' },
			data: { type: 'string' },
			type: { type: 'string' },
			announcementId: { type: 'string', optional: true },
			userId: { type: 'string' },
		},
		auth: {
			ignoreAuthToken: true,
		},
	})
	public async createNotification(ctx: ContextWrapper): Promise<NotificationMapper> {
		let newNotification = await NotificationHelper.setNotificationDetails(ctx, new Notification());
		newNotification = await NotificationDao.saveGenericResource(ctx, newNotification);

		//TODO: do when firebase and mobile configuration is done
		// await ctx.call('notification.sendNotification', ctx.params);
		return NotificationDto.transformResource(newNotification, new NotificationMapper());
	}

	@Action({
		params: {
			notificationId: { type: 'string' },
		},
	})
	public async updateNotification(ctx: ContextWrapper): Promise<NotificationMapper> {
		let notification: Notification = await NotificationDao.getGenericResource(ctx, Notification, { where: { id: ctx.params.notificationId } });

		if (!notification) {
			ErrorHelper.throwError(Messages.INVALID_NOTIFICATION, 400, Constants.SYSTEM_EXCEPTION_TYPES.DATA_NOT_FOUND);
		}
		ctx.params.isRead = true;
		notification = await NotificationHelper.setNotificationDetails(ctx, notification);
		notification = await NotificationDao.saveGenericResource(ctx, notification);
		return NotificationDto.transformResource(notification, new NotificationMapper());
	}

	@Action({
		params: {
			notificationId: { type: 'string' },
		},
	})
	public async deleteNotification(ctx: ContextWrapper): Promise<boolean> {
		const notification: Notification = await NotificationDao.getGenericResource(ctx, Notification, { where: { id: ctx.params.notificationId } });

		if (!notification) {
			ErrorHelper.throwError(Messages.INVALID_NOTIFICATION, 400, Constants.SYSTEM_EXCEPTION_TYPES.DATA_NOT_FOUND);
		}

		await NotificationDao.softDeleteResource(ctx, notification);
		return true;
	}

	@Action({
		params: {},
		auth: {
			ignoreAuthToken: true,
		},
	})
	public async sendNotificationLegacy(ctx: ContextWrapper): Promise<boolean> {
		const message = {
			to: ctx.params.deviceToken,
			notification: {
				title: ctx.params.title,
				body: ctx.params.title,
				icon: 'https://angularfirebase.com/images/logo.png',
				sound: 'default',
				vibrate: 'true',
				click_action: 'https://test.com/',
			},
			data: {
				//you can send only notification or only data(or include both)
				my_key: 'my value',
				my_another_key: 'my another value',
			},
		};

		fcm.send(message, function (err, response) {
			if (err) {
				ctx.broker.logger.error('Failed to send Notification', err);
			} else {
				ctx.broker.logger.info('Successfully sent Notification', response);
			}
		});

		return true;
	}

	@Action({
		params: {
			title: { type: 'string' },
			body: { type: 'string' },
			universityId: { type: 'string' },
			collegeId: { type: 'string', optional: true },
			semesterId: { type: 'string', optional: true },
			branchId: { type: 'string', optional: true },
			sectionId: { type: 'string', optional: true },
		},
		auth: {
			ignoreAuthToken: true,
		},
	})
	public async createCustomNotification(ctx: ContextWrapper) {
		const userSessionsInfo = await NotificationDao.getUserDeviceTokens(ctx);

		if (!userSessionsInfo.length) {
			return false;
		}

		ctx.broadcast('notification.send', { userSessionsInfo: userSessionsInfo, title: ctx.params.title, body: ctx.params.body });

		return true;
	}

	@Action({
		params: {
			email: { type: 'string' },
			title: { type: 'string' },
			body: { type: 'string' },
		},
		auth: {
			ignoreAuthToken: true,
		},
	})
	public async mockCreateCustomNotification(ctx: ContextWrapper) {
		const userSessionsInfo = await NotificationDao.getUserSession(ctx);

		if (!userSessionsInfo.length) {
			return false;
		}

		ctx.broadcast('notification.send', { userSessionsInfo: userSessionsInfo, title: ctx.params.title, body: ctx.params.body });

		return true;
	}

	@Action({
		auth: {
			ignoreAuthToken: true,
		},
	})
	public async getNotificationLogs(ctx: ContextWrapper) {
		return await NotificationDao.getNotificationLogs(ctx);
	}

	@Action({
		params: {},
		auth: {
			ignoreAuthToken: true,
		},
	})
	public async processNotifications(ctx: ContextWrapper) {
		const userSessionsInfo: any[] = ctx.params.userSessionsInfo;
		const uniqueUserIds: string[] = [...new Set(userSessionsInfo.map((e) => e.userId))];
		const newNotifications: Notification[] = [];

		if (!uniqueUserIds.length) {
			return;
		}

		await async.forEachLimit(uniqueUserIds, 1, async (e) => {
			ctx.params.data = '';
			ctx.params.type = NotificationTypeEnum.Notification;
			ctx.params.isRead = false;
			ctx.params.userId = e;
			const newNotification = NotificationHelper.setNotificationDetails(ctx, new Notification());
			newNotifications.push(newNotification);
		});

		// save bulk resource
		await NotificationDao.saveBulkGenericResources(ctx, Notification, newNotifications);

		const deviceTokens: string[] = [...new Set(userSessionsInfo.map((e) => e.deviceToken))];

		await NotificationHelper.sendBulkNotifications(ctx, deviceTokens, ctx.params.title, ctx.params.body, {
			notificationType: PushNotificationType.Notification,
		});
	}

	@Action({
		params: {},
		auth: {
			ignoreAuthToken: true,
		},
	})
	public async sendFirebasePushNotification(ctx: ContextWrapper) {
		await NotificationHelper.sendNotification(ctx, ctx.params.deviceToken, ctx.params.title, ctx.params.body, {
			notificationType: PushNotificationType.Notification,
			notificationId: ctx.params.notificationId,
		});
	}

	@Action({
		params: {},
		auth: {
			ignoreAuthToken: true,
		},
	})
	public async logNotificationActivity(ctx: ContextWrapper) {
		const newFireBaseLog: FirebaseNotificationLog = new FirebaseNotificationLog();
		newFireBaseLog.type = ctx.params.type;
		newFireBaseLog.additionalInfo = ctx.params.additionalInfo;
		await NotificationDao.saveGenericResource(ctx, newFireBaseLog);
	}
}

module.exports = new NotificationService();
