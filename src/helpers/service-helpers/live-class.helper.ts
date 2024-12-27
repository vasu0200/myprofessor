import { ContextWrapper } from '@Helpers/molecular-helper';
import { LiveClass } from '@Models/live-class';
import { Method } from 'moleculer-decorators';
import { LiveSession } from '@Utility/interface';
import SystemHelper from '@Helpers/system-helpers';
import randomstring from 'randomstring';

export class LiveClassHelper {
	@Method
	public static async setLiveClassDetails(ctx: ContextWrapper, target: LiveClass): Promise<LiveClass> {
		target.name = ctx.params.name;
		target.platform = ctx.params.platform;
		target.description = ctx.params.description;
		target.date = ctx.params.date;
		target.fromTime = ctx.params.fromTime;
		target.toTime = ctx.params.toTime;
		target.subjectId = ctx.params.subjectId;
		target.chapterId = ctx.params.chapterId;
		target.professorId = ctx.params.professorId;
		target.sectionId = ctx.params.sectionId;
		target.meetingId = ctx.params.meetingId;
		target.internalMeetingId = ctx.params.internalMeetingId;
		target.videoUrl = ctx.params.videoUrl;
		target.meetingUrl = ctx.params.meetingUrl;
		target.moderatorPass = ctx.params.moderatorPass;
		target.attendeePass = ctx.params.attendeePass;
		target.startTime = ctx.params.startTime;
		target.endTime = ctx.params.endTime;
		target.noOfStudents = ctx.params.noOfStudents;
		target.professorRedirectUrl = ctx.params.professorRedirectUrl;
		target.studentRedirectUrl = ctx.params.studentRedirectUrl;

		return target;
	}

	@Method
	static async createLiveSession(name: string, ctx: ContextWrapper): Promise<LiveSession> {
		const params = {
			meetingId: 'meeting-' + SystemHelper.getUUID(),
			// eslint-disable-next-line @typescript-eslint/restrict-plus-operands
			moderatorPass: 'moderator' + randomstring.generate({ length: 5, charset: 'numeric' }),
			// eslint-disable-next-line @typescript-eslint/restrict-plus-operands
			attendeePass: 'attendee' + randomstring.generate({ length: 5, charset: 'numeric' }),
			name: name,
		};
		const meetingUrl: string = await ctx.call('bigBlueButton.createMeeting', params);
		return {
			...params,
			meetingUrl,
		};
	}
}
