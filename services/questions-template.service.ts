import { QuestionsTemplateDao } from '@Dao/questions-template.dao';
import { ErrorHelper } from '@Helpers/error-helper';
import { ContextWrapper } from '@Helpers/molecular-helper';
import { QuestionsTemplateHelper } from '@Helpers/service-helpers/questions-template.helper';
import { QuestionsTemplate } from '@Models/questions-template';
import { Constants } from '@Utility/constants';
import { Messages } from '@Utility/Messages';
import { Action } from 'moleculer-decorators';
import { PagedResponse } from 'src/dto/base.dto';
import { QuestionsTemplateDto, QuestionsTemplateMapper } from 'src/dto/questions-template.dto';
import AuthSchema from './auth';

export default class QuestionsTemplateService extends AuthSchema {
	public name: string = 'questionsTemplate';
	public static QUESTIONS_TEMPLATE_PARAMS = {
		name: { type: 'string' },
	};

	@Action({
		params: {
			...Constants.DEFAULT_PAGINATION_PARAMS,
		},
	})
	public async getQuestionsTemplates(ctx: ContextWrapper): Promise<PagedResponse<QuestionsTemplateMapper>> {
		const questionsTemplates = await QuestionsTemplateDao.getQuestionsTemplates(ctx);
		questionsTemplates.items = QuestionsTemplateDto.transformResources(questionsTemplates.items, new QuestionsTemplateMapper());
		return questionsTemplates;
	}

	@Action({
		params: {
			...QuestionsTemplateService.QUESTIONS_TEMPLATE_PARAMS,
		},
	})
	public async createQuestionsTemplate(ctx: ContextWrapper) {
		let newQuestionsTemplate: QuestionsTemplate = await QuestionsTemplateHelper.setQuestionsTemplateDetails(ctx, new QuestionsTemplate());
		newQuestionsTemplate = await QuestionsTemplateDao.saveGenericResource(ctx, newQuestionsTemplate);
		return QuestionsTemplateDto.transformResource(newQuestionsTemplate, new QuestionsTemplateMapper());
	}

	@Action({
		params: {
			questionsTemplateId: { type: 'string' },
			...QuestionsTemplateService.QUESTIONS_TEMPLATE_PARAMS,
		},
	})
	public async updateQuestionsTemplate(ctx: ContextWrapper) {
		let questionsTemplate: QuestionsTemplate = await QuestionsTemplateDao.getGenericResource(ctx, QuestionsTemplate, {
			where: { id: ctx.params.questionsTemplateId },
		});

		if (!questionsTemplate) {
			ErrorHelper.throwError(Messages.INVALID_QUESTIONS_TEMPLATE, 400, Constants.SYSTEM_EXCEPTION_TYPES.DATA_NOT_FOUND);
		}

		questionsTemplate = await QuestionsTemplateHelper.setQuestionsTemplateDetails(ctx, questionsTemplate);
		questionsTemplate = await QuestionsTemplateDao.saveGenericResource(ctx, questionsTemplate);
		return QuestionsTemplateDto.transformResource(questionsTemplate, new QuestionsTemplateMapper());
	}

	@Action({
		params: {
			questionsTemplateId: { type: 'string' },
		},
	})
	public async deleteQuestionsTemplate(ctx: ContextWrapper) {
		const questionsTemplate: QuestionsTemplate = await QuestionsTemplateDao.getGenericResource(ctx, QuestionsTemplate, {
			where: { id: ctx.params.questionsTemplateId },
		});

		if (!questionsTemplate) {
			ErrorHelper.throwError(Messages.INVALID_QUESTIONS_TEMPLATE, 400, Constants.SYSTEM_EXCEPTION_TYPES.DATA_NOT_FOUND);
		}
		// TODO:need to refactor post questionsTemplate child items
		await QuestionsTemplateDao.softDeleteResource(ctx, questionsTemplate);
		return true;
	}
}
module.exports = new QuestionsTemplateService();
