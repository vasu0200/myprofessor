import { LiveClassTemplateQuestionDao } from '@Dao/live-class-template-question.dao';
import { ErrorHelper } from '@Helpers/error-helper';
import { ContextWrapper } from '@Helpers/molecular-helper';
import { LiveClassTemplateQuestionHelper } from '@Helpers/service-helpers/live-class-template-question.helper';
import { LiveClassTemplateQuestion } from '@Models/live-class-template-question';
import { Constants } from '@Utility/constants';
import { Messages } from '@Utility/Messages';
import { Action } from 'moleculer-decorators';
import { PagedResponse } from 'src/dto/base.dto';
import { LiveClassTemplateQuestionDto, LiveClassTemplateQuestionMapper } from 'src/dto/live-class-template-question.dto';
import AuthSchema from './auth';

export default class LiveClassTemplateQuestionService extends AuthSchema {
	public name: string = 'liveClassTemplateQuestion';
	public static LIVE_CLASS_TEMPLATE_QUESTION_PARAMS = {
		questionsTemplateId: { type: 'string' },
		question: { type: 'string' },
		answerType: { type: 'string' },
	};

	@Action({
		params: {
			...Constants.DEFAULT_PAGINATION_PARAMS,
		},
	})
	public async getLiveClassTemplateQuestions(ctx: ContextWrapper): Promise<PagedResponse<LiveClassTemplateQuestionMapper>> {
		const liveClassTemplateQuestions = await LiveClassTemplateQuestionDao.getLiveClassTemplateQuestions(ctx);
		liveClassTemplateQuestions.items = LiveClassTemplateQuestionDto.transformResources(
			liveClassTemplateQuestions.items,
			new LiveClassTemplateQuestionMapper(),
		);
		return liveClassTemplateQuestions;
	}

	@Action({
		params: {
			...LiveClassTemplateQuestionService.LIVE_CLASS_TEMPLATE_QUESTION_PARAMS,
		},
	})
	public async createLiveClassTemplateQuestion(ctx: ContextWrapper) {
		let newLiveClassTemplateQuestion: LiveClassTemplateQuestion = await LiveClassTemplateQuestionHelper.setLiveClassTemplateQuestionDetails(
			ctx,
			new LiveClassTemplateQuestion(),
		);
		newLiveClassTemplateQuestion = await LiveClassTemplateQuestionDao.saveGenericResource(ctx, newLiveClassTemplateQuestion);
		return LiveClassTemplateQuestionDto.transformResource(newLiveClassTemplateQuestion, new LiveClassTemplateQuestionMapper());
	}

	@Action({
		params: {
			liveClassTemplateQuestionId: { type: 'string' },
			...LiveClassTemplateQuestionService.LIVE_CLASS_TEMPLATE_QUESTION_PARAMS,
		},
	})
	public async updateLiveClassTemplateQuestion(ctx: ContextWrapper) {
		let liveClassTemplateQuestion: LiveClassTemplateQuestion = await LiveClassTemplateQuestionDao.getGenericResource(ctx, LiveClassTemplateQuestion, {
			where: { id: ctx.params.liveClassTemplateQuestionId },
		});

		if (!liveClassTemplateQuestion) {
			ErrorHelper.throwError(Messages.INVALID_LIVE_CLASS_TEMPLATE_QUESTION, 400, Constants.SYSTEM_EXCEPTION_TYPES.DATA_NOT_FOUND);
		}

		liveClassTemplateQuestion = await LiveClassTemplateQuestionHelper.setLiveClassTemplateQuestionDetails(ctx, liveClassTemplateQuestion);
		liveClassTemplateQuestion = await LiveClassTemplateQuestionDao.saveGenericResource(ctx, liveClassTemplateQuestion);
		return LiveClassTemplateQuestionDto.transformResource(liveClassTemplateQuestion, new LiveClassTemplateQuestionMapper());
	}

	@Action({
		params: {
			liveClassTemplateQuestionId: { type: 'string' },
		},
	})
	public async deleteLiveClassTemplateQuestion(ctx: ContextWrapper) {
		const liveClassTemplateQuestion: LiveClassTemplateQuestion = await LiveClassTemplateQuestionDao.getGenericResource(
			ctx,
			LiveClassTemplateQuestion,
			{
				where: { id: ctx.params.liveClassTemplateQuestionId },
			},
		);

		if (!liveClassTemplateQuestion) {
			ErrorHelper.throwError(Messages.INVALID_LIVE_CLASS_TEMPLATE_QUESTION, 400, Constants.SYSTEM_EXCEPTION_TYPES.DATA_NOT_FOUND);
		}
		// TODO:need to refactor post liveClassTemplateQuestion child items
		await LiveClassTemplateQuestionDao.softDeleteResource(ctx, liveClassTemplateQuestion);
		return true;
	}
}
module.exports = new LiveClassTemplateQuestionService();
