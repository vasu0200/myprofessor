import { AnalyticsDao } from '@Dao/analytics.dao';
import { ContextWrapper } from '@Helpers/molecular-helper';
import { ActivityDim } from '@Models/activity-dim';
import { Role } from '@Models/role';
import { TimeDim } from '@Models/time-dim';
import { UserActivityAnalytics, UserAnalyticsConfig } from '@Models/user-activity-analytics';
import { UserRole } from '@Models/user-role';
import { Constants } from '@Utility/constants';
import { Action } from 'moleculer-decorators';
import { In } from 'typeorm';
import AuthSchema from './auth';
import { ActivityHelper } from '@Helpers/service-helpers/activity.helper';
import { PagedResponse } from 'src/dto/base.dto';
import {
	AnalyticsDto,
	UserActivitiesAnalyticMapper,
	UserActivityAnalyticInfoMapper,
	UserChaptersAnalyticMapper,
	UserSubjectsAnalyticMapper,
	UserTopicsAnalyticMapper,
} from 'src/dto/analytics.dto';
import { AnalyticsHelper } from '@Helpers/service-helpers/analytics.helper';
import { Question } from '@Models/question';
import async from 'async';
import { ErrorHelper } from '@Helpers/error-helper';
import { UserAnalyticsProgress } from '@Models/user-progress-analytics';
import { UserProgressAnalyticsType } from '@Utility/enum';

export default class AnalyticsService extends AuthSchema {
	public name: string = 'analytics';
	private static ANALYTICS_PARAMS = {
		userId: { type: 'string' },
		universityId: { type: 'string' },
		collegeId: { type: 'string', optional: true },
	};
	private static ANALYTICS_CAPTURE_PARAMS = {
		status: { type: 'string', optional: true },
		videoWatchedInSec: { type: 'number', optional: true },
		videoPausedAt: { type: 'number', optional: true },
		activityStartedAt: { type: 'string' }, // YYY-MM-DD HH:MM:SS
		activityEndedAt: { type: 'string' }, // YYY-MM-DD HH:MM:SS
		activityPdfPage: { type: 'string', optional: true },
		pdfPagePausedAt: { type: 'string', optional: true },
	};

	@Action({
		params: {
			activityDimId: { type: 'string' },
			semesterId: { type: 'string' },
			branchId: { type: 'string' },
			subjectId: { type: 'string' },
			chapterId: { type: 'string' },
			topicId: { type: 'string' },
			...AnalyticsService.ANALYTICS_CAPTURE_PARAMS,
			...AnalyticsService.ANALYTICS_PARAMS,
		},
	})
	public async captureUserActivity(ctx: ContextWrapper) {
		// get activity_dm_info
		const activityDim: ActivityDim = await AnalyticsDao.getGenericResource(ctx, ActivityDim, { where: { id: ctx.params.activityDimId } });
		await AnalyticsHelper.computeUserActivityAnalytic(ctx, activityDim);
	}

	@Action({
		params: {
			userAnalyticId: { type: 'string' },
			semesterId: { type: 'string' },
			branchId: { type: 'string' },
			subjectId: { type: 'string' },
			topicId: { type: 'string' },
			...AnalyticsService.ANALYTICS_PARAMS,
		},
	})
	public async getUserActivity(ctx: ContextWrapper) {
		// from userAnalyticId, Identify type of activity
		// provide details needed like videUrl, pre, post assessments
	}

	@Action({
		params: {
			...AnalyticsService.ANALYTICS_PARAMS,
			semesterId: { type: 'string' },
			branchId: { type: 'string' },
		},
	})
	public async getUserAssessmentSubjects(ctx: ContextWrapper): Promise<PagedResponse<UserSubjectsAnalyticMapper>> {
		const userAssessmentSubjects = await AnalyticsDao.getUserAssessmentSubjects(ctx);
		userAssessmentSubjects.items = AnalyticsDto.transformResources(userAssessmentSubjects.items, new UserSubjectsAnalyticMapper());
		return userAssessmentSubjects;
	}

	@Action({
		params: {
			...AnalyticsService.ANALYTICS_PARAMS,
			semesterId: { type: 'string' },
			branchId: { type: 'string' },
		},
	})
	public async getUserSubjects(ctx: ContextWrapper): Promise<PagedResponse<UserSubjectsAnalyticMapper>> {
		const userSubjects = await AnalyticsDao.getUserSubjects(ctx);
		userSubjects.items = AnalyticsDto.transformResources(userSubjects.items, new UserSubjectsAnalyticMapper());
		return userSubjects;
	}

	@Action({
		params: {
			...AnalyticsService.ANALYTICS_PARAMS,
			semesterId: { type: 'string' },
			branchId: { type: 'string' },
		},
		// TODO: @manikyam, please make ensure to uncomment below code
		// cache: true,
	})
	public async getUserSubjectMetrics(ctx: ContextWrapper) {
		return await AnalyticsDao.getUserSubjectMetrics(ctx);
	}

	@Action({
		params: {
			...AnalyticsService.ANALYTICS_PARAMS,
			semesterId: { type: 'string' },
			branchId: { type: 'string' },
			subjectId: { type: 'string' },
		},
	})
	public async getUserChapters(ctx: ContextWrapper): Promise<PagedResponse<UserChaptersAnalyticMapper>> {
		const userChapters = await AnalyticsDao.getUserChapters(ctx);
		userChapters.items = AnalyticsDto.transformResources(userChapters.items, new UserChaptersAnalyticMapper());

		return userChapters;
	}

	@Action({
		params: {
			...AnalyticsService.ANALYTICS_PARAMS,
			semesterId: { type: 'string' },
			branchId: { type: 'string' },
			subjectId: { type: 'string' },
		},
	})
	public async getUserChapterMetrics(ctx: ContextWrapper) {
		return await AnalyticsDao.getUserChapterMetrics(ctx);
	}

	@Action({
		params: {
			...AnalyticsService.ANALYTICS_PARAMS,
			semesterId: { type: 'string' },
			branchId: { type: 'string' },
			subjectId: { type: 'string' },
			chapterId: { type: 'string' },
		},
	})
	public async getUserTopics(ctx: ContextWrapper): Promise<PagedResponse<UserTopicsAnalyticMapper>> {
		const userTopics = await AnalyticsDao.getUserTopics(ctx);
		userTopics.items = AnalyticsDto.transformResources(userTopics.items, new UserTopicsAnalyticMapper());
		return userTopics;
	}

	@Action({
		params: {
			...AnalyticsService.ANALYTICS_PARAMS,
			semesterId: { type: 'string' },
			branchId: { type: 'string' },
			subjectId: { type: 'string' },
			chapterId: { type: 'string' },
		},
	})
	public async getUserTopicMetrics(ctx: ContextWrapper) {
		return await AnalyticsDao.getUserTopicMetrics(ctx);
	}

	@Action({
		params: {
			...AnalyticsService.ANALYTICS_PARAMS,
			semesterId: { type: 'string' },
			branchId: { type: 'string' },
			subjectId: { type: 'string' },
			chapterId: { type: 'string' },
			topicId: { type: 'string' },
		},
	})
	public async getUserActivities(ctx: ContextWrapper): Promise<UserActivitiesAnalyticMapper[]> {
		let userActivities = (await AnalyticsDao.getUserActivities(ctx)) as UserActivitiesAnalyticMapper[];
		return AnalyticsDto.transformResources(userActivities, new UserActivitiesAnalyticMapper());
	}

	@Action({
		params: {
			activityDimId: { type: 'string' },
			userId: { type: 'string' },
		},
	})
	public async getUserActivityAnalyticInfo(ctx: ContextWrapper) {
		const userActivityAnalticInfo = (await AnalyticsDao.getUserActivityAnalyticInfo(ctx)) as UserActivityAnalyticInfoMapper;
		const dbQuestions: Question[] = await AnalyticsDao.getGenericResources(ctx, Question, {
			where: {
				assignedActivityId: userActivityAnalticInfo.assignedActivityId,
			},
		});
		return AnalyticsDto.transformResource(userActivityAnalticInfo, new UserActivityAnalyticInfoMapper());
	}

	@Action({
		params: {
			userId: { type: 'string' },
			universityId: { type: 'string' },
			collegeId: { type: 'string', optional: true },
			sectionId: { type: 'string', optional: true },
			branchId: { type: 'string' },
			semesterId: { type: 'string' },
		},
		auth: {
			ignoreAuthToken: true,
		},
	})
	public async triggerUserAnalytics(ctx: ContextWrapper) {
		await ctx.call('analytics.handleUserAnalytics', { ...ctx.params });
	}

	@Action({
		params: {
			userIds: { type: 'array' }, // 50
			universityId: { type: 'string' },
			collegeId: { type: 'string', optional: true },
			sectionId: { type: 'string', optional: true },
			branchId: { type: 'string' },
			semesterId: { type: 'string' },
		},
		auth: {
			ignoreAuthToken: true,
		},
	})
	public async createCustomAnalyticsForUsers(ctx: ContextWrapper) {
		try {
			const userIds: string[] = ctx.params.userIds;
			if (userIds.length > 100) {
				ErrorHelper.throwError('Users has to be less than 100', 404);
			}
			await async.forEachLimit(userIds, 1, async (e) => {
				ctx.broadcast('analytics.add', { ...ctx.params, userId: e });
			});
		} catch (err) {
			console.log('err::::::::::', err);
		}
	}

	@Action({
		params: {
			userId: { type: 'string' },
			universityId: { type: 'string' },
			collegeId: { type: 'string', optional: true },
			sectionId: { type: 'string', optional: true },
			branchId: { type: 'string' },
			semesterId: { type: 'string' },
		},
		auth: {
			ignoreAuthToken: true,
		},
	})
	public async handleUserAnalytics(ctx: ContextWrapper) {
		const userId: string = ctx.params.userId;
		const userRole: UserRole = await AnalyticsDao.getGenericResource(ctx, UserRole, { where: { userId: userId } });
		const role: Role = await AnalyticsDao.getGenericResource(ctx, Role, { where: { id: userRole.roleId } });
		let userAnalayticsConfig: UserAnalyticsConfig[] = [];

		if (role.name == Constants.Roles.GENERAL_STUDENT) {
			const generalStudentAnalyticsConfigData: UserAnalyticsConfig[] = await AnalyticsDao.getGeneralStudentAnalyticsConfig(ctx);
			userAnalayticsConfig = [...userAnalayticsConfig, ...generalStudentAnalyticsConfigData];
		}

		if (role.name == Constants.Roles.STUDENT) {
			const studentAnalyticsConfigData: UserAnalyticsConfig[] = await AnalyticsDao.getStudentAnalyticsConfig(ctx);
			userAnalayticsConfig = [...userAnalayticsConfig, ...studentAnalyticsConfigData];
		}

		if (userAnalayticsConfig.length) {
			await ActivityHelper.handleUserActivityAnalytics(ctx, userAnalayticsConfig);
		}
	}

	@Action({
		params: {
			assignedActivityIds: {
				type: 'array',
				items: { type: 'string' },
			},
		},
		auth: {
			ignoreAuthToken: true,
		},
	})
	public async deleteUserAnalytics(ctx: ContextWrapper) {
		const userActivityAnalytics: UserActivityAnalytics[] = await AnalyticsDao.getGenericResources(ctx, UserActivityAnalytics, {
			where: {
				activityId: In(ctx.params.assignedActivityIds),
			},
		});

		if (userActivityAnalytics.length) {
			const userAnalyticIds: string[] = [];
			const activityDimIds: string[] = [];
			const timeIds: string[] = [];

			userActivityAnalytics.forEach((uaa) => {
				userAnalyticIds.push(uaa.id);
				activityDimIds.push(uaa.activityDimId);
				timeIds.push(uaa.timeId || '');
			});

			await AnalyticsDao.softDeleteResourceByIds(ctx, UserActivityAnalytics, userAnalyticIds);
			await AnalyticsDao.softDeleteResourceByIds(ctx, ActivityDim, activityDimIds);
			await AnalyticsDao.softDeleteResourceByIds(ctx, TimeDim, timeIds);
		}
	}

	@Action({
		params: {
			subjectId: { type: 'string' },
			semesterId: { type: 'string' },
			collegeId: { type: 'string' },
			branchId: { type: 'string' },
		},
	})
	public async getSubjectKnowledgMapPerformanceStats(ctx: ContextWrapper) {
		return await AnalyticsDao.getSubjectKnowledgMapPerformanceStats(ctx);
	}

	@Action({
		params: {
			subjectId: { type: 'string' },
			semesterId: { type: 'string' },
			collegeId: { type: 'string' },
			branchId: { type: 'string' },
		},
	})
	public async getSubjectKnowledgMapProgressStats(ctx: ContextWrapper) {
		return await AnalyticsDao.getSubjectKnowledgMapProgressStats(ctx);
	}

	@Action({
		params: {
			subjectId: { type: 'string' },
			chapterId: { type: 'string' },
			semesterId: { type: 'string' },
			collegeId: { type: 'string' },
			branchId: { type: 'string' },
		},
	})
	public async getChapterKnowledgMapProgressStats(ctx: ContextWrapper) {
		return await AnalyticsDao.getChapterKnowledgMapProgressStats(ctx);
	}

	@Action({
		params: {
			subjectId: { type: 'string' },
			semesterId: { type: 'string' },
			collegeId: { type: 'string' },
			branchId: { type: 'string' },
		},
	})
	public async getChapterKnowledgMapPerformanceStats(ctx: ContextWrapper) {
		return await AnalyticsDao.getChapterKnowledgMapPerformanceStats(ctx);
	}

	@Action({
		params: {
			subjectId: { type: 'string' },
			chapterId: { type: 'string' },
			topicId: { type: 'string' },
			semesterId: { type: 'string' },
			collegeId: { type: 'string' },
			branchId: { type: 'string' },
		},
	})
	public async getTopicKnowledgMapProgressStats(ctx: ContextWrapper) {
		return await AnalyticsDao.getTopicKnowledgMapProgressStats(ctx);
	}

	@Action({
		params: {
			subjectId: { type: 'string' },
			chapterId: { type: 'string' },
			topicId: { type: 'string' },
			semesterId: { type: 'string' },
			collegeId: { type: 'string' },
			branchId: { type: 'string' },
		},
	})
	public async getTopicKnowledgMapPerformanceStats(ctx: ContextWrapper) {
		return await AnalyticsDao.getTopicKnowledgMapPerformanceStats(ctx);
	}

	@Action({
		params: {
			semesterId: { type: 'string' },
			collegeId: { type: 'string' },
			branchId: { type: 'string' },
			sectionId: { type: 'string' },
		},
	})
	public async getProfessorSubjectAverages(ctx: ContextWrapper) {
		return await AnalyticsDao.getProfessorSubjectAverages(ctx);
	}

	@Action({
		params: {
			userId: { type: 'string' },
			activityDimId: { type: 'string' },
			timeSpent: { type: 'number' },
		},
	})
	public async updateAssessmentAnalytics(ctx: ContextWrapper) {
		await AnalyticsHelper.handleAssessments(ctx, +ctx.params.timeSpent);
	}

	@Action({
		params: {
			topicId: { type: 'string' },
			userId: { type: 'string' },
		},
	})
	public async getTopicAnalysis(ctx: ContextWrapper) {
		return await AnalyticsDao.getUserTestQuestionsForAnalysis(ctx);
	}

	@Action({
		params: {
			userId: { type: 'string' },
		},
	})
	public async getUserInProgressTopics(ctx: ContextWrapper) {
		return await AnalyticsDao.getUserInprogressTopics(ctx);
	}

	@Action({
		params: {
			userId: { type: 'string' },
		},
	})
	public async getRecommendedLearningTopics(ctx: ContextWrapper) {
		return await AnalyticsDao.getRecommendedLearningTopics(ctx);
	}

	@Action({
		params: {
			semesterId: { type: 'string' },
			collegeId: { type: 'string' },
			branchId: { type: 'string' },
		},
	})
	public async getSubjectPreAndPostTestProfessorDashboard(ctx: ContextWrapper) {
		return await AnalyticsDao.getSubjectPreAndPostTestProfessorDashboard(ctx);
	}

	@Action({
		params: {
			subjectId: { type: 'string' },
			semesterId: { type: 'string' },
			collegeId: { type: 'string' },
			branchId: { type: 'string' },
		},
	})
	public async getSubjectPreAndPostTestProfessorAnalysis(ctx: ContextWrapper) {
		return await AnalyticsDao.getSubjectPreAndPostTestProfessorAnalysis(ctx);
	}

	@Action({
		params: {
			semesterId: { type: 'string' },
			collegeId: { type: 'string' },
			branchId: { type: 'string' },
		},
	})
	public async getBloomTaxonomyProfessorDashboard(ctx: ContextWrapper) {
		return await AnalyticsDao.getBloomTaxonomyProfessorDashboard(ctx);
	}

	@Action({
		params: {
			chapterId: { type: 'string' },
			subjectId: { type: 'string' },
			semesterId: { type: 'string' },
			collegeId: { type: 'string' },
			branchId: { type: 'string' },
		},
	})
	public async getChapterPreAndPostTestProfessorAnalysis(ctx: ContextWrapper) {
		return await AnalyticsDao.getChapterPreAndPostTestProfessorAnalysis(ctx);
	}

	@Action({
		params: {
			topicId: { type: 'string' },
			chapterId: { type: 'string' },
			subjectId: { type: 'string' },
			semesterId: { type: 'string' },
			collegeId: { type: 'string' },
			branchId: { type: 'string' },
		},
	})
	public async getTopicPreAndPostTestProfessorAnalysis(ctx: ContextWrapper) {
		return await AnalyticsDao.getTopicPreAndPostTestProfessorAnalysis(ctx);
	}

	@Action({
		params: {
			topicId: { type: 'string', optional: true },
			chapterId: { type: 'string', optional: true },
			subjectId: { type: 'string' },
			semesterId: { type: 'string' },
			collegeId: { type: 'string' },
			branchId: { type: 'string' },
		},
	})
	public async getBloomTaxonomyProfessorAnalysis(ctx: ContextWrapper) {
		return await AnalyticsDao.getBloomTaxonomyProfessorAnalysis(ctx);
	}

	@Action({
		params: {
			topicId: { type: 'string', optional: true },
			chapterId: { type: 'string', optional: true },
			subjectId: { type: 'string' },
			semesterId: { type: 'string' },
			collegeId: { type: 'string' },
			branchId: { type: 'string' },
		},
	})
	public async getCompletionRateProfessorAnalysis(ctx: ContextWrapper) {
		return await AnalyticsDao.getCompletionRateProfessorAnalysis(ctx);
	}

	//TODO: clean-up needed
	@Action({
		params: {
			sectionId: { type: 'string' },
		},
	})
	public async getUsersWeeklyEngagementInfo(ctx: ContextWrapper) {
		return await AnalyticsDao.getRecommendedLearningTopics(ctx);
	}

	@Action({
		params: {
			branchId: { type: 'string' },
			sectionId: { type: 'string' },
		},
	})
	public async getUsersSubjectProgressInfo(ctx: ContextWrapper) {
		return await AnalyticsDao.getRecommendedLearningTopics(ctx);
	}

	@Action({
		params: {
			sectionId: { type: 'string' },
		},
	})
	public async getUsersPreVsPostInfo(ctx: ContextWrapper) {
		return await AnalyticsDao.getRecommendedLearningTopics(ctx);
	}

	@Action({
		params: {
			branchId: { type: 'string' },
			sectionId: { type: 'string' },
		},
	})
	public async getBloomTaxonomyInfo(ctx: ContextWrapper) {
		return await AnalyticsDao.getRecommendedLearningTopics(ctx);
	}

	@Action({
		params: {
			sectionId: { type: 'string' },
			subjectId: { type: 'string' },
		},
	})
	public async getSubjectKnowledgeMapData(ctx: ContextWrapper) {
		return await AnalyticsDao.getRecommendedLearningTopics(ctx);
	}

	@Action({
		params: {
			chapterId: { type: 'string', optional: true },
			assignedActivityIds: { type: 'array' },
		},
		auth: {
			ignoreAuthToken: true,
		},
	})
	public async updateUserAnalytics(ctx: ContextWrapper) {
		const chapterId: string = ctx.params.chapterId;
		const userAnalayticsConfig: UserAnalyticsConfig[] = await AnalyticsDao.getStudentAnalyticsConfigWithAssignedActivity(
			ctx,
			ctx.params.assignedActivityIds,
			chapterId,
		);

		if (userAnalayticsConfig.length) {
			await ActivityHelper.handleUserActivityAnalytics(ctx, userAnalayticsConfig);
		}
	}

	@Action({
		params: {
			chapterId: { type: 'string', optional: true },
			assignedActivityIds: { type: 'array' },
		},
		auth: {
			ignoreAuthToken: true,
		},
	})
	public async updateUserAssesmentAnalytics(ctx: ContextWrapper) {
		const userAnalayticsConfig: UserAnalyticsConfig[] = await AnalyticsDao.getStudentAnalyticsConfigWithAssignedActivityQuestion(
			ctx,
			ctx.params.assignedActivityIds,
			ctx.params.chapterId,
		);

		if (userAnalayticsConfig.length) {
			await ActivityHelper.handleUserActivityAnalytics(ctx, userAnalayticsConfig);
		}
	}

	@Action({
		params: {
			assignedActivityIds: { type: 'array' },
			topicId: { type: 'string', optional: true },
		},
		auth: {
			ignoreAuthToken: true,
		},
	})
	public async triggerDeleteUserAnalytics(ctx: ContextWrapper) {
		console.log('triggerDeleteUserAnalytics::::::::::', ctx.params.assignedActivityIds, ctx.params.topicId);
		await AnalyticsDao.softDeleteAnalytics(ctx.params.assignedActivityIds, ctx.params.topicId);
	}

	@Action({
		params: {},
		auth: {
			ignoreAuthToken: true,
		},
	})
	public async computeUserProgressAnalytics(ctx: ContextWrapper) {
		const userActivityAnalytics = ctx.params.userActivityAnalytics;
		const chapterProgress = await AnalyticsDao.getChapterProgress(userActivityAnalytics.userId, userActivityAnalytics.chapterId);
		let userChapterProgress: UserAnalyticsProgress = await AnalyticsDao.getGenericResource(ctx, UserAnalyticsProgress, {
			where: {
				userId: userActivityAnalytics.userId,
				chapterId: userActivityAnalytics.chapterId,
				progressType: UserProgressAnalyticsType.Chapter,
			},
		});

		userChapterProgress = AnalyticsHelper.setUserAnalyticsProgressDetails(
			userChapterProgress ? userChapterProgress : new UserAnalyticsProgress(),
			userActivityAnalytics,
			UserProgressAnalyticsType.Chapter,
			chapterProgress.progress || 0,
		);
		userChapterProgress = await AnalyticsDao.saveGenericResource(ctx, userChapterProgress);

		const topicProgress = await AnalyticsDao.getTopicProgress(userActivityAnalytics.userId, userActivityAnalytics.topicId);
		let userTopicProgress: UserAnalyticsProgress = await AnalyticsDao.getGenericResource(ctx, UserAnalyticsProgress, {
			where: {
				userId: userActivityAnalytics.userId,
				chapterId: userActivityAnalytics.chapterId,
				topicId: userActivityAnalytics.topicId,
				progressType: UserProgressAnalyticsType.Topic,
			},
		});

		userTopicProgress = AnalyticsHelper.setUserAnalyticsProgressDetails(
			userTopicProgress ? userTopicProgress : new UserAnalyticsProgress(),
			userActivityAnalytics,
			UserProgressAnalyticsType.Topic,
			topicProgress.progress || 0,
		);
		userTopicProgress = await AnalyticsDao.saveGenericResource(ctx, userTopicProgress);
	}
}

module.exports = new AnalyticsService();
