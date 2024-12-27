import { ContextWrapper } from '@Helpers/molecular-helper';
import { QuestionsTemplate } from '@Models/questions-template';
import { Method } from 'moleculer-decorators';

export class QuestionsTemplateHelper {
	@Method
	public static async setQuestionsTemplateDetails(ctx: ContextWrapper, target: QuestionsTemplate): Promise<QuestionsTemplate> {
		target.name = ctx.params.name;

		return target;
	}
}
