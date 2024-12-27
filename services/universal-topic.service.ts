import { UniversalTopicDao } from '@Dao/universal-topic.dao';
import { ErrorHelper } from '@Helpers/error-helper';
import { UniversalLibraryHelper } from '@Helpers/service-helpers/universal-library.helper';
import { AssignedActivity } from '@Models/assigned-activity';
import { UniversalTopic } from '@Models/universal-topic';
import { Constants } from '@Utility/constants';
import { UserRoleType } from '@Utility/enum';
import { Messages } from '@Utility/Messages';
import { Action } from 'moleculer-decorators';
import { PagedResponse } from 'src/dto/base.dto';
import { UniversalSubjectDto } from 'src/dto/universal-subject.dto';
import { UniversalTopicGlobalMapper, UniversalTopicMapper } from 'src/dto/universal-topic.dto';
import { ContextWrapper } from 'src/helpers/molecular-helper';
import AuthSchema from './auth';
import { Topic } from '@Models/topic';

export default class UniversalTopicService extends AuthSchema {
	public name: string = 'universalTopic';

	@Action({
		params: {
			name: { type: 'string' },
			description: { type: 'string', optional: true },
			code: { type: 'string' },
			image: { type: 'string', optional: true },
			subjectId: { type: 'string' },
			dependencyTopics: { type: 'string', optional: true },
		},
		auth: {
			role: UserRoleType.SuperAdmin,
		},
	})
	public async createTopic(ctx: ContextWrapper): Promise<UniversalTopicMapper> {
		const topic: UniversalTopic = await UniversalTopicDao.checkTopic(ctx);

		if (topic) {
			ErrorHelper.throwError(Messages.UNIVERSAL_TOPIC_CODE_EXISTS, 404, Constants.SYSTEM_EXCEPTION_TYPES.VALIDATION_ERROR);
		}

		let newTopic: UniversalTopic = await UniversalLibraryHelper.setTopicDetails(ctx, new UniversalTopic());

		newTopic = await UniversalTopicDao.saveGenericResource(ctx, newTopic);
		return UniversalSubjectDto.transformResource(newTopic, new UniversalTopicMapper());
	}

	@Action({
		params: {
			topicId: { type: 'string' },
			name: { type: 'string' },
			description: { type: 'string', optional: true },
			code: { type: 'string' },
			image: { type: 'string', optional: true },
			subjectId: { type: 'string' },
		},
		auth: {
			role: UserRoleType.SuperAdmin,
		},
	})
	public async updateTopic(ctx: ContextWrapper): Promise<UniversalTopicMapper> {
		let topic: UniversalTopic = await UniversalTopicDao.checkTopic(ctx, true);

		if (topic) {
			ErrorHelper.throwError(Messages.UNIVERSAL_TOPIC_CODE_EXISTS, 404, Constants.SYSTEM_EXCEPTION_TYPES.VALIDATION_ERROR);
		}

		topic = await UniversalTopicDao.getGenericResource(ctx, UniversalTopic, {
			where: { id: ctx.params.topicId, subjectId: ctx.params.subjectId },
		});

		if (!topic) {
			ErrorHelper.throwError(Messages.INVALID_UNIVERSAL_TOPIC, 400, Constants.SYSTEM_EXCEPTION_TYPES.DATA_NOT_FOUND);
		}

		topic = await UniversalLibraryHelper.setTopicDetails(ctx, topic);

		topic = await UniversalTopicDao.saveGenericResource(ctx, topic);
		return UniversalSubjectDto.transformResource(topic, new UniversalTopicMapper());
	}

	@Action({
		params: {
			topicId: { type: 'string' },
			subjectId: { type: 'string' },
		},
	})
	public async getTopic(ctx: ContextWrapper): Promise<UniversalTopicMapper> {
		const topic = await UniversalTopicDao.getGenericResource(ctx, UniversalTopic, {
			where: { id: ctx.params.topicId, subjectId: ctx.params.subjectId },
		});

		if (!topic) {
			ErrorHelper.throwError(Messages.INVALID_UNIVERSAL_TOPIC, 400, Constants.SYSTEM_EXCEPTION_TYPES.DATA_NOT_FOUND);
		}
		return UniversalSubjectDto.transformResource(topic, new UniversalTopicMapper());
	}

	@Action({
		params: {
			...Constants.DEFAULT_PAGINATION_PARAMS,
			subjectId: { type: 'string' },
		},
		auth: {
			role: UserRoleType.SuperAdmin,
		},
	})
	public async getTopics(ctx: ContextWrapper): Promise<PagedResponse<UniversalTopicMapper>> {
		const universalTopics = await UniversalTopicDao.getTopics(ctx, ctx.params.subjectId);
		universalTopics.items = UniversalSubjectDto.transformResources(universalTopics.items, new UniversalTopicMapper());
		return universalTopics;
	}

	@Action({
		params: {
			...Constants.DEFAULT_PAGINATION_PARAMS,
			searchValue: { type: 'string' },
			subjectId: { type: 'string' },
		},
		auth: {
			role: UserRoleType.SuperAdmin,
		},
	})
	public async searchTopics(ctx: ContextWrapper): Promise<PagedResponse<UniversalTopicMapper>> {
		const universalTopics = await UniversalTopicDao.getTopics(ctx, ctx.params.subjectId, ctx.params.searchValue);
		universalTopics.items = UniversalSubjectDto.transformResources(universalTopics.items, new UniversalTopicMapper());
		return universalTopics;
	}

	@Action({
		params: {
			subjectId: { type: 'string' },
			topicId: { type: 'string' },
		},
		auth: {
			role: UserRoleType.SuperAdmin,
		},
	})
	public async deleteTopic(ctx: ContextWrapper): Promise<boolean> {
		const universalTopic = await UniversalTopicDao.getGenericResource(ctx, UniversalTopic, {
			where: { id: ctx.params.topicId, subjectId: ctx.params.subjectId },
		});

		if (!universalTopic) {
			ErrorHelper.throwError(Messages.INVALID_UNIVERSAL_TOPIC, 400, Constants.SYSTEM_EXCEPTION_TYPES.DATA_NOT_FOUND);
		}

		const assignedActivities = await UniversalTopicDao.getAssignedActivitiesByUniversalTopicId(ctx, universalTopic.id);

		if (assignedActivities.length) {
			ErrorHelper.throwError(Messages.DELETE_NOT_ALLOWED, 400, Constants.SYSTEM_EXCEPTION_TYPES.DEPENDENCY_ERROR);

			// const assignedActivityIds: string[] = assignedActivities.map((e) => e.id);
			// // delete assigned activities
			// await UniversalTopicDao.softDeleteResourceByIds(ctx, AssignedActivity, assignedActivityIds);

			// // delete topics which has current universalTopicId
			// const topics = await UniversalTopicDao.getGenericResources(
			// 	ctx,
			// 	Topic,
			// 	{
			// 		where: {
			// 			universalTopicId: universalTopic.id,
			// 		},
			// 	},
			// 	true,
			// );

			// if (topics.length) {
			// 	const topicIds: string[] = topics.map((e) => e.id);
			// 	await UniversalTopicDao.softDeleteResourceByIds(ctx, Topic, topicIds);
			// }

			// ctx.broadcast('analytics.delete', { assignedActivityIds: assignedActivityIds });
		}

		// await UniversalTopicDao.softDeleteResource(ctx, universalTopic, AssignedActivity, { where: { universalTopicId: universalTopic.id } });

		await UniversalTopicDao.softDeleteResource(ctx, universalTopic, Topic, { where: { universalTopicId: universalTopic.id } });

		return true;
	}

	@Action({
		params: {},
	})
	public async globalTopicSearch(ctx: ContextWrapper) {
		const topics = await UniversalTopicDao.globalTopicSearch(ctx);
		return UniversalSubjectDto.transformResources(topics, new UniversalTopicGlobalMapper());
	}
}

module.exports = new UniversalTopicService();
