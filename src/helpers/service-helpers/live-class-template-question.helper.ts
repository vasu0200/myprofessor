import { ContextWrapper } from '@Helpers/molecular-helper';
import { LiveClassTemplateQuestion } from '@Models/live-class-template-question';
import { Method } from 'moleculer-decorators';

export class LiveClassTemplateQuestionHelper {
	@Method
	public static async setLiveClassTemplateQuestionDetails(ctx: ContextWrapper, target: LiveClassTemplateQuestion): Promise<LiveClassTemplateQuestion> {
		target.questionsTemplateId = ctx.params.questionsTemplateId;
		target.question = ctx.params.question;
		target.answerType = ctx.params.answerType;
		target.mandatory = ctx.params.mandatory;

		return target;
	}
}
