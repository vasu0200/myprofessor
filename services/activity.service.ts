import { ActivityDao } from '@Dao/activity.dao';
import { BaseDao } from '@Dao/base.dao';
import { ContextWrapper } from '@Helpers/molecular-helper';
import { Activity } from '@Models/activity';
import { AssignedActivity, AssignedActivityInfoByUniversalTopic } from '@Models/assigned-activity';
import { Constants } from '@Utility/constants';
import { Action, Method } from 'moleculer-decorators';
import { In } from 'typeorm';
import async from 'async';
import { ActivityHelper } from '@Helpers/service-helpers/activity.helper';
import { ErrorHelper } from '@Helpers/error-helper';
import { Messages } from '@Utility/Messages';
import {
	ActivityDto,
	ActivitiesMapper,
	AssignedActivityMapper,
	ActivityInfoMapper,
	QuestionMapper,
	OptionMapper,
	UniversalTopicAssignedActivityMapper,
} from 'src/dto/activity.dto';
import { ActivityInfo } from '@Models/activity-info';
import { Question } from '@Models/question';
import { Option } from '@Models/option';
import AuthSchema from './auth';
import { TargetSourceType } from '@Utility/enum';
import SystemHelper from '@Helpers/system-helpers';

export default class ActivityService extends AuthSchema {
	public name: string = 'activity';
	public static QUESTION_PARAMS = {
		assignedActivityId: { type: 'string' },
		question: { type: 'string' },
		solution: { type: 'string' },
		explanation: { type: 'string' },
		marks: { type: 'number' },
		diffLevel: { type: 'string' },
		questionType: { type: 'string' },
	};

	@Action({
		auth: {
			ignoreAuthToken: true,
		},
	})
	public async getActivities(ctx: ContextWrapper): Promise<ActivitiesMapper[]> {
		const activities: Activity[] = await BaseDao.getGenericResources(ctx, Activity, { where: {} });
		return ActivityDto.transformResources(activities, new ActivitiesMapper());
	}

	// TODO: This should provide both teacher and admin resources
	@Action({
		params: {
			topicId: { type: 'string' },
			resourceType: { type: 'string' },
		},
	})
	public async getAssignedActivities(ctx: ContextWrapper): Promise<AssignedActivityMapper[]> {
		const assignedActivities = await ActivityDao.getAssignedActivites(ctx.params.topicId, ctx.params.resourceType);
		return ActivityDto.transformResources(assignedActivities, new AssignedActivityMapper());
	}

	// TODO: assign activities specific to teacher resource
	@Action({
		params: {
			topicId: { type: 'string' },
			activities: {
				type: 'array',
				items: {
					type: 'object',
					props: {
						id: 'string',
						seq: 'number',
						activityId: 'string',
					},
				},
			},
		},
	})
	public async assignActivities(ctx: ContextWrapper) {
		const activities: { id: string; seq: number; activityId: string }[] = ctx.params.activities;
		const uniqueActivityIds: string[] = [...new Set(activities.map((a) => a.activityId))];
		const newActivitiesToAssign = activities.filter((e) => e.id == '-1');
		const activitiesToUpdate = activities.filter((e) => e.id != '-1');
		const defaultActivities: Activity[] = await ActivityDao.getGenericResources(ctx, Activity, { where: { id: In(uniqueActivityIds) } }, true);
		const assignedActivities: AssignedActivity[] = await ActivityDao.getGenericResources(
			ctx,
			AssignedActivity,
			{
				where: {
					topicId: ctx.params.topicId,
					resourceType: TargetSourceType.Professor,
				},
			},
			true,
		);

		// update existing activities
		await async.forEachLimit(assignedActivities, 1, async (activity: AssignedActivity) => {
			const newSeq: number = activitiesToUpdate.find((a) => a.id == activity.id)?.seq || -1;
			newSeq != -1 ? (activity.seq = newSeq) : await ActivityDao.softDeleteResource(ctx, activity);
			await ActivityDao.saveGenericResource(ctx, activity);
		});

		// assignActivity for new activities
		await async.forEachLimit(newActivitiesToAssign, 1, async (e) => {
			const assignActivity: AssignedActivity = ActivityHelper.setActivityDetails(
				ctx,
				e,
				new AssignedActivity(),
				defaultActivities,
				TargetSourceType.Professor,
			);
			await ActivityDao.saveGenericResource(ctx, assignActivity);
		});
	}

	@Action({
		params: {
			topicId: { type: 'string' },
			assignedActivityId: { type: 'string' },
			name: { type: 'string' },
		},
	})
	public async updateActivity(ctx: ContextWrapper): Promise<AssignedActivityMapper> {
		// check assignedActivity
		let assignedActivity: AssignedActivity = await this.getAssignedActivity(ctx, ctx.params.topicId, ctx.params.assignedActivityId);
		assignedActivity.name = ctx.params.name;
		assignedActivity = await ActivityDao.saveGenericResource(ctx, assignedActivity);
		return ActivityDto.transformResource(assignedActivity, new AssignedActivityMapper());
	}

	@Action({
		params: {
			topicId: { type: 'string' },
			assignedActivityId: { type: 'string' },
		},
	})
	public async deleteActivity(ctx: ContextWrapper): Promise<boolean> {
		// check assignedActivity
		const assignedActivity: AssignedActivity = await this.getAssignedActivity(ctx, ctx.params.topicId, ctx.params.assignedActivityId);

		if (!assignedActivity) {
			ErrorHelper.throwError(Messages.INVALID_ACTIVITY, 400, Constants.SYSTEM_EXCEPTION_TYPES.DATA_NOT_FOUND);
		}

		// delete activityInfo
		await ActivityDao.softDeleteResource(ctx, assignedActivity);

		// handle activityInfo & question deletion
		await ActivityHelper.handleAssignedActivityDelete(ctx, assignedActivity.id);

		// await ActivityDao.softDeleteResource(ctx, assignedActivity, ActivityInfo, { where: { assignedActivityId: assignedActivity.id } });

		// delete user activity
		// ctx.broadcast('analytics.delete', { assignedActivityIds: [assignedActivity.id] });

		return true;
	}

	@Action({
		params: {
			assignedActivityId: { type: 'string' },
			fileData: { type: 'string', optional: true },
			url: { type: 'string', optional: true },
			duration: { type: 'number', optional: true },
			pdfPages: { type: 'number', optional: true },
			validPdfPages: { type: 'string', optional: true },
		},
	})
	public async addActivityInfo(ctx: ContextWrapper): Promise<ActivityInfoMapper> {
		let activityInfo: ActivityInfo = await ActivityHelper.setActivityInfoDetails(ctx, new ActivityInfo());
		activityInfo = await ActivityDao.saveGenericResource(ctx, activityInfo);

		// TODO: add teacher activity
		// update analytics for new activity
		ctx.broadcast('analytics.update', { assignedActivityIds: [ctx.params.assignedActivityId] });

		return ActivityDto.transformResource(activityInfo, new ActivityInfoMapper());
	}

	@Action({
		params: {},
		auth: {
			ignoreAuthToken: true,
		},
	})
	public async addZipFilesActivityInfo(ctx: ContextWrapper) {
		// add check to accept only zip files
		let activityInfo: ActivityInfo = await ActivityHelper.setHtml5ActivityInfo(ctx, new ActivityInfo());
		activityInfo = await ActivityDao.saveGenericResource(ctx, activityInfo);

		// TODO: add teacher activity
		// update analytics for new activity
		ctx.broadcast('analytics.update', { assignedActivityIds: [activityInfo.assignedActivityId], activityId: activityInfo.id });

		return ActivityDto.transformResource(activityInfo, new ActivityInfoMapper());
	}

	@Action({
		params: {},
		auth: {
			ignoreAuthToken: true,
		},
	})
	public async updateZipFilesActivityInfo(ctx: ContextWrapper) {
		let activityInfo: ActivityInfo = await ActivityDao.getGenericResource(ctx, ActivityInfo, {
			where: { id: ctx.meta.$multipart.activityInfoId, assignedActivityId: ctx.meta.$multipart.assignedActivityId },
		});

		if (!activityInfo) {
			ErrorHelper.throwError(Messages.INVALID_ACTIVITY, 400, Constants.SYSTEM_EXCEPTION_TYPES.DATA_NOT_FOUND);
		}

		// add check to accept only zip files
		activityInfo = await ActivityHelper.setHtml5ActivityInfo(ctx, activityInfo);
		activityInfo = await ActivityDao.saveGenericResource(ctx, activityInfo);

		return ActivityDto.transformResource(activityInfo, new ActivityInfoMapper());
	}

	@Action({
		params: {
			assignedActivityId: { type: 'string' },
			activityInfoId: { type: 'string' },
		},
	})
	public async getActivityInfo(ctx: ContextWrapper): Promise<ActivityInfoMapper> {
		let activityInfo: ActivityInfo = await ActivityDao.getGenericResource(ctx, ActivityInfo, {
			where: { id: ctx.params.activityInfoId, assignedActivityId: ctx.params.assignedActivityId },
		});

		if (!activityInfo) {
			ErrorHelper.throwError(Messages.INVALID_ACTIVITY, 400, Constants.SYSTEM_EXCEPTION_TYPES.DATA_NOT_FOUND);
		}
		return ActivityDto.transformResource(activityInfo, new ActivityInfoMapper());
	}

	@Action({
		params: {
			assignedActivityId: { type: 'string' },
			activityInfoId: { type: 'string' },
			fileData: { type: 'string', optional: true },
			url: { type: 'string', optional: true },
			duration: { type: 'number', optional: true },
			pdfPages: { type: 'number', optional: true },
			validPdfPages: { type: 'string', optional: true },
		},
	})
	public async updateActivityInfo(ctx: ContextWrapper) {
		let activityInfo: ActivityInfo = await ActivityDao.getGenericResource(ctx, ActivityInfo, {
			where: { id: ctx.params.activityInfoId, assignedActivityId: ctx.params.assignedActivityId },
		});

		if (!activityInfo) {
			ErrorHelper.throwError(Messages.INVALID_ACTIVITY, 400, Constants.SYSTEM_EXCEPTION_TYPES.DATA_NOT_FOUND);
		}

		activityInfo = await ActivityHelper.setActivityInfoDetails(ctx, activityInfo);
		activityInfo = await ActivityDao.saveGenericResource(ctx, activityInfo);

		return ActivityDto.transformResource(activityInfo, new ActivityInfoMapper());
	}

	@Action({
		params: {
			universalTopicId: { type: 'string' },
		},
	})
	public async getUniversalTopicAssignedActivities(ctx: ContextWrapper) {
		const assignedActivities = await ActivityDao.getUniversalTopicAssignedActivites(ctx.params.universalTopicId);
		return ActivityDto.transformResources(assignedActivities, new UniversalTopicAssignedActivityMapper());
	}

	@Action({
		params: {
			universalTopicId: { type: 'string' },
			activities: {
				type: 'array',
				items: {
					type: 'object',
					props: {
						id: 'string',
						seq: 'number',
						activityId: 'string',
					},
				},
			},
		},
	})
	public async assignUniversalTopicActivities(ctx: ContextWrapper) {
		const activities: { id: string; seq: number; activityId: string }[] = ctx.params.activities;
		const uniqueActivityIds: string[] = [...new Set(activities.map((a) => a.activityId))];
		const newActivitiesToAssign = activities.filter((e) => e.id == '-1');
		const activitiesToUpdate = activities.filter((e) => e.id != '-1');
		const defaultActivities: Activity[] = await ActivityDao.getGenericResources(ctx, Activity, { where: { id: In(uniqueActivityIds) } }, true);
		const assignedActivities: AssignedActivity[] = await ActivityDao.getGenericResources(
			ctx,
			AssignedActivity,
			{
				where: {
					universalTopicId: ctx.params.universalTopicId,
					resourceType: TargetSourceType.Admin,
				},
			},
			true,
		);

		// update existing activities
		await async.forEachLimit(assignedActivities, 1, async (activity: AssignedActivity) => {
			const newSeq: number = activitiesToUpdate.find((a) => a.id == activity.id)?.seq || -1;
			newSeq != -1 ? (activity.seq = newSeq) : await ActivityDao.softDeleteResource(ctx, activity);
			await ActivityDao.saveGenericResource(ctx, activity);
		});

		// assignActivity for new activities
		await async.forEachLimit(newActivitiesToAssign, 1, async (e) => {
			const assignActivity: AssignedActivity = ActivityHelper.setActivityDetails(
				ctx,
				e,
				new AssignedActivity(),
				defaultActivities,
				TargetSourceType.Admin,
			);
			await ActivityDao.saveGenericResource(ctx, assignActivity);
		});
	}

	@Action({
		params: {
			universalTopicId: { type: 'string' },
			assignedActivityId: { type: 'string' },
			name: { type: 'string' },
		},
	})
	public async updateUniversalTopicActivity(ctx: ContextWrapper) {
		// check assignedActivity
		let assignedActivity: AssignedActivity = await this.getUniversalTopicAssignedActivity(
			ctx,
			ctx.params.universalTopicId,
			ctx.params.assignedActivityId,
		);
		assignedActivity.name = ctx.params.name;
		assignedActivity = await ActivityDao.saveGenericResource(ctx, assignedActivity);
		return ActivityDto.transformResource(assignedActivity, new AssignedActivityMapper());
	}

	@Action({
		params: {
			universalTopicId: { type: 'string' },
			assignedActivityId: { type: 'string' },
		},
	})
	public async deleteUniversalTopicActivity(ctx: ContextWrapper) {
		// check assignedActivity
		const assignedActivity: AssignedActivity = await this.getUniversalTopicAssignedActivity(
			ctx,
			ctx.params.universalTopicId,
			ctx.params.assignedActivityId,
		);

		if (!assignedActivity) {
			ErrorHelper.throwError(Messages.INVALID_ACTIVITY, 400, Constants.SYSTEM_EXCEPTION_TYPES.DATA_NOT_FOUND);
		}

		// delete activityInfo
		await ActivityDao.softDeleteResource(ctx, assignedActivity);

		// handle activityInfo & question deletion
		await ActivityHelper.handleAssignedActivityDelete(ctx, assignedActivity.id);
		return true;
	}

	@Action({
		params: {
			universalTopicId: { type: 'string' },
			topicId: { type: 'string' },
		},
	})
	public async addActivitiesForTopic(ctx: ContextWrapper) {
		const currentActivities: AssignedActivityInfoByUniversalTopic[] = await ActivityDao.getUniversalTopicAssignedActivites(
			ctx.params.universalTopicId,
		);

		if (!currentActivities.length) {
			return;
		}

		await async.forEachLimit(currentActivities, 1, async (activity: AssignedActivityInfoByUniversalTopic) => {
			let newActivity = new AssignedActivity();
			newActivity = ActivityHelper.setUniversalTopicActivityDetails(ctx, activity, newActivity);
			await ActivityDao.saveGenericResource(ctx, newActivity);
		});
	}

	@Action({
		params: {
			universalTopicId: { type: 'string' },
			topicId: { type: 'string' },
		},
	})
	public async deleteActivitiesForTopic(ctx: ContextWrapper) {
		// TODO: quick prod fix, should rename the action name and clean up data
		const currentActivities: AssignedActivity[] = await ActivityDao.getGenericResources(
			ctx,
			AssignedActivity,
			{ where: { universalTopicId: ctx.params.universalTopicId, resourceType: TargetSourceType.Admin } },
			true,
		);

		if (!currentActivities.length) {
			return;
		}

		const assignedActivityIds: string[] = currentActivities.map((e) => e.id);

		// await ActivityDao.softDeleteResourceByIds(ctx, AssignedActivity, assignedActivityIds);

		// delete user activity
		ctx.broadcast('analytics.delete', { assignedActivityIds: assignedActivityIds, topicId: ctx.params.topicId });
	}

	@Action({
		params: {
			assignedActivityId: { type: 'string' },
		},
	})
	public async getQuestions(ctx: ContextWrapper): Promise<QuestionMapper[]> {
		// get assignedActivity
		const assignedActivity: AssignedActivity = await ActivityDao.getGenericResource(ctx, AssignedActivity, {
			where: { id: ctx.params.assignedActivityId },
		});

		if (!assignedActivity) {
			ErrorHelper.throwError(Messages.INVALID_ACTIVITY, 400, Constants.SYSTEM_EXCEPTION_TYPES.DATA_NOT_FOUND);
		}

		const questions: Question[] = await ActivityDao.getGenericResources(
			ctx,
			Question,
			{ where: { assignedActivityId: ctx.params.assignedActivityId } },
			true,
		);
		return ActivityDto.transformResources(questions, new QuestionMapper());
	}

	@Action({
		params: {
			...ActivityService.QUESTION_PARAMS,
			options: {
				type: 'array',
				items: {
					type: 'object',
					props: {
						value: 'string',
						key: 'string',
					},
				},
			},
		},
	})
	public async addQuestion(ctx: ContextWrapper): Promise<{ question: QuestionMapper; options: OptionMapper[] }> {
		const paramOptions: { key: string; value: string }[] = ctx.params.options;
		const newOptions: Option[] = [];

		// add question
		let newquestion: Question = ActivityHelper.setQuestionInfo(ctx, new Question());
		newquestion = await ActivityDao.saveGenericResource(ctx, newquestion);

		// add options
		await async.forEachLimit(paramOptions, 1, async (e) => {
			let newOption = ActivityHelper.setOptionInfo(e, new Option());
			newOption.questionId = newquestion.id;
			newOption = await ActivityDao.saveGenericResource(ctx, newOption);
			newOptions.push(newOption);
		});

		// transform using Dto
		const question: QuestionMapper = ActivityDto.transformResource(newquestion, new QuestionMapper());
		const options: OptionMapper[] = ActivityDto.transformResources(newOptions, new OptionMapper());

		// update analytics for new activity
		ctx.broadcast('analytics.assessmentsUpdate', { assignedActivityIds: [ctx.params.assignedActivityId] });

		return { question, options };
	}

	@Action({
		params: {
			...ActivityService.QUESTION_PARAMS,
			questionId: { type: 'string' },
			options: {
				type: 'array',
				items: {
					type: 'object',
					props: {
						id: 'string',
						value: 'string',
						key: 'string',
					},
				},
			},
		},
	})
	public async updateQuestion(ctx: ContextWrapper): Promise<{ question: QuestionMapper; options: OptionMapper[] }> {
		const paramOptions: { id: string; key: string; value: string }[] = ctx.params.options;
		let dbQuestion: Question = await ActivityDao.getGenericResource(ctx, Question, { where: { id: ctx.params.questionId } });

		if (!dbQuestion) {
			ErrorHelper.throwError(Messages.INVALID_QUESTION, 400, Constants.SYSTEM_EXCEPTION_TYPES.DATA_NOT_FOUND);
		}

		// update question
		dbQuestion = ActivityHelper.setQuestionInfo(ctx, dbQuestion);
		dbQuestion = await ActivityDao.saveGenericResource(ctx, dbQuestion);
		const dbOptions: Option[] = await ActivityDao.getGenericResources(ctx, Option, { where: { questionId: dbQuestion.id } }, true);

		// options to add
		const optionsToAdd = paramOptions.filter((e) => e.id == '-1');
		await async.forEachLimit(optionsToAdd, 1, async (e) => {
			let newOption: Option = ActivityHelper.setOptionInfo({ key: e.key, value: e.value }, new Option());
			newOption.questionId = dbQuestion.id;
			newOption = await ActivityDao.saveGenericResource(ctx, newOption);
		});

		// options to update
		await async.forEachLimit(dbOptions, 1, async (e: Option) => {
			const paramOption = paramOptions.find((po) => po.id == e.id);
			if (paramOption) {
				e = ActivityHelper.setOptionInfo({ key: paramOption.key, value: paramOption.value }, e);
			} else {
				await ActivityDao.softDeleteResource(ctx, e);
			}
			e = await ActivityDao.saveGenericResource(ctx, e);
		});

		// updated options
		const updatedOptions: Option[] = await ActivityDao.getGenericResources(ctx, Option, { where: { questionId: dbQuestion.id } });

		// transform using Dto
		const question: QuestionMapper = ActivityDto.transformResource(dbQuestion, new QuestionMapper());
		const options: OptionMapper[] = ActivityDto.transformResources(updatedOptions, new OptionMapper());
		return { question, options };
	}

	@Action({
		params: {
			assignedActivityId: { type: 'string' },
			questionId: { type: 'string' },
		},
	})
	public async getOptions(ctx: ContextWrapper): Promise<{ question: QuestionMapper; options: OptionMapper[] }> {
		const dbQuestion: Question = await ActivityDao.getGenericResource(ctx, Question, { where: { id: ctx.params.questionId } });

		if (!dbQuestion) {
			ErrorHelper.throwError(Messages.INVALID_QUESTION, 400, Constants.SYSTEM_EXCEPTION_TYPES.DATA_NOT_FOUND);
		}

		const dbOptions: Option[] = await ActivityDao.getGenericResources(ctx, Option, { where: { questionId: dbQuestion.id } });

		// transform using Dto
		const question: QuestionMapper = ActivityDto.transformResource(dbQuestion, new QuestionMapper());
		const options: OptionMapper[] = ActivityDto.transformResources(dbOptions, new OptionMapper());

		return { question, options };
	}

	@Action({
		params: {
			assignedActivityId: { type: 'string' },
			questionId: { type: 'string' },
		},
	})
	public async deleteQuestion(ctx: ContextWrapper) {
		const question: Question = await ActivityDao.getGenericResource(ctx, Question, { where: { id: ctx.params.questionId } });

		if (!question) {
			ErrorHelper.throwError(Messages.INVALID_QUESTION, 400, Constants.SYSTEM_EXCEPTION_TYPES.DATA_NOT_FOUND);
		}

		// delete options
		const options: Option[] = await ActivityDao.getGenericResources(ctx, Option, { where: { questionId: question.id } }, true);
		if (options.length) {
			await ActivityDao.softDeleteResourceByIds(
				ctx,
				Option,
				options.map((e) => e.id),
			);
		}

		// delete question
		await ActivityDao.softDeleteResource(ctx, question);
		return true;
	}

	@Action({
		params: {
			questionId: { type: 'string' },
			optionId: { type: 'string' },
		},
	})
	public async deleteOption(ctx: ContextWrapper) {
		const question: Question = await ActivityDao.getGenericResource(ctx, Question, { where: { id: ctx.params.questionId } });

		if (!question) {
			ErrorHelper.throwError(Messages.INVALID_QUESTION, 400, Constants.SYSTEM_EXCEPTION_TYPES.DATA_NOT_FOUND);
		}

		const option: Option = await ActivityDao.getGenericResource(ctx, Option, { where: { id: ctx.params.optionId, questionId: question.id } });

		// delete option
		await ActivityDao.softDeleteResource(ctx, option);
	}

	@Action({
		params: {
			assignedActivityId: { type: 'string' },
		},
	})
	// TODO: this is temporary fix, should clean up based on timeInSec & videoId
	public async getQuestionsForVideoActivities(ctx: ContextWrapper): Promise<QuestionMapper[]> {
		// get assignedActivity
		const assignedActivity: AssignedActivity = await ActivityDao.getGenericResource(ctx, AssignedActivity, {
			where: { id: ctx.params.assignedActivityId },
		});

		if (!assignedActivity) {
			ErrorHelper.throwError(Messages.INVALID_ACTIVITY, 400, Constants.SYSTEM_EXCEPTION_TYPES.DATA_NOT_FOUND);
		}

		// clean this up with new query
		const questions: Question[] = await ActivityDao.getGenericResources(
			ctx,
			Question,
			{ where: { assignedActivityId: ctx.params.assignedActivityId } },
			true,
		);

		if (questions.length) {
			await async.forEachLimit(questions, 1, async (q: Question) => {
				q.options = await ActivityDao.getGenericResources(ctx, Option, { where: { questionId: q.id } }, true);
			});
		}

		return questions;
	}

	@Action({
		auth: {
			ignoreAuthToken: true,
		},
	})
	public async ckEditorUpload(ctx: ContextWrapper) {
		ctx.params.file = await SystemHelper.convertFileStreamToBase64(ctx.params);
		ctx.params.contentType = ctx.meta.mimetype;
		return await ActivityHelper.setCkEditorImageDetails(ctx);
	}

	@Method
	private async getAssignedActivity(ctx: ContextWrapper, topicId: number, assignedActivityId: number): Promise<AssignedActivity> {
		const assignedActivity: AssignedActivity = await ActivityDao.getGenericResource(ctx, AssignedActivity, {
			where: { topicId: topicId, id: assignedActivityId },
		});

		if (!assignedActivity) {
			ErrorHelper.throwError(Messages.INVALID_ACTIVITY, 400, Constants.SYSTEM_EXCEPTION_TYPES.DATA_NOT_FOUND);
		}

		return assignedActivity;
	}

	@Method
	private async getUniversalTopicAssignedActivity(
		ctx: ContextWrapper,
		universalTopicId: number,
		assignedActivityId: number,
	): Promise<AssignedActivity> {
		const assignedActivity: AssignedActivity = await ActivityDao.getGenericResource(ctx, AssignedActivity, {
			where: { universalTopicId: universalTopicId, id: assignedActivityId },
		});

		if (!assignedActivity) {
			ErrorHelper.throwError(Messages.INVALID_ACTIVITY, 400, Constants.SYSTEM_EXCEPTION_TYPES.DATA_NOT_FOUND);
		}

		return assignedActivity;
	}
}

module.exports = new ActivityService();
