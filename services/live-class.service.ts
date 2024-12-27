import { LiveClassDao } from '@Dao/live-class.dao';
import { ContextWrapper } from '@Helpers/molecular-helper';
import { LiveClass } from '@Models/live-class';
import { Constants } from '@Utility/constants';
import { Action } from 'moleculer-decorators';
import { LiveClassHelper } from '@Helpers/service-helpers/live-class.helper';
import { ErrorHelper } from '@Helpers/error-helper';
import { Messages } from '@Utility/Messages';
import { LiveClassDto, LiveClassMapper } from 'src/dto/live-class.dto';
import AuthSchema from './auth';
import { PagedResponse } from 'src/dto/base.dto';
import { LiveClassInviteDao } from '@Dao/live-class-invite.dao';
import { LiveClassInvite } from '@Models/live-class-invite';
import { User } from '@Models/user';
import { UserDao } from '@Dao/user.dao';
import { LiveClassAttendanceHelper } from '@Helpers/service-helpers/live-class-attendee.helper';
import { LiveClassAttendance } from '@Models/live-class-attendance';
import { LiveClassAttendanceDao } from '@Dao/live-class-attendance.dao';
import { AttendeesRegisterType } from '@Utility/enum';
import { LiveClassInviteHelper } from '@Helpers/service-helpers/live-class-invite.helper';
import { JoinMeetingModerator, LiveSession } from '@Utility/interface';
import async from 'async';
import { LiveClassQuestion } from '@Models/live-class-question';
import { LiveClassQuestionHelper } from '@Helpers/service-helpers/live-class-question.helper';

export default class LiveClassService extends AuthSchema {
	public name: string = 'liveClass';

	// eslint-disable-next-line @typescript-eslint/member-ordering
	static LIVE_CLASS_PARAMS = {
		name: { type: 'string' },
		platform: { type: 'string' },
		description: { type: 'string', optional: true },
		date: { type: 'string' },
		fromTime: { type: 'string' },
		toTime: { type: 'string' },
		subjectId: { type: 'string' },
		chapterId: { type: 'string' },
		sectionId: { type: 'string' },
		professorRedirectUrl: { type: 'string' },
		studentRedirectUrl: { type: 'string' },
		professorId: { type: 'string' },
	};

	@Action({
		params: {
			...Constants.DEFAULT_PAGINATION_PARAMS,
		},
	})
	public async getLiveClasses(ctx: ContextWrapper): Promise<PagedResponse<LiveClassMapper>> {
		const liveClasses = await LiveClassDao.getLiveClasses(ctx);
		liveClasses.items = LiveClassDto.transformResources(liveClasses.items, new LiveClassMapper());
		return liveClasses;
	}

	@Action({
		params: {
			...LiveClassService.LIVE_CLASS_PARAMS,
		},
	})
	public async createLiveClass(ctx: ContextWrapper): Promise<LiveClassMapper> {
		const meetingRes: LiveSession = await LiveClassHelper.createLiveSession(ctx.params.name, ctx);
		ctx.params = { ...ctx.params, ...meetingRes };

		let liveClass: LiveClass = await LiveClassHelper.setLiveClassDetails(ctx, new LiveClass());
		liveClass = await LiveClassDao.saveGenericResource(ctx, liveClass);

		//TODO: Need to trigger Notifications to Users

		return LiveClassDto.transformResource(liveClass, new LiveClassMapper());
	}

	@Action({
		params: {
			...LiveClassService.LIVE_CLASS_PARAMS,
		},
	})
	public async updateLiveClass(ctx: ContextWrapper): Promise<LiveClassMapper> {
		let liveClass = await LiveClassDao.getGenericResource(ctx, LiveClass, {
			where: { id: ctx.params.liveClassId },
		});

		if (!liveClass) {
			ErrorHelper.throwError(Messages.INVALID_LIVE_CLASS, 400, Constants.SYSTEM_EXCEPTION_TYPES.DATA_NOT_FOUND);
		}

		liveClass = await LiveClassHelper.setLiveClassDetails(ctx, liveClass);
		liveClass = await LiveClassDao.saveGenericResource(ctx, liveClass);

		return LiveClassDto.transformResource(liveClass, new LiveClassMapper());
	}

	@Action({
		params: {
			liveClassId: { type: 'string' },
		},
	})
	public async deleteLiveClass(ctx: ContextWrapper): Promise<boolean> {
		const liveClassData: LiveClass = await LiveClassDao.getGenericResource(ctx, LiveClass, {
			where: { id: ctx.params.liveClassId },
		});
		if (!liveClassData) {
			ErrorHelper.throwError(Messages.INVALID_LIVE_CLASS, 400, Constants.SYSTEM_EXCEPTION_TYPES.DATA_NOT_FOUND);
		}

		await LiveClassDao.softDeleteResource(ctx, liveClassData);
		return true;
	}

	@Action({
		params: {
			liveClassId: { type: 'string' },
			removeInvites: { type: 'array', optional: true },
			addInvites: { type: 'array', optional: true },
		},
	})
	public async saveInvites(ctx: ContextWrapper) {
		const liveClassId = ctx.params.liveClassId;

		let liveClass = await LiveClassDao.getGenericResource(ctx, LiveClass, {
			where: { id: liveClassId },
		});

		if (!liveClass) {
			ErrorHelper.throwError(Messages.INVALID_LIVE_CLASS, 400, Constants.SYSTEM_EXCEPTION_TYPES.DATA_NOT_FOUND);
		}

		if (ctx.params.removeInvites && ctx.params.removeInvites.length > 0) {
			const liveClassInvites = await LiveClassInviteDao.getLiveClassInvites(ctx.params.removeInvites);

			if (liveClassInvites.length) {
				for (const liveClassInvite of liveClassInvites) {
					await LiveClassInviteDao.softDeleteResource(
						ctx,
						await LiveClassInviteDao.getGenericResource(ctx, LiveClassInvite, {
							where: { id: liveClassInvite.id },
						}),
					);
				}
			}
		}

		if (ctx.params.addInvites && ctx.params.addInvites.length > 0) {
			await async.forEachLimit(ctx.params.addInvites, 1, async (invites: any) => {
				ctx.params = { ...invites, liveClassId };
				let liveClassInvite: LiveClassInvite = await LiveClassInviteHelper.setLiveClassInviteDetails(ctx, new LiveClassInvite());
				liveClassInvite = await LiveClassInviteDao.saveGenericResource(ctx, liveClassInvite);
			});
		}

		ctx.params = { liveClassId };
		ctx.params.noOfStudents = await LiveClassDao.getUsersCount(ctx);

		liveClass = await LiveClassHelper.setLiveClassDetails(ctx, liveClass);
		liveClass = await LiveClassDao.saveGenericResource(ctx, liveClass);

		return LiveClassDto.transformResource(liveClass, new LiveClassMapper());
	}

	@Action({
		params: {
			chapterId: { type: 'string' },
			sectionId: { type: 'string' },
			teacherId: { type: 'string' },
		},
	})
	public async getTeacherLiveClasses(ctx: ContextWrapper): Promise<PagedResponse<LiveClassMapper>> {
		const liveClasses = await LiveClassDao.getModeratorLiveClasses(ctx.params.chapterId, ctx.params.sectionId, ctx.params.teacherId);
		liveClasses.items = LiveClassDto.transformResources(liveClasses.items, new LiveClassMapper());
		return liveClasses;
	}

	@Action({
		params: {
			chapterId: { type: 'string' },
			userId: { type: 'string' },
		},
	})
	public async getStudentLiveClasses(ctx: ContextWrapper): Promise<PagedResponse<LiveClassMapper>> {
		const liveClasses = await LiveClassDao.getAttendeeLiveClasses(ctx.params.userId, ctx.params.chapterId);
		liveClasses.items = LiveClassDto.transformResources(liveClasses.items, new LiveClassMapper());
		return liveClasses;
	}

	@Action({
		params: {
			liveClassId: { type: 'string' },
			userId: { type: 'string' },
		},
	})
	public async joinModerator(ctx: ContextWrapper): Promise<boolean> {
		const user: User = await UserDao.getGenericResource(ctx, User, { where: { id: ctx.params.userId } });
		if (!user) {
			ErrorHelper.throwError(Messages.INVALID_USER, 400, Constants.SYSTEM_EXCEPTION_TYPES.DATA_NOT_FOUND);
		}

		let liveClass: LiveClass = await LiveClassDao.getGenericResource(ctx, LiveClass, { where: { id: ctx.params.liveClassId } });
		if (!liveClass) {
			ErrorHelper.throwError(Messages.INVALID_LIVE_CLASS, 400, Constants.SYSTEM_EXCEPTION_TYPES.DATA_NOT_FOUND);
		}

		if (!liveClass.startTime) {
			liveClass.startTime = new Date().toISOString();
		}

		const params = {
			name: user.firstName + ' ' + user.lastName,
			meetingId: liveClass.meetingId,
			meetingUrl: liveClass.meetingUrl,
			moderatorPass: liveClass.moderatorPass,
		};
		const meetingData: JoinMeetingModerator = await ctx.call('bigBlueButton.joinMeetingModerator', params);
		liveClass.internalMeetingId = meetingData.internalMeetingID;

		liveClass = await LiveClassDao.saveGenericResource(ctx, liveClass);
		return true;
	}

	@Action({
		params: {
			liveClassId: { type: 'string' },
			userId: { type: 'string' },
		},
	})
	public async joinAttendee(ctx: ContextWrapper): Promise<boolean> {
		const isInvited: boolean = await LiveClassInviteDao.isUserInvited(ctx.params.liveClassId, ctx.params.userId);
		if (!isInvited) {
			ErrorHelper.throwError(Messages.STUDENT_NOT_INVITED, 400, Constants.SYSTEM_EXCEPTION_TYPES.DATA_NOT_FOUND);
		}

		const liveClassData: LiveClass = await LiveClassDao.getGenericResource(ctx, LiveClass, {
			where: { id: ctx.params.liveClassId },
		});
		if (!liveClassData) {
			ErrorHelper.throwError(Messages.INVALID_LIVE_CLASS, 400, Constants.SYSTEM_EXCEPTION_TYPES.DATA_NOT_FOUND);
		}

		const isRunning = await ctx.call('bigBlueButton.isMeetingRunning', { meetingId: liveClassData.meetingId });
		if (!isRunning) {
			ErrorHelper.throwError(Messages.LIVE_CLASS_INACTIVE, 400, Constants.SYSTEM_EXCEPTION_TYPES.DATA_NOT_FOUND);
		}

		const user: User = await UserDao.getGenericResource(ctx, User, { where: { id: ctx.params.userId } });
		if (!user) {
			ErrorHelper.throwError(Messages.INVALID_USER, 400, Constants.SYSTEM_EXCEPTION_TYPES.DATA_NOT_FOUND);
		}

		ctx.params.type = AttendeesRegisterType.Login;
		ctx.params.time = new Date().toISOString();

		let liveClassAttendance: LiveClassAttendance = await LiveClassAttendanceHelper.setLiveClassAttendanceDetails(ctx, new LiveClassAttendance());
		liveClassAttendance = await LiveClassAttendanceDao.saveGenericResource(ctx, liveClassAttendance);

		return true;
	}

	@Action({
		params: {
			liveClassId: { type: 'string' },
			userId: { type: 'string' },
		},
	})
	public async endMeeting(ctx: ContextWrapper): Promise<boolean> {
		let liveClassData: LiveClass = await LiveClassDao.getGenericResource(ctx, LiveClass, {
			where: { id: ctx.params.liveClassId },
		});
		if (!liveClassData) {
			ErrorHelper.throwError(Messages.INVALID_LIVE_CLASS, 400, Constants.SYSTEM_EXCEPTION_TYPES.DATA_NOT_FOUND);
		}

		if (ctx.params.userId == liveClassData.professorId) {
			ctx.params.endTime = new Date().toISOString();
			liveClassData = await LiveClassHelper.setLiveClassDetails(ctx, liveClassData);
			liveClassData = await LiveClassDao.saveGenericResource(ctx, liveClassData);

			return true;
		}

		const liveClassAttendanceData: LiveClassAttendance = await LiveClassAttendanceDao.getGenericResource(ctx, LiveClassAttendance, {
			where: { liveClassId: ctx.params.liveClassId, userId: ctx.params.userId, type: AttendeesRegisterType.Login },
		});
		if (!liveClassAttendanceData) {
			ErrorHelper.throwError(Messages.NO_LOGIN, 400, Constants.SYSTEM_EXCEPTION_TYPES.DATA_NOT_FOUND);
		}

		ctx.params.type = AttendeesRegisterType.Logout;
		ctx.params.time = new Date().toISOString();

		let liveClassAttendance: LiveClassAttendance = await LiveClassAttendanceHelper.setLiveClassAttendanceDetails(ctx, new LiveClassAttendance());
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		liveClassAttendance = await LiveClassAttendanceDao.saveGenericResource(ctx, liveClassAttendance);

		return true;
	}

	@Action({
		params: {
			liveClassId: { type: 'string' },
			addQuestions: {
				type: 'array',
				items: {
					type: 'object',
					props: {
						question: 'string',
						answerType: 'string',
						mandatory: 'number',
					},
				},
			},
		},
	})
	public async addQuestions(ctx: ContextWrapper): Promise<String> {
		if (ctx.params.addQuestions && ctx.params.addQuestions.length) {
			const liveClassQuestions: LiveClassMapper[] = [];
			await async.forEachLimit(ctx.params.addQuestions, 1, async (ques: any) => {
				let liveClassQuestion: any = {};
				liveClassQuestion.liveClassId = ctx.params.liveClassId;
				liveClassQuestion.question = ques.question;
				liveClassQuestion.answerType = ques.answerType;
				liveClassQuestion.mandatory = ques.mandatory;

				const ctxCopy = Object.assign({}, ctx);
				ctxCopy.params = liveClassQuestion;
				liveClassQuestion = await LiveClassQuestionHelper.setLiveClassQuestionDetails(ctxCopy, new LiveClassQuestion());
				liveClassQuestions.push(liveClassQuestion);
			});

			await LiveClassDao.saveGenericResource(ctx, liveClassQuestions);
		}

		return 'Success';
	}
}

module.exports = new LiveClassService();
