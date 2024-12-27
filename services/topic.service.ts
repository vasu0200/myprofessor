import { TopicDao } from '@Dao/topic.dao';
import { ErrorHelper } from '@Helpers/error-helper';
import { ContextWrapper } from '@Helpers/molecular-helper';
import { TopicHelper } from '@Helpers/service-helpers/topic.helper';
import { Topic } from '@Models/topic';
import { Constants } from '@Utility/constants';
import { Messages } from '@Utility/Messages';
import { Action } from 'moleculer-decorators';
import { PagedResponse } from 'src/dto/base.dto';
import { TeacherTopicMapper, TopicDto, TopicMapper } from 'src/dto/topic.dto';
import AuthSchema from './auth';
import { AssignedActivity } from '@Models/assigned-activity';
import { TargetSourceType } from '@Utility/enum';

export default class TopicService extends AuthSchema {
	public name: string = 'topic';
	public static TOPIC_PARAMS = {
		name: { type: 'string' },
		code: { type: 'string' },
		description: { type: 'string', optional: true },
		idx: { type: 'number' },
		image: { type: 'string' },
		chapterId: { type: 'string' },
		universalTopicId: { type: 'string', optional: true },
	};

	@Action({
		params: {
			...Constants.DEFAULT_PAGINATION_PARAMS,
			chapterId: { type: 'string' },
		},
	})
	public async getTopics(ctx: ContextWrapper): Promise<PagedResponse<TopicMapper>> {
		const topics = await TopicDao.getTopics(ctx);
		topics.items = TopicDto.transformResources(topics.items, new TopicMapper());
		return topics;
	}

	@Action({
		params: {
			...Constants.DEFAULT_PAGINATION_PARAMS,
			chapterId: { type: 'string' },
		},
	})
	public async getProfessorTopics(ctx: ContextWrapper): Promise<PagedResponse<TopicMapper>> {
		const topics = await TopicDao.getProfessorTopics(ctx);
		return topics;
	}

	@Action({
		params: {
			...TopicService.TOPIC_PARAMS,
			resourceType: { type: 'enum', values: [TargetSourceType.Admin, TargetSourceType.Professor], optional: true },
		},
	})
	public async addTopic(ctx: ContextWrapper) {
		let newTopic: Topic = await TopicHelper.setTopicDetails(ctx, new Topic());
		newTopic = await TopicDao.saveGenericResource(ctx, newTopic);

		if (newTopic.universalTopicId) {
			const assignedActivites: AssignedActivity[] = await TopicDao.getGenericResources(ctx, AssignedActivity, {
				where: { universalTopicId: newTopic.universalTopicId },
			});

			if (assignedActivites.length) {
				const assignedActivityIds = assignedActivites.map((e) => e.id);

				// update activities
				ctx.broadcast('analytics.update', { assignedActivityIds: assignedActivityIds, chapterId: newTopic.chapterId });

				// update questions
				ctx.broadcast('analytics.assessmentsUpdate', { assignedActivityIds: assignedActivityIds, chapterId: newTopic.chapterId });
			}
		}

		return TopicDto.transformResource(newTopic, new TopicMapper());
	}

	@Action({
		params: {
			topicId: { type: 'string' },
			chapterId: { type: 'string' },
		},
	})
	public async getTopic(ctx: ContextWrapper) {
		const topic: Topic = await TopicDao.getTopic(ctx);

		if (!topic) {
			ErrorHelper.throwError(Messages.INVALID_TOPIC, 400, Constants.SYSTEM_EXCEPTION_TYPES.DATA_NOT_FOUND);
		}

		return TopicDto.transformResource(topic, new TopicMapper());
	}

	@Action({
		params: {
			topicId: { type: 'string' },
			...TopicService.TOPIC_PARAMS,
		},
	})
	public async updateTopic(ctx: ContextWrapper) {
		let topic: Topic = await TopicDao.getGenericResource(ctx, Topic, {
			where: { id: ctx.params.topicId, chapterId: ctx.params.chapterId },
		});

		if (!topic) {
			ErrorHelper.throwError(Messages.INVALID_TOPIC, 400, Constants.SYSTEM_EXCEPTION_TYPES.DATA_NOT_FOUND);
		}

		topic = await TopicHelper.setTopicDetails(ctx, topic);
		topic = await TopicDao.saveGenericResource(ctx, topic);
		return TopicDto.transformResource(topic, new TopicMapper());
	}

	@Action({
		params: {
			topicId: { type: 'string' },
		},
	})
	public async deleteTopic(ctx: ContextWrapper) {
		// TODO: re-visit and clean up this code, writing more specific to super-admin
		const topic: Topic = await TopicDao.getGenericResource(ctx, Topic, {
			where: { id: ctx.params.topicId, chapterId: ctx.params.chapterId },
		});

		if (!topic) {
			ErrorHelper.throwError(Messages.INVALID_TOPIC, 400, Constants.SYSTEM_EXCEPTION_TYPES.DATA_NOT_FOUND);
		}

		// TODO:need to refactor post topic child items
		await TopicDao.softDeleteResource(ctx, topic);

		if (topic.universalTopicId) {
			// delete activities of the topic
			await ctx.call('activity.deleteActivitiesForTopic', { universalTopicId: topic.universalTopicId, topicId: topic.id });
		}

		return true;
	}

	@Action({
		params: {
			...Constants.DEFAULT_PAGINATION_PARAMS,
			teacherId: { type: 'string' },
			gradeId: { type: 'string' },
			sectionId: { type: 'string' },
			subjectId: { type: 'string' },
			chapterId: { type: 'string' },
		},
	})
	public async getTeacherTopics(ctx: ContextWrapper): Promise<PagedResponse<TopicMapper>> {
		const chapters = await TopicDao.getTeacherTopics(ctx);
		chapters.items = TopicDto.transformResources(chapters.items, new TeacherTopicMapper());
		return chapters;
	}

	@Action({
		params: {
			...Constants.DEFAULT_PAGINATION_PARAMS,
			chapterId: { type: 'string' },
		},
		auth: {
			ignoreAuthToken: true,
		},
	})
	public async getWebTopics(ctx: ContextWrapper): Promise<PagedResponse<TopicMapper>> {
		const webTopics = await TopicDao.getTopics(ctx);
		webTopics.items = TopicDto.transformResources(webTopics.items, new TopicMapper());
		return webTopics;
	}

	@Action({
		params: {
			topicId: { type: 'string' },
		},
	})
	public async getRecommendedTopics(ctx: ContextWrapper) {
		const recommendedTopic = await TopicDao.getRecommendedTopic(ctx);
		const dependencyTopicIds = JSON.parse(recommendedTopic?.dependencyTopics);
		let dependencyTopics: any = [];
		if (dependencyTopicIds?.dependencyTopics?.length > 0) {
			ctx.params.uniTopicIds = dependencyTopicIds?.dependencyTopics;
			dependencyTopics = await TopicDao.getDependencyTopics(ctx);
		}

		return [...dependencyTopics, recommendedTopic];
	}

	@Action({
		params: {
			topicId: { type: 'string' },
			semesterId: { type: 'string' },
		},
		auth: {
			ignoreAuthToken: true,
		},
	})
	public async checkTopicInCurrentSemester(ctx: ContextWrapper) {
		const checkTopicInCurrentSemester = await TopicDao.checkTopicInCurrentSemester(ctx);
		return checkTopicInCurrentSemester ? true : false;
	}
}
module.exports = new TopicService();
