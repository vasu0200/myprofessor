import { ServiceBroker } from 'moleculer';

const Events = (broker: ServiceBroker) => {
	return {
		async 'analytics.add'(payload) {
			await broker.call('analytics.handleUserAnalytics', { ...payload }, { timeout: 10000 * 1000 });
		},
		async 'leaderBoard.capture'(payload) {
			await broker.call('leaderBoard.captureLeaderBoardRule', { ...payload }, { timeout: 100 * 1000 });
		},
		async 'razorpay.captureOrderWebHook'(payload) {
			await broker.call('razorpay.captureOrderWebHooksEvent', { ...payload }, { timeout: 10 * 1000 });
		},
		async 'razorpay.capturePaymentWebHook'(payload) {
			await broker.call('razorpay.capturePaymentWebHooksEvent', { ...payload }, { timeout: 10 * 1000 });
		},
		async 'user.checkInviteCode'(payload) {
			await broker.call('registrationInvite.handleUserInvites', { ...payload }, { timeout: 100 * 1000 });
		},
		async 'user.captureReferralPoints'(payload) {
			await broker.call('registrationInvite.handleUserInvitePoints', { ...payload }, { timeout: 100 * 1000 });
		},
		async 'razorpay.captureContact'(payload) {
			await broker.call('razorpay.handleRazorpayXPayoutPrequisites', { ...payload }, { timeout: 100 * 1000 });
		},
		async 'razorpay.handlePayoutWorkflow'(payload) {
			await broker.call('razorpay.handlePayoutWorkflow', { ...payload }, { timeout: 100 * 1000 });
		},
		async 'user.bulkUpload'(payload) {
			await broker.call('user.processBulkStudents', { ...payload }, { timeout: 100 * 1000 });
		},
		async 'announcement.send'(payload) {
			await broker.call('announcement.handleAnnouncements', { ...payload }, { timeout: 100 * 1000 });
		},
		async 'migration.seeData'(payload) {
			await broker.call('dbScript.startMigration', { ...payload }, { timeout: 10000 * 1000 });
		},
		async 'analytics.update'(payload) {
			await broker.call('analytics.updateUserAnalytics', { ...payload }, { timeout: 100 * 1000 });
		},
		async 'analytics.assessmentsUpdate'(payload) {
			await broker.call('analytics.updateUserAssesmentAnalytics', { ...payload }, { timeout: 100000 * 1000 });
		},
		async 'analytics.delete'(payload) {
			await broker.call('analytics.triggerDeleteUserAnalytics', { ...payload }, { timeout: 10000 * 1000 });
		},
		async 'userSession.kill'(payload) {
			await broker.call('login.killCurrentJwtTokenSession', { ...payload }, { timeout: 1000000 * 1000 });
		},
		async 'notification.send'(payload) {
			await broker.call('notification.processNotifications', { ...payload }, { timeout: 1000000 * 1000 });
		},
		async 'notification.log'(payload) {
			await broker.call('notification.logNotificationActivity', { ...payload }, { timeout: 100 * 1000 });
		},
		async 'analytics.user-progress'(payload) {
			await broker.call('analytics.computeUserProgressAnalytics', { ...payload }, { timeout: 100 * 1000 });
		}
	};
};

export default Events;
