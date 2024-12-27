import { ContextWrapper } from '@Helpers/molecular-helper';
import { Method } from 'moleculer-decorators';
import { LiveClassQuestion } from '@Models/live-class-question';

export class LiveClassQuestionHelper {
	@Method
	public static async setLiveClassQuestionDetails(
		ctx: ContextWrapper,
		target: LiveClassQuestion,
	): Promise<LiveClassQuestion> {
		target.liveClassId = ctx.params.liveClassId;
		target.question = ctx.params.question;
		target.answerType = ctx.params.answerType;
		target.mandatory = ctx.params.mandatory;

		return target;
	}
}
