import { PreviousQuestionPaperDao } from '@Dao/previous-question-paper.dao';
import { ErrorHelper } from '@Helpers/error-helper';
import { ContextWrapper } from '@Helpers/molecular-helper';
import { PreviousQuestionPaperHelper } from '@Helpers/service-helpers/previous-question-paper.helper';
import { PreviousOption } from '@Models/previous-option';
import { PreviousQuestion } from '@Models/previous-question';
import { QuestionPaper } from '@Models/question-paper';
import { QuestionPaperType } from '@Models/question-paper-type';
import { Constants } from '@Utility/constants';
import { Messages } from '@Utility/Messages';
import { Action } from 'moleculer-decorators';
import { PagedResponse } from 'src/dto/base.dto';
import {
	PreviousOptionMapper,
	PreviousQuestionMapper,
	PreviousQuestionPaperDto,
	PreviousQuestionPaperMap,
	QuestionPaperMapper,
	QuestionPaperTypeMapper,
	QuestionPaperViewMapper,
} from 'src/dto/previous-question-paper.dto';
import async from 'async';
import AuthSchema from './auth';
import { UserRoleType } from '@Utility/enum';
import { PreviousQuestionPaperMapper } from '@Models/previous-question-paper-mapper';

export default class PreviousQuestionPaperService extends AuthSchema {
	public name: string = 'previousQuestionPaper';
	public static QUESTION_PAPER_TYPE_PARAMS = {
		title: { type: 'string' },
		isMockTest: { type: 'boolean' },
		status: { type: 'string' },
		image: { type: 'string', optional: true },
	};
	public static QUESTION_PAPER_PARAMS = {
		questionPaperTypeId: { type: 'string' },
		title: { type: 'string' },
		questionPaperTestType: { type: 'string' },
		paperCode: { type: 'string' },
		month: { type: 'string' },
		year: { type: 'string' },
		active: { type: 'number', optional: true },
	};
	public static PREVIOUS_QUESTION_PARAMS = {
		questionPaperId: { type: 'string' },
		topicId: { type: 'string' },
		question: { type: 'string' },
		solution: { type: 'string' },
		marks: { type: 'number' },
		diffLevel: { type: 'string' },
		questionType: { type: 'string' },
		idx: { type: 'number' },
	};

	@Action({
		params: {
			...Constants.DEFAULT_PAGINATION_PARAMS,
		},
		auth: {
			role: UserRoleType.SuperAdmin,
		},
	})
	public async getQuestionPaperTypes(ctx: ContextWrapper): Promise<PagedResponse<QuestionPaperTypeMapper>> {
		const questionPaperTypes = await PreviousQuestionPaperDao.getQuestionPaperTypes(ctx);
		questionPaperTypes.items = PreviousQuestionPaperDto.transformResources(questionPaperTypes.items, new QuestionPaperTypeMapper());
		return questionPaperTypes;
	}

	@Action({
		params: {
			...PreviousQuestionPaperService.QUESTION_PAPER_TYPE_PARAMS,
		},
		auth: {
			role: UserRoleType.SuperAdmin,
		},
	})
	public async createQuestionPaperType(ctx: ContextWrapper): Promise<QuestionPaperTypeMapper> {
		let newQuestionPaperType: QuestionPaperType = await PreviousQuestionPaperHelper.setQuestionPaperTypeDetails(ctx, new QuestionPaperType());
		newQuestionPaperType = await PreviousQuestionPaperDao.saveGenericResource(ctx, newQuestionPaperType);
		return PreviousQuestionPaperDto.transformResource(newQuestionPaperType, new QuestionPaperTypeMapper());
	}

	@Action({
		params: {
			questionPaperTypeId: { type: 'string' },
		},
		auth: {
			role: UserRoleType.SuperAdmin,
		},
	})
	public async getQuestionPaperType(ctx: ContextWrapper): Promise<QuestionPaperTypeMapper> {
		const questionPaperType: QuestionPaperType = await PreviousQuestionPaperDao.getGenericResource(ctx, QuestionPaperType, {
			where: { id: ctx.params.questionPaperTypeId },
		});

		if (!questionPaperType) {
			ErrorHelper.throwError(Messages.NO_QUESTION_PAPER_TYPE, 400, Constants.SYSTEM_EXCEPTION_TYPES.DATA_NOT_FOUND);
		}

		return PreviousQuestionPaperDto.transformResource(questionPaperType, new QuestionPaperTypeMapper());
	}

	@Action({
		params: {
			questionPaperTypeId: { type: 'string' },
			...PreviousQuestionPaperService.QUESTION_PAPER_TYPE_PARAMS,
		},
		auth: {
			role: UserRoleType.SuperAdmin,
		},
	})
	public async updateQuestionPaperType(ctx: ContextWrapper): Promise<QuestionPaperTypeMapper> {
		let questionPaperType: QuestionPaperType = await PreviousQuestionPaperDao.getGenericResource(ctx, QuestionPaperType, {
			where: { id: ctx.params.questionPaperTypeId },
		});

		if (!questionPaperType) {
			ErrorHelper.throwError(Messages.NO_QUESTION_PAPER_TYPE, 400, Constants.SYSTEM_EXCEPTION_TYPES.DATA_NOT_FOUND);
		}

		questionPaperType = await PreviousQuestionPaperHelper.setQuestionPaperTypeDetails(ctx, questionPaperType);
		questionPaperType = await PreviousQuestionPaperDao.saveGenericResource(ctx, questionPaperType);
		return PreviousQuestionPaperDto.transformResource(questionPaperType, new QuestionPaperTypeMapper());
	}

	@Action({
		params: {
			questionPaperTypeId: { type: 'string' },
		},
		auth: {
			role: UserRoleType.SuperAdmin,
		},
	})
	public async deleteQuestionPaperType(ctx: ContextWrapper): Promise<boolean> {
		const questionPaperType: QuestionPaperType = await PreviousQuestionPaperDao.getGenericResource(ctx, QuestionPaperType, {
			where: { id: ctx.params.questionPaperTypeId },
		});

		if (!questionPaperType) {
			ErrorHelper.throwError(Messages.NO_QUESTION_PAPER_TYPE, 400, Constants.SYSTEM_EXCEPTION_TYPES.DATA_NOT_FOUND);
		}

		await PreviousQuestionPaperDao.softDeleteResource(ctx, questionPaperType, QuestionPaper, {
			where: { questionPaperTypeId: questionPaperType.id },
		});

		return true;
	}

	@Action({
		params: {
			...Constants.DEFAULT_PAGINATION_PARAMS,
			questionPaperTypeId: { type: 'string', optional: true },
		},
		auth: {
			role: UserRoleType.SuperAdmin,
		},
	})
	public async getQuestionPapers(ctx: ContextWrapper): Promise<PagedResponse<QuestionPaperViewMapper>> {
		const questionPapers = await PreviousQuestionPaperDao.getQuestionPapers(ctx);
		questionPapers.items = PreviousQuestionPaperDto.transformResources(questionPapers.items, new QuestionPaperViewMapper());
		return questionPapers;
	}

	@Action({
		params: {
			...PreviousQuestionPaperService.QUESTION_PAPER_PARAMS,
		},
		auth: {
			role: UserRoleType.SuperAdmin,
		},
	})
	public async createQuestionPaper(ctx: ContextWrapper): Promise<QuestionPaperMapper> {
		let newQuestionPaper: QuestionPaper = PreviousQuestionPaperHelper.setQuestionPaperDetails(ctx, new QuestionPaper());
		newQuestionPaper = await PreviousQuestionPaperDao.saveGenericResource(ctx, newQuestionPaper);
		return PreviousQuestionPaperDto.transformResource(newQuestionPaper, new QuestionPaperMapper());
	}

	@Action({
		params: {
			questionPaperId: { type: 'string' },
		},
		auth: {
			role: UserRoleType.SuperAdmin,
		},
	})
	public async getQuestionPaper(ctx: ContextWrapper): Promise<QuestionPaperMapper> {
		const questionPaper: QuestionPaper = await PreviousQuestionPaperDao.getGenericResource(ctx, QuestionPaper, {
			where: { id: ctx.params.questionPaperId },
		});
		return PreviousQuestionPaperDto.transformResource(questionPaper, new QuestionPaperMapper());
	}

	@Action({
		params: {
			questionPaperId: { type: 'string' },
			...PreviousQuestionPaperService.QUESTION_PAPER_PARAMS,
		},
		auth: {
			role: UserRoleType.SuperAdmin,
		},
	})
	public async updateQuestionPaper(ctx: ContextWrapper): Promise<QuestionPaperMapper> {
		let questionPaper = await PreviousQuestionPaperDao.getGenericResource(ctx, QuestionPaper, { where: { id: ctx.params.questionPaperId } });

		if (!questionPaper) {
			ErrorHelper.throwError(Messages.NO_QUESTION_PAPER, 400, Constants.SYSTEM_EXCEPTION_TYPES.DATA_NOT_FOUND);
		}

		questionPaper = PreviousQuestionPaperHelper.setQuestionPaperDetails(ctx, questionPaper);
		questionPaper = await PreviousQuestionPaperDao.saveGenericResource(ctx, questionPaper);
		return PreviousQuestionPaperDto.transformResource(questionPaper, new QuestionPaperMapper());
	}

	@Action({
		params: {
			questionPaperId: { type: 'string' },
		},
		auth: {
			role: UserRoleType.SuperAdmin,
		},
	})
	public async deleteQuestionPaper(ctx: ContextWrapper): Promise<boolean> {
		const questionPaper: QuestionPaper = await PreviousQuestionPaperDao.getGenericResource(ctx, QuestionPaper, {
			where: { id: ctx.params.questionPaperId },
		});

		if (!questionPaper) {
			ErrorHelper.throwError(Messages.NO_QUESTION_PAPER, 400, Constants.SYSTEM_EXCEPTION_TYPES.DATA_NOT_FOUND);
		}

		await PreviousQuestionPaperDao.softDeleteResource(ctx, questionPaper, PreviousQuestion, {
			where: { questionPaperId: ctx.params.questionPaperId },
		});

		return true;
	}

	@Action({
		params: {
			questionPaperId: { type: 'string' },
		},
		auth: {
			role: UserRoleType.SuperAdmin,
		},
	})
	public async getQuestions(ctx: ContextWrapper): Promise<PagedResponse<PreviousQuestionMapper>> {
		const questions = await PreviousQuestionPaperDao.getQuestions(ctx);
		questions.items = PreviousQuestionPaperDto.transformResources(questions.items, new PreviousQuestionMapper());
		return questions;
	}

	@Action({
		params: {
			...PreviousQuestionPaperService.PREVIOUS_QUESTION_PARAMS,
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
		auth: {
			role: UserRoleType.SuperAdmin,
		},
	})
	public async addQuestion(ctx: ContextWrapper): Promise<{ question: PreviousQuestionMapper; options: PreviousOptionMapper[] }> {
		const paramOptions: { key: string; value: string }[] = ctx.params.options;
		const newOptions: PreviousOption[] = [];

		// add question
		let newquestion: PreviousQuestion = PreviousQuestionPaperHelper.setPrevioiusQuestionDetais(ctx, new PreviousQuestion());
		newquestion = await PreviousQuestionPaperDao.saveGenericResource(ctx, newquestion);

		// add options
		await async.forEachLimit(paramOptions, 1, async (e) => {
			let newOption = PreviousQuestionPaperHelper.setPreviousOptionInfo(e, new PreviousOption());
			newOption.questionId = newquestion.id;
			newOption = await PreviousQuestionPaperDao.saveGenericResource(ctx, newOption);
			newOptions.push(newOption);
		});

		// transform using Dto
		const question: PreviousQuestionMapper = PreviousQuestionPaperDto.transformResource(newquestion, new PreviousQuestionMapper());
		const options: PreviousOptionMapper[] = PreviousQuestionPaperDto.transformResources(newOptions, new PreviousOptionMapper());

		return { question, options };
	}

	@Action({
		params: {
			previousQuestionId: { type: 'string' },
		},
		auth: {
			role: UserRoleType.SuperAdmin,
		},
	})
	public async getOptions(ctx: ContextWrapper): Promise<{ question: PreviousQuestionMapper; options: PreviousOptionMapper[] }> {
		const dbQuestion: PreviousQuestion = await PreviousQuestionPaperDao.getGenericResource(ctx, PreviousQuestion, {
			where: { id: ctx.params.previousQuestionId },
		});

		if (!dbQuestion) {
			ErrorHelper.throwError(Messages.INVALID_QUESTION, 400, Constants.SYSTEM_EXCEPTION_TYPES.DATA_NOT_FOUND);
		}

		const dbOptions: PreviousOption[] = await PreviousQuestionPaperDao.getGenericResources(ctx, PreviousOption, {
			where: { questionId: dbQuestion.id },
		});

		// transform using Dto
		const question: PreviousQuestionMapper = PreviousQuestionPaperDto.transformResource(dbQuestion, new PreviousQuestionMapper());
		const options: PreviousOptionMapper[] = PreviousQuestionPaperDto.transformResources(dbOptions, new PreviousOptionMapper());

		return { question, options };
	}

	@Action({
		params: {
			...PreviousQuestionPaperService.PREVIOUS_QUESTION_PARAMS,
			previousQuestionId: { type: 'string' },
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
		auth: {
			role: UserRoleType.SuperAdmin,
		},
	})
	public async updateQuestion(ctx: ContextWrapper): Promise<{ question: PreviousQuestionMapper; options: PreviousOptionMapper[] }> {
		const paramOptions: { id: string; key: string; value: string }[] = ctx.params.options;
		let dbQuestion: PreviousQuestion = await PreviousQuestionPaperDao.getGenericResource(ctx, PreviousQuestion, {
			where: { id: ctx.params.previousQuestionId },
		});

		if (!dbQuestion) {
			ErrorHelper.throwError(Messages.INVALID_QUESTION, 400, Constants.SYSTEM_EXCEPTION_TYPES.DATA_NOT_FOUND);
		}

		// update question
		dbQuestion = PreviousQuestionPaperHelper.setPrevioiusQuestionDetais(ctx, dbQuestion);
		dbQuestion = await PreviousQuestionPaperDao.saveGenericResource(ctx, dbQuestion);
		const dbOptions: PreviousOption[] = await PreviousQuestionPaperDao.getGenericResources(
			ctx,
			PreviousOption,
			{ where: { questionId: dbQuestion.id } },
			true,
		);

		// options to add
		const optionsToAdd = paramOptions.filter((e) => e.id == '-1');
		await async.forEachLimit(optionsToAdd, 1, async (e) => {
			let newOption: PreviousOption = PreviousQuestionPaperHelper.setPreviousOptionInfo({ key: e.key, value: e.value }, new PreviousOption());
			newOption.questionId = dbQuestion.id;
			newOption = await PreviousQuestionPaperDao.saveGenericResource(ctx, newOption);
		});

		// options to update
		await async.forEachLimit(dbOptions, 1, async (e: PreviousOption) => {
			const paramOption = paramOptions.find((po) => po.id == e.id);
			if (paramOption) {
				e = PreviousQuestionPaperHelper.setPreviousOptionInfo({ key: paramOption.key, value: paramOption.value }, e);
			} else {
				await PreviousQuestionPaperDao.softDeleteResource(ctx, e);
			}
			e = await PreviousQuestionPaperDao.saveGenericResource(ctx, e);
		});

		// updated options
		const updatedOptions: PreviousOption[] = await PreviousQuestionPaperDao.getGenericResources(ctx, PreviousOption, {
			where: { questionId: dbQuestion.id },
		});

		// transform using Dto
		const question: PreviousQuestionMapper = PreviousQuestionPaperDto.transformResource(dbQuestion, new PreviousQuestionMapper());
		const options: PreviousOptionMapper[] = PreviousQuestionPaperDto.transformResources(updatedOptions, new PreviousOptionMapper());
		return { question, options };
	}

	@Action({
		params: {
			previousQuestionId: { type: 'string' },
		},
		auth: {
			role: UserRoleType.SuperAdmin,
		},
	})
	public async deleteQuestion(ctx: ContextWrapper) {
		const question: PreviousQuestion = await PreviousQuestionPaperDao.getGenericResource(ctx, PreviousQuestion, {
			where: { id: ctx.params.previousQuestionId },
		});

		if (!question) {
			ErrorHelper.throwError(Messages.INVALID_QUESTION, 400, Constants.SYSTEM_EXCEPTION_TYPES.DATA_NOT_FOUND);
		}

		// delete options
		const options: PreviousOption[] = await PreviousQuestionPaperDao.getGenericResources(
			ctx,
			PreviousOption,
			{ where: { questionId: question.id } },
			true,
		);
		if (options.length) {
			await PreviousQuestionPaperDao.softDeleteResourceByIds(
				ctx,
				PreviousOption,
				options.map((e) => e.id),
			);
		}

		// delete question
		await PreviousQuestionPaperDao.softDeleteResource(ctx, question);
		return true;
	}

	@Action({
		params: {
			previousQuestionId: { type: 'string' },
			previousOptionId: { type: 'string' },
		},
		auth: {
			role: UserRoleType.SuperAdmin,
		},
	})
	public async deleteOption(ctx: ContextWrapper): Promise<boolean> {
		const question: PreviousQuestion = await PreviousQuestionPaperDao.getGenericResource(ctx, PreviousQuestion, {
			where: { id: ctx.params.previousQuestionId },
		});

		if (!question) {
			ErrorHelper.throwError(Messages.INVALID_QUESTION, 400, Constants.SYSTEM_EXCEPTION_TYPES.DATA_NOT_FOUND);
		}

		const option: PreviousOption = await PreviousQuestionPaperDao.getGenericResource(ctx, PreviousOption, {
			where: { id: ctx.params.previousOptionId, questionId: question.id },
		});

		// delete option
		await PreviousQuestionPaperDao.softDeleteResource(ctx, option);
		return true;
	}

	@Action({
		params: {
			universityId: { type: 'string' },
			branchId: { type: 'string' },
			semesterId: { type: 'string' },
			subjectId: { type: 'string' },
			previousQuestionPaperId: { type: 'string' },
			status: { type: 'string' },
		},
		auth: {
			role: UserRoleType.SuperAdmin,
		},
	})
	public async addPreviousQuestionPaper(ctx: ContextWrapper): Promise<PreviousQuestionPaperMap> {
		let questionMapper: PreviousQuestionPaperMapper = await PreviousQuestionPaperDao.getGenericResource(ctx, PreviousQuestionPaperMapper, {
			where: {
				universityId: ctx.params.universityId,
				branchId: ctx.params.branchId,
				subjectId: ctx.params.subjectId,
				semesterId: ctx.params.semesterId,
				previousQuestionPaperId: ctx.params.previousQuestionPaperId,
			},
		});

		if (questionMapper) {
			// already Mapped
			ErrorHelper.throwError(Messages.QUESTION_PAPER_ALREADY_MAPPED, 400, Constants.SYSTEM_EXCEPTION_TYPES.DUPLICATE_DATA);
		}

		questionMapper = PreviousQuestionPaperHelper.setPreviousQuestionPaperMapper(ctx, new PreviousQuestionPaperMapper());

		//TODO: what should happen if user is practicing the test
		questionMapper = await PreviousQuestionPaperDao.saveGenericResource(ctx, questionMapper);

		return PreviousQuestionPaperDto.transformResource(questionMapper, new PreviousQuestionPaperMap());
	}

	@Action({
		params: {
			universityId: { type: 'string' },
			branchId: { type: 'string' },
			semesterId: { type: 'string' },
			subjectId: { type: 'string' },
			previousQuestionPaperId: { type: 'string' },
			status: { type: 'string' },
			previousQuestionPaperMapperId: { type: 'string' },
		},
		auth: {
			role: UserRoleType.SuperAdmin,
		},
	})
	public async updatePreviousQuestionPaperMapper(ctx: ContextWrapper): Promise<PreviousQuestionPaperMap> {
		let dbQuestionMapper: PreviousQuestionPaperMapper = await PreviousQuestionPaperDao.getGenericResource(ctx, PreviousQuestionPaperMapper, {
			where: { id: ctx.params.previousQuestionPaperMapperId },
		});

		if (!dbQuestionMapper) {
			// throw error
		}

		let questionMapper: PreviousQuestionPaperMapper = await PreviousQuestionPaperDao.getGenericResource(ctx, PreviousQuestionPaperMapper, {
			where: {
				universityId: ctx.params.universityId,
				branchId: ctx.params.branchId,
				subjectId: ctx.params.subjectId,
				previousQuestionPaperId: ctx.params.previousQuestionPaperId,
			},
		});

		if (questionMapper) {
			// already Mapped
		}

		questionMapper = PreviousQuestionPaperHelper.setPreviousQuestionPaperMapper(ctx, dbQuestionMapper);

		//TODO: what should happen if user is practicing the test
		questionMapper = await PreviousQuestionPaperDao.saveGenericResource(ctx, questionMapper);

		return PreviousQuestionPaperDto.transformResource(questionMapper, new PreviousQuestionPaperMap());
	}

	@Action({
		params: {
			previousQuestionPaperId: { type: 'string' },
		},
		auth: {
			role: UserRoleType.SuperAdmin,
		},
	})
	public async getPreviousQuestionMappers(ctx: ContextWrapper): Promise<PagedResponse<PreviousQuestionPaperMap>> {
		const questionPapers = await PreviousQuestionPaperDao.getPreviousQuestionMappers(ctx);
		questionPapers.items = PreviousQuestionPaperDto.transformResources(questionPapers.items, new PreviousQuestionPaperMap());
		return questionPapers;
	}

	@Action({
		params: {
			previousQuestionPaperId: { type: 'string' },
			previousQuestionPaperMapperId: { type: 'string' },
		},
		auth: {
			role: UserRoleType.SuperAdmin,
		},
	})
	public async getPreviousQuestionPaperMapper(ctx: ContextWrapper): Promise<PreviousQuestionPaperMap> {
		let questionMapper: PreviousQuestionPaperMapper = await PreviousQuestionPaperDao.getGenericResource(ctx, PreviousQuestionPaperMapper, {
			where: {
				previousQuestionPaperId: ctx.params.previousQuestionPaperId,
				id: ctx.params.previousQuestionPaperMapperId,
			},
		});

		if (!questionMapper) {
			ErrorHelper.throwError(Messages.INVALID_QUESTION_PAPER_MAPPING, 400, Constants.SYSTEM_EXCEPTION_TYPES.DATA_NOT_FOUND);
		}

		return PreviousQuestionPaperDto.transformResource(questionMapper, new PreviousQuestionPaperMap());
	}

	@Action({
		params: {
			previousQuestionPaperId: { type: 'string' },
			previousQuestionPaperMapperId: { type: 'string' },
		},
		auth: {
			role: UserRoleType.SuperAdmin,
		},
	})
	public async deletePreviousQuestionPaperMapper(ctx: ContextWrapper): Promise<Boolean> {
		let questionMapper: PreviousQuestionPaperMapper = await PreviousQuestionPaperDao.getGenericResource(ctx, PreviousQuestionPaperMapper, {
			where: {
				previousQuestionPaperId: ctx.params.previousQuestionPaperId,
				id: ctx.params.previousQuestionPaperMapperId,
			},
		});

		if (!questionMapper) {
			ErrorHelper.throwError(Messages.INVALID_QUESTION_PAPER_MAPPING, 400, Constants.SYSTEM_EXCEPTION_TYPES.DATA_NOT_FOUND);
		}

		//TODO: what should happen if user is practicing the test

		await PreviousQuestionPaperDao.softDeleteResource(ctx, questionMapper);

		return true;
	}

	@Action({
		params: {
			userId: { type: 'string' },
		},
	})
	public async getUserPreviousQuestionPaperTypes(ctx: ContextWrapper) {
		return await PreviousQuestionPaperDao.getUserPreviousQuestionPaperTypes(ctx);
	}

	@Action({
		params: {
			userId: { type: 'string' },
		},
	})
	public async getUserPreviousQuestionPapers(ctx: ContextWrapper) {
		return await PreviousQuestionPaperDao.getUserPreviousQuestionPapers(ctx);
	}

	@Action({
		params: {
			topicId: { type: 'string' },
		},
		auth: {
			ignoreAuthToken: true,
		},
	})
	public async getQuestionsByTopic(ctx: ContextWrapper): Promise<PagedResponse<PreviousQuestionMapper>> {
		const questions = await PreviousQuestionPaperDao.getQuestionsByTopic(ctx);
		return questions;
	}

	@Action({
		params: {
			semesterId: { type: 'string' },
			subjectId: { type: 'string' },
			chapterId: { type: 'string' },
		},
		auth: {
			ignoreAuthToken: true,
		},
	})
	public async getPreviosuQuestionPaperCountByTopic(ctx: ContextWrapper) {
		const academicPreviosuQuestionPaperCountByTopics = await PreviousQuestionPaperDao.getPreviosuQuestionPaperCountByTopic(ctx);

		const groupedData = academicPreviosuQuestionPaperCountByTopics.reduce((acc, curr) => {
			if (!acc[curr.topicId]) {
				acc[curr.topicId] = new Set();
			}
			acc[curr.topicId].add(curr.prevPaperId);
			return acc;
		}, {});

		const result: any = [];
		for (const topicId in groupedData) {
			result.push({ uniTopicId: topicId, prevRepeatedCount: groupedData[topicId].size });
		}
		return result;
	}

	@Action({
		params: {
			topicId: { type: 'string' },
		},
		auth: {
			ignoreAuthToken: true,
		},
	})
	public async getGateQuestionsByTopic(ctx: ContextWrapper): Promise<PagedResponse<PreviousQuestionMapper>> {
		const questions = await PreviousQuestionPaperDao.getGateQuestionsByTopic(ctx);
		return questions;
	}

	@Action({
		params: {
			semesterId: { type: 'string' },
			subjectId: { type: 'string' },
			chapterId: { type: 'string' },
		},
		auth: {
			ignoreAuthToken: true,
		},
	})
	public async getGatePreviosuQuestionPaperCountByTopic(ctx: ContextWrapper) {
		const gatePreviosuQuestionPaperCountByTopics = await PreviousQuestionPaperDao.getGatePreviosuQuestionPaperCountByTopic(ctx);

		const groupedData = gatePreviosuQuestionPaperCountByTopics.reduce((acc, curr) => {
			if (!acc[curr.topicId]) {
				acc[curr.topicId] = new Set();
			}
			acc[curr.topicId].add(curr.prevPaperId);
			return acc;
		}, {});

		const result: any = [];
		for (const topicId in groupedData) {
			result.push({ uniTopicId: topicId, prevRepeatedCount: groupedData[topicId].size });
		}
		return result;
	}
}

module.exports = new PreviousQuestionPaperService();
