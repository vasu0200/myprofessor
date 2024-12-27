import AwsHelper from '@Helpers/aws-helper';
import { ContextWrapper } from '@Helpers/molecular-helper';
import SystemHelper from '@Helpers/system-helpers';
import { PreviousOption } from '@Models/previous-option';
import { PreviousQuestion } from '@Models/previous-question';
import { PreviousQuestionPaperMapper } from '@Models/previous-question-paper-mapper';
import { QuestionPaper } from '@Models/question-paper';
import { QuestionPaperType } from '@Models/question-paper-type';
import { Method } from 'moleculer-decorators';
const appConfig = require('../../../app-config.json');

export class PreviousQuestionPaperHelper {
	@Method
	public static async setQuestionPaperTypeDetails(ctx: ContextWrapper, target: QuestionPaperType): Promise<QuestionPaperType> {
		target.title = ctx.params.title;
		target.isMockTest = ctx.params.isMockTest;
		ctx.params.fileName = `PreviousQuestionPaperTypes/${ctx.params.fileName ? ctx.params.fileName : SystemHelper.getUUID()}`;
		target.image = ctx.params.image ? await AwsHelper.getS3Url(ctx, appConfig.aws.bucketName, ctx.params.image, [], 100) : '';
		target.status = ctx.params.status;

		return target;
	}

	@Method
	public static setQuestionPaperDetails(ctx: ContextWrapper, target: QuestionPaper): QuestionPaper {
		target.questionPaperTypeId = ctx.params.questionPaperTypeId;
		target.title = ctx.params.title;
		target.questionPaperTestType = ctx.params.questionPaperTestType;
		target.paperCode = ctx.params.paperCode;
		target.month = ctx.params.month;
		target.year = ctx.params.year;
		target.active = ctx.params.active;
		target.createdBy = ctx.params.createdBy;
		target.updatedBy = ctx.params.modifiedBy;
		target.fileLocation = '';

		return target;
	}

	@Method
	public static setPrevioiusQuestionDetais(ctx: ContextWrapper, target: PreviousQuestion): PreviousQuestion {
		target.questionPaperId = ctx.params.questionPaperId;
		target.topicId = ctx.params.topicId;
		target.question = ctx.params.question;
		target.correctOptions = ctx.params.correctOptions;
		target.solution = ctx.params.solution;
		target.marks = +ctx.params.marks;
		target.diffLevel = ctx.params.diffLevel;
		target.questionType = ctx.params.questionType;
		target.idx = +ctx.params.idx;
		target.explanation = ctx.params.explanation;

		return target;
	}

	@Method
	public static setPreviousOptionInfo(source: { key: string; value: string }, target: PreviousOption): PreviousOption {
		target.key = source.key;
		target.value = source.value;
		return target;
	}

	@Method
	public static setPreviousQuestionPaperMapper(ctx: ContextWrapper, source: PreviousQuestionPaperMapper) {
		source.universityId = ctx.params.universityId;
		source.branchId = ctx.params.branchId;
		source.semesterId = ctx.params.semesterId;
		source.subjectId = ctx.params.subjectId;
		source.previousQuestionPaperId = ctx.params.previousQuestionPaperId;
		source.status = ctx.params.status || source.status;
		return source;
	}
}
