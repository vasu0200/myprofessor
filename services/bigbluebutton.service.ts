const bigBlueButton = require('bigbluebutton-js');
import { ContextWrapper } from '@Helpers/molecular-helper';
import { JoinMeetingModerator } from '@Utility/interface';
import * as _ from 'lodash';
import { Action } from 'moleculer-decorators';
import AuthSchema from './auth';
const appConfig = require('../app-config.json');


export default class BigBlueButtonService extends AuthSchema {
	public name: string = 'bigBlueButton';

	static BIG_BLUE_BUTTON_PARAMS = {
		id: { type: 'string', optional: true },
		name: { type: 'string', optional: true },
		meetingId: { type: 'string', optional: true },
		duration: { type: 'number', optional: true },
		attendeePass: { type: 'string', optional: true },
		meetingUrl: { type: 'string', optional: true },
		moderatorPass: { type: 'string', optional: true },
	};

	public static api = bigBlueButton.api(appConfig.bigBlueButton.domain, appConfig.bigBlueButton.secretKey);
	public static http = bigBlueButton.http;
	public static meetingCreateUrl: any;

	@Action({
		params: {
			...BigBlueButtonService.BIG_BLUE_BUTTON_PARAMS,
		},
	})
	public async createMeeting(ctx: ContextWrapper) {
		const meetingCreateUrl = BigBlueButtonService.api.administration.create(ctx.params.name, ctx.params.meetingId, {
			attendeePW: ctx.params.attendeePass,
			moderatorPW: ctx.params.moderatorPass,
			lockSettingsDisableMic: true,
			lockSettingsDisableCam: true,
			webcamsOnlyForModerator: true,
			record: true,
			logoutURL: `${appConfig.other.clientUrl}/live-class/survey/${ctx.params.id}/${ctx.params.name}`,
		});
		return meetingCreateUrl;
	}

	@Action({
		params: {
			...BigBlueButtonService.BIG_BLUE_BUTTON_PARAMS,
		},
	})
	public async joinMeetingAttendee(ctx: ContextWrapper) {
		return await new Promise((resolve, reject) => {
			BigBlueButtonService.http(ctx.params.meetingUrl)
				.then((result) => {
					let moderatorUrl = BigBlueButtonService.api.administration.join(ctx.params.name, ctx.params.meetingId, ctx.params.attendeePass);
					resolve(moderatorUrl);
				})
				.catch((error) => {
					reject(error);
				});
		});
	}

	@Action({
		params: {
			...BigBlueButtonService.BIG_BLUE_BUTTON_PARAMS,
		},
	})
	public async joinMeetingModerator(ctx: ContextWrapper): Promise<JoinMeetingModerator> {
		return await new Promise((resolve, reject) => {
			BigBlueButtonService.http(ctx.params.meetingUrl)
				.then((result) => {
					let attendeeUrl: string = BigBlueButtonService.api.administration.join(ctx.params.name, ctx.params.meetingId, ctx.params.moderatorPass);
					resolve({
						meetingURL: attendeeUrl,
						internalMeetingID: result.internalMeetingID,
					});
				})
				.catch((error) => {
					reject(error);
				});
		});
	}

	@Action({
		params: {
			...BigBlueButtonService.BIG_BLUE_BUTTON_PARAMS,
		},
	})
	public async endMeetingAttendee(ctx: ContextWrapper) {
		const meetingEndUrl = BigBlueButtonService.api.administration.end(ctx.params.meetingId, ctx.params.attendeePass);
		return meetingEndUrl;
	}

	@Action({
		params: {
			...BigBlueButtonService.BIG_BLUE_BUTTON_PARAMS,
		},
	})
	public async endMeetingModerator(ctx: ContextWrapper) {
		const meetingEndUrl = BigBlueButtonService.api.administration.end(ctx.params.meetingId, ctx.params.moderatorPass);
		return meetingEndUrl;
	}

	@Action({
		params: {
			...BigBlueButtonService.BIG_BLUE_BUTTON_PARAMS,
		},
	})
	public async getRecording(ctx: ContextWrapper) {
		const meetingEndUrl = BigBlueButtonService.api.administration.end(ctx.params.meetingId, ctx.params.moderatorPass);
		return meetingEndUrl;
	}

	@Action({
		params: {
			meetingId: { type: 'string' },
		},
	})
	public async isMeetingRunning(ctx: ContextWrapper): Promise<boolean> {
		return await new Promise((resolve, reject) => {
			const response = BigBlueButtonService.api.monitoring.isMeetingRunning(ctx.params.meetingId);

			BigBlueButtonService.http(response)
				.then((result) => {
					resolve(result.running);
				})
				.catch((error) => {
					reject(error);
				});
		});
	}

	@Action({
		params: {
			meetingId: { type: 'string' },
		},
	})
	public async getRecordings(ctx: ContextWrapper) {
		return await new Promise((resolve, reject) => {
			const response = BigBlueButtonService.api.recording.getRecordings({
				meetingID: ctx.params.meetingId,
				state: 'published',
			});
			BigBlueButtonService.http(response)
				.then((result) => {
					if (result.recordings.length) {
						let url = _.get(result, 'recordings[0].playback.format.url');
						if (url) resolve(url);
					}
					reject({ message: 'No recording found' });
				})
				.catch((error) => {
					reject(error);
				});
		});
	}
}

module.exports = new BigBlueButtonService();
