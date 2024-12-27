import { ContextWrapper } from '@Helpers/molecular-helper';
import { Notification } from '@Models/notification';
import { Method } from 'moleculer-decorators';
import admin from 'firebase-admin';
import moment from 'moment';

//TODO: get the json from app-config and prepare json file based on env
const serviceAccount = require('../../configs/qa-fire-base.json');
admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
});

export class NotificationHelper {
	@Method
	public static setNotificationDetails(ctx: ContextWrapper, target: Notification) {
		target.title = ctx.params.title;
		target.body = ctx.params.body;
		target.data = ctx.params.data;
		target.type = ctx.params.type;
		target.isRead = ctx.params.isRead;
		target.userId = ctx.params.userId;
		target.announcementId = ctx.params.announcementId || '';

		return target;
	}

	@Method
	public static async sendNotification(
		ctx: ContextWrapper,
		deviceToken: string,
		title: string,
		body: string,
		additionalData: any = {},
		// imageUrl: string = '',
	) {
		if (!deviceToken) {
			return;
		}

		admin
			.messaging()
			.send({
				notification: {
					title: title,
					// imageUrl: imageUrl,
					body: body,
				},
				// condition: '',
				token: deviceToken,
				// topic: '',
				android: {
					// collapseKey: '',
					priority: 'high',
					ttl: 100,
					data: additionalData,
					notification: {
						title: title,
						body: body,
						icon: '',
						color: '#D43333', // Notification icon color
						sound: '',
						tag: '',
						// imageUrl: imageUrl,
						clickAction: '',
						sticky: false,
						eventTimestamp: new Date(),
						priority: 'high',
						// vibrateTimingsMillis: [],
						defaultVibrateTimings: true,
						defaultSound: true,
						lightSettings: { color: '#D433B4', lightOnDurationMillis: 200, lightOffDurationMillis: 100 },
						defaultLightSettings: true,
						visibility: 'private',
					},
				},
				webpush: {
					headers: {}, // supported headers
					data: additionalData,
					notification: {
						title: title,
						actions: [{ action: '', icon: '', title: '' }],
						badge: '',
						body: body,
						data: additionalData,
						dir: 'auto' || 'ltr' || 'rtl',
						icon: '',
						// image: imageUrl,
						renotify: false,
						requireInteraction: false,
						silent: false,
						tag: '',
						timestamp: moment(new Date()).valueOf(),
						vibrate: 0,
						fcmOptions: { link: '' },
					},
					fcmOptions: {
						link: '', // https url
					},
				},
				apns: {
					headers: {},
					payload: {
						aps: {
							alert: '',
							badge: 0,
							sound: '',
							contentAvailable: true,
							mutableContent: true,
							category: '',
							threadId: '',
							additionalData: additionalData,
						},
					},
					fcmOptions: {
						analyticsLabel: '',
						// imageUrl: '',
					},
				},
			})
			.then((response) => {
				ctx.broker.logger.info('message succesfully sent !');
				ctx.broker.logger.info(JSON.stringify(response));
				ctx.broadcast('notification.log', { additionalInfo: JSON.stringify(response), type: 'one-one' });
			})
			.catch((error) => {
				ctx.broker.logger.info(error);
				ctx.broadcast('notification.log', { additionalInfo: JSON.stringify(error), type: 'one-one' });
			});
	}

	@Method
	public static async sendBulkNotifications(ctx: ContextWrapper, tokens: string[], title: string, body: string, additionalData = {}) {
		admin
			.messaging()
			.sendEachForMulticast({
				tokens: tokens,
				data: additionalData,
				notification: {
					title: title,
					// imageUrl: imageUrl,
					body: body,
				},
				// condition: '',
				// topic: '',
				android: {
					// collapseKey: '',
					priority: 'high',
					ttl: 100,
					data: additionalData,
					notification: {
						title: title,
						body: body,
						icon: '',
						color: '#D43333', // Notification icon color
						sound: '',
						tag: '',
						// imageUrl: imageUrl,
						clickAction: '',
						sticky: false,
						eventTimestamp: new Date(),
						priority: 'min' || 'low' || 'default' || 'high' || 'max',
						// vibrateTimingsMillis: [],
						defaultVibrateTimings: true,
						defaultSound: true,
						lightSettings: { color: '#D433B4', lightOnDurationMillis: 200, lightOffDurationMillis: 100 },
						defaultLightSettings: true,
						visibility: 'private' || 'public' || 'secret',
					},
				},
				webpush: {
					headers: {}, // supported headers
					data: additionalData,
					notification: {
						title: title,
						actions: [{ action: '', icon: '', title: '' }],
						badge: '',
						body: body,
						data: additionalData,
						dir: 'auto' || 'ltr' || 'rtl',
						icon: '',
						// image: imageUrl,
						renotify: false,
						requireInteraction: false,
						silent: false,
						tag: '',
						timestamp: moment(new Date()).valueOf(),
						vibrate: 0,
						fcmOptions: { link: '' },
					},
					fcmOptions: {
						link: '', // https url
					},
				},
				apns: {
					headers: {},
					payload: {
						aps: {
							// alert: '',
							// badge: 0,
							// sound: '',
							contentAvailable: true,
							mutableContent: true,
							// category: '',
							// threadId: '',
							additionalData: additionalData,
						},
					},
					fcmOptions: {
						analyticsLabel: '',
						// imageUrl: '',
					},
				},
			})
			.then((response) => {
				ctx.broker.logger.info('messages succesfully sent !');
				ctx.broker.logger.info(JSON.stringify(response));
				ctx.broadcast('notification.log', { additionalInfo: JSON.stringify(response), type: 'bulk' });
			})
			.catch((error) => {
				ctx.broker.logger.info(error);
				ctx.broadcast('notification.log', { additionalInfo: JSON.stringify(error), type: 'bulk' });
			});
	}
}
