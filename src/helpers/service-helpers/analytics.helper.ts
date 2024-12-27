import { AnalyticsDao } from '@Dao/analytics.dao';
import { ErrorHelper } from '@Helpers/error-helper';
import { ContextWrapper } from '@Helpers/molecular-helper';
import { ActivityDim } from '@Models/activity-dim';
import { ActivityInfo } from '@Models/activity-info';
import { TimeDim } from '@Models/time-dim';
import { UserActivityAnalytics } from '@Models/user-activity-analytics';
import { UserAnalyticsProgress } from '@Models/user-progress-analytics';
import { Constants } from '@Utility/constants';
import { ActivityCodeType, ActivityStatus, TestAnalysisType, UserProgressAnalyticsType } from '@Utility/enum';
import { Messages } from '@Utility/Messages';
import { Method } from 'moleculer-decorators';
import moment from 'moment';

export class AnalyticsHelper {
	@Method
	public static async computeUserActivityAnalytic(ctx: ContextWrapper, activityDim: ActivityDim) {
		const activityType = activityDim.activityType as ActivityCodeType;
		// Identify activity type
		switch (activityType) {
			case ActivityCodeType.ConceptualVideo:
			case ActivityCodeType.Youtube:
			case ActivityCodeType.Video:
				await this.handleVideos(ctx, activityDim);
				break;
			case ActivityCodeType.Pdf:
				await this.handlePdfs(ctx, activityDim);
			case ActivityCodeType.Html5:
				await this.handleWebLinks(ctx, activityDim);
				break;
			case ActivityCodeType.Web:
				await this.handleWebLinks(ctx, activityDim);
				break;
			case ActivityCodeType.ExploratoryLearning:
				await this.handleWebLinks(ctx, activityDim);
				break;
			default:
				break;
		}
	}

	@Method
	public static async handleAssessments(ctx: ContextWrapper, timeSpent: number) {
		const activityDim: ActivityDim = await AnalyticsDao.getGenericResource(ctx, ActivityDim, { where: { id: ctx.params.activityDimId } });
		const { userActivityAnalytics } = await this.getAnalyticInfo(ctx, activityDim);
		ctx.params.activityStartedAt = moment().format('YYYY-MM-DD HH:mm:ss');
		ctx.params.activityEndedAt = moment().add(timeSpent, 'seconds').format('YYYY-MM-DD HH:mm:ss');

		const { timeDim } = await this.handleTimeDim(ctx, userActivityAnalytics);

		// set activityDim
		activityDim.status = ActivityStatus.Completed;
		userActivityAnalytics.progress = 100;
		userActivityAnalytics.timeId = timeDim.id;

		await AnalyticsDao.saveGenericResource(ctx, activityDim);
		await AnalyticsDao.saveGenericResource(ctx, userActivityAnalytics);

		if (activityDim.activityType == ActivityCodeType.Post) {
			ctx.broadcast('leaderBoard.capture', {
				universityId: userActivityAnalytics.universityId,
				collegeId: userActivityAnalytics.collegeId,
				branchId: userActivityAnalytics.branchId,
				semesterId: userActivityAnalytics.semesterId,
				userId: userActivityAnalytics.userId,
				ruleCode:
					ctx.params.analysis == TestAnalysisType.Poor
						? Constants.LeaderBoardRuleCodes.ASSESSMENT_FAILURE
						: Constants.LeaderBoardRuleCodes.OBJ_TYPE_ASSESSMENT,
			});
		}

		ctx.broadcast('analytics.user-progress', { userActivityAnalytics: userActivityAnalytics });
	}

	@Method
	public static async handleVideos(ctx: ContextWrapper, activityDim: ActivityDim) {
		const { userActivityAnalytics, activityInfo } = await this.getAnalyticInfo(ctx, activityDim);

		// TODO: do this in PL-SQL
		const { timeDim, currentTimeSpent } = await this.handleTimeDim(ctx, userActivityAnalytics);

		if (activityDim.status == ActivityStatus.Completed) {
			return;
		}

		const actualActivityDuration: number = activityInfo.duration || 0;

		if (timeDim.duration >= actualActivityDuration) {
			// mark activity as completed and status as 100%
			activityDim.status = ActivityStatus.Completed;
			userActivityAnalytics.progress = 100;
		} else {
			activityDim.status = ActivityStatus.InProgress;
			userActivityAnalytics.progress = Math.round((currentTimeSpent * 100) / actualActivityDuration);
		}

		activityDim.videoPausedAt = ctx.params.videoPausedAt || activityDim.videoPausedAt;
		userActivityAnalytics.timeId = timeDim.id;
		await AnalyticsDao.saveGenericResource(ctx, activityDim);
		await AnalyticsDao.saveGenericResource(ctx, userActivityAnalytics);

		if (userActivityAnalytics.progress == 100) {
			// handle leader board activity
			await this.handleActivityLeaderBoard(ctx, activityDim, userActivityAnalytics);
		}

		ctx.broadcast('analytics.user-progress', { userActivityAnalytics: userActivityAnalytics });
	}

	@Method
	public static setTimeDimDetails(ctx: ContextWrapper, target: TimeDim, totalDurationInSec: number) {
		target.startTime = new Date(ctx.params.activityStartedAt);
		target.endTime = new Date(ctx.params.activityEndedAt);
		target.duration = target.duration + totalDurationInSec;
		return target;
	}

	@Method
	public static async handleTimeDim(ctx: ContextWrapper, userActivityAnalytics: UserActivityAnalytics) {
		// get time dim
		let timeDim: TimeDim = await AnalyticsDao.getGenericResource(ctx, TimeDim, { where: { id: userActivityAnalytics.timeId } });
		const startDate = moment(ctx.params.activityStartedAt);
		const endDate = moment(ctx.params.activityEndedAt);
		const currentTimeSpent = moment.duration(endDate.diff(startDate)).asSeconds();

		// set time dim
		timeDim = this.setTimeDimDetails(ctx, timeDim ? timeDim : new TimeDim(), currentTimeSpent);
		timeDim = await AnalyticsDao.saveGenericResource(ctx, timeDim);

		return { timeDim, currentTimeSpent };
	}

	@Method
	public static async handlePdfs(ctx: ContextWrapper, activityDim: ActivityDim) {
		const { userActivityAnalytics, activityInfo } = await this.getAnalyticInfo(ctx, activityDim);

		// TODO: do this in PL-SQL
		const { timeDim } = await this.handleTimeDim(ctx, userActivityAnalytics);

		if (activityDim.status == ActivityStatus.Completed) {
			return;
		}

		if (activityInfo.validPdfPages == activityDim.pdfPagesRead) {
			// mark activity as completed and status as 100%
			activityDim.status = ActivityStatus.Completed;
			userActivityAnalytics.progress = 100;
		} else {
			const pdfPagesRead = activityDim.pdfPagesRead ? activityDim.pdfPagesRead.split(',') : [];
			const validPdfPages = activityInfo.validPdfPages ? activityInfo.validPdfPages.split(',') : [];
			const currentPage = pdfPagesRead.find((e) => e == ctx.params.activityPdfPage);

			if (!currentPage) pdfPagesRead.push(ctx.params.activityPdfPage);

			activityDim.status = ActivityStatus.InProgress;
			userActivityAnalytics.progress = (pdfPagesRead.length * 100) / validPdfPages.length;
			userActivityAnalytics.timeId = timeDim.id;
			activityDim.pdfPagesRead = pdfPagesRead.toString();
		}

		activityDim.pdfPagePausedAt = ctx.params.pdfPagePausedAt || activityDim.pdfPagePausedAt;

		await AnalyticsDao.saveGenericResource(ctx, activityDim);
		await AnalyticsDao.saveGenericResource(ctx, userActivityAnalytics);

		if (userActivityAnalytics.progress == 100) {
			// handle leader board activity
			await this.handleActivityLeaderBoard(ctx, activityDim, userActivityAnalytics);
		}

		ctx.broadcast('analytics.user-progress', { userActivityAnalytics: userActivityAnalytics });
	}

	@Method
	public static async getAnalyticInfo(ctx: ContextWrapper, activityDim: ActivityDim) {
		// get user activity analytics
		let userActivityAnalytics: UserActivityAnalytics = await AnalyticsDao.getGenericResource(ctx, UserActivityAnalytics, {
			where: { activityDimId: activityDim?.id },
		});

		if (!userActivityAnalytics) {
			ErrorHelper.throwError(Messages.INVALID_ACTIVITY, 400, Constants.SYSTEM_EXCEPTION_TYPES.DATA_NOT_FOUND);
		}

		// get activityInfo
		const activityInfo: ActivityInfo = await AnalyticsDao.getGenericResource(ctx, ActivityInfo, {
			where: { assignedActivityId: activityDim?.activityId },
		});

		return { userActivityAnalytics, activityInfo };
	}

	@Method
	public static async handleWebLinks(ctx: ContextWrapper, activityDim: ActivityDim) {
		const { userActivityAnalytics, activityInfo } = await this.getAnalyticInfo(ctx, activityDim);

		// TODO: do this in PL-SQL
		const { timeDim } = await this.handleTimeDim(ctx, userActivityAnalytics);

		if (activityDim.status == ActivityStatus.Completed) {
			return;
		}

		activityDim.status = ActivityStatus.Completed;
		userActivityAnalytics.progress = 100;
		userActivityAnalytics.timeId = timeDim.id;

		await AnalyticsDao.saveGenericResource(ctx, activityDim);
		await AnalyticsDao.saveGenericResource(ctx, userActivityAnalytics);

		if (userActivityAnalytics.progress == 100) {
			// handle leader board activity
			await this.handleActivityLeaderBoard(ctx, activityDim, userActivityAnalytics);
		}

		ctx.broadcast('analytics.user-progress', { userActivityAnalytics: userActivityAnalytics });
	}

	@Method
	public static async handleActivityLeaderBoard(ctx: ContextWrapper, activityDim: ActivityDim, userActivityAnalytics: UserActivityAnalytics) {
		const activityType = activityDim.activityType as ActivityCodeType;
		let ruleCode: string = '';
		// Identify activity type
		switch (activityType) {
			case ActivityCodeType.ConceptualVideo:
				ruleCode = Constants.LeaderBoardRuleCodes.TEACHING_VIDEO_COMPLETE;
			case ActivityCodeType.Youtube:
				ruleCode = Constants.LeaderBoardRuleCodes.YT_VIDEO_COMPLETE;
			case ActivityCodeType.Video:
				ruleCode = Constants.LeaderBoardRuleCodes.VIDEO_COMPLETE;
				break;
			case ActivityCodeType.Pdf:
				ruleCode = Constants.LeaderBoardRuleCodes.DOC_COMPLETE;
			default:
				break;
		}

		if (ruleCode) {
			ctx.broadcast('leaderBoard.capture', {
				universityId: userActivityAnalytics.universityId,
				collegeId: userActivityAnalytics.collegeId,
				branchId: userActivityAnalytics.branchId,
				semesterId: userActivityAnalytics.semesterId,
				userId: userActivityAnalytics.userId,
				ruleCode: ruleCode,
			});
		}
	}

	@Method
	public static setUserAnalyticsProgressDetails(
		target: UserAnalyticsProgress,
		userActivityAnalytics: UserActivityAnalytics,
		progressType: UserProgressAnalyticsType,
		progress: number,
	) {
		target.universityId = userActivityAnalytics.universityId;
		target.collegeId = userActivityAnalytics.collegeId;
		target.branchId = userActivityAnalytics.branchId;
		target.semesterId = userActivityAnalytics.semesterId;
		target.sectionId = userActivityAnalytics.sectionId;
		target.subjectId = userActivityAnalytics.subjectId;
		target.chapterId = userActivityAnalytics.chapterId;
		target.topicId = userActivityAnalytics.topicId;
		target.userId = userActivityAnalytics.userId;
		target.progressType = progressType;
		target.progress = progress;
		return target;
	}
}
