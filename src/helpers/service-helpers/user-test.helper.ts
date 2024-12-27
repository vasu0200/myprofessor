import { UserTestDao } from '@Dao/user-test.dao';
import { ContextWrapper } from '@Helpers/molecular-helper';
import { Method } from 'moleculer-decorators';
import async from 'async';
import { QuestionAndOptions, UserTest } from '@Models/user-tests';
import { ActivityStatus, DiffLevel, QuestionAnalysisType, TestAnalysisType, UserTestType } from '@Utility/enum';
import { UserTestQuestion } from '@Models/user-test-questions';
import {
	AssessmentReviewQuestionMapper,
	AssignedActivityQuestionMapper,
	UserTestDto,
	UserTestQuestionForVideoMapper,
	UserTestQuestionMapper,
} from 'src/dto/user-test.dto';
import { Constants } from '@Utility/constants';
import { ErrorHelper } from '@Helpers/error-helper';
import moment from 'moment';
import { Question } from '@Models/question';
import { Messages } from '@Utility/Messages';
import { Chapter } from '@Models/chapter';
import { PreviousQuestion } from '@Models/previous-question';

export class UserTestHelper {
	@Method
	public static async scheduleUserTest(ctx: ContextWrapper) {
		const resultValue = await UserTestHelper.createUserTest(ctx, UserTestType.Topic);

		if (resultValue && resultValue.formattedQuestionAndOptions && resultValue.newUserTest) {
			return await UserTestHelper.createUserTestQuestionsForPreAndPost(ctx, resultValue.formattedQuestionAndOptions, resultValue.newUserTest);
		}

		return resultValue;
	}

	@Method
	public static async createUserTest(ctx: ContextWrapper, testType: UserTestType) {
		// get questions associated with assignedActivityId
		const dbQuestions: AssignedActivityQuestionMapper[] = await UserTestDao.getAssignedActivityQuestions(ctx);

		if (!dbQuestions.length) {
			return;
		}

		const formattedQuestionAndOptions: QuestionAndOptions[] = this.getFormattedQuestionsAndOptions(dbQuestions);

		// create user Test
		let newUserTest = this.setUserTestDetails(ctx, new UserTest(), testType);
		newUserTest = await UserTestDao.saveGenericResource(ctx, newUserTest);

		return { formattedQuestionAndOptions, newUserTest };
	}

	@Method
	public static async createUserTestQuestionsForPreAndPost(
		ctx: ContextWrapper,
		formattedQuestionAndOptions: QuestionAndOptions[],
		userTest: UserTest,
	) {
		// create user Test questions
		const newQuestions: QuestionAndOptions[] = this.scrambleQuestions(
			formattedQuestionAndOptions,
			Constants.DEFAULT_PRE_AND_POST_ASSESSMENTS_QUESTIONS,
		);
		const newUserTestQuestions: UserTestQuestion[] = await this.setUserTestQuestions(ctx, newQuestions, userTest);
		const userTestQuestionInfo: UserTestQuestionMapper[] = UserTestDto.transformResources(newUserTestQuestions, new UserTestQuestionMapper());

		return userTestQuestionInfo;
	}

	@Method
	public static setUserTestDetails(ctx: ContextWrapper, target: UserTest, testType: UserTestType) {
		target.assignedActivityId = ctx.params.assignedActivityId;
		target.activityDimId = ctx.params.activityDimId;
		target.chapterId = ctx.params.chapterId;
		target.subjectId = ctx.params.subjectId;
		target.status = ActivityStatus.NotStarted;
		target.testType = testType;
		target.userId = ctx.params.userId;
		target.previousQuestionPaperId = ctx.params.previousQuestionPaperId;
		return target;
	}

	@Method
	public static scrambleQuestions(dbQuestions: QuestionAndOptions[], questionsCount: number = -1) {
		for (let i = dbQuestions.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[dbQuestions[i], dbQuestions[j]] = [dbQuestions[j], dbQuestions[i]];
		}

		return dbQuestions.slice(0, questionsCount == -1 ? dbQuestions.length : questionsCount);
	}

	@Method
	public static async setUserTestQuestions(ctx: ContextWrapper, questions: QuestionAndOptions[], userTest: UserTest) {
		const newUserTestQuestions: UserTestQuestion[] = [];
		let index = 1;
		await async.forEachLimit(questions, 1, async (q: QuestionAndOptions) => {
			let newUserTestQuestion = new UserTestQuestion();
			newUserTestQuestion.actualDuration = this.getQuestionActualDuration(q.diffLevel);
			newUserTestQuestion.questionId = q.questionId;
			newUserTestQuestion.userTestId = userTest.id;
			newUserTestQuestion.index = index;
			newUserTestQuestion.markAllocation = q.marks;
			newUserTestQuestion.status = ActivityStatus.NotStarted;
			newUserTestQuestion = await UserTestDao.saveGenericResource(ctx, newUserTestQuestion);

			newUserTestQuestions.push(newUserTestQuestion);
			index = index + 1;
		});

		return newUserTestQuestions;
	}

	@Method
	public static getQuestionActualDuration(diffLevel: DiffLevel) {
		switch (diffLevel) {
			case DiffLevel.Easy:
				return 30;
			case DiffLevel.Medium:
				return 45;
			case DiffLevel.Hard:
				return 60;
			default:
				return 30;
		}
	}

	@Method
	public static getFormattedQuestionsAndOptions(questions: AssignedActivityQuestionMapper[]) {
		const result = [
			...questions
				.reduce((r, { questionId, question, marks, diffLevel, timeInSec, key, value }) => {
					r.has(questionId) ||
						r.set(questionId, {
							questionId,
							question,
							marks,
							diffLevel,
							timeInSec,
							options: [],
						});
					r.get(questionId).options.push({ key, value });
					return r;
				}, new Map())
				.values(),
		] as QuestionAndOptions[];

		return result;
	}

	@Method
	public static async checkUserTest(ctx: ContextWrapper) {
		const userTest: UserTest = await UserTestDao.getGenericResource(ctx, UserTest, {
			where: { userId: ctx.params.userId, assignedActivityId: ctx.params.assignedActivityId },
		});

		if (!userTest) {
			ErrorHelper.throwError(Messages.INVALID_TEST, 400, Constants.SYSTEM_EXCEPTION_TYPES.UNAUTHORIZED);
		}

		const userTestQuestion: UserTestQuestion = await UserTestDao.getGenericResource(ctx, UserTestQuestion, {
			where: {
				userTestId: ctx.params.userTestId,
				questionId: ctx.params.questionId,
				index: +ctx.params.index,
			},
		});

		if (!userTestQuestion) {
			ErrorHelper.throwError(Messages.INVALID_TEST, 400, Constants.SYSTEM_EXCEPTION_TYPES.UNAUTHORIZED);
		}

		return { userTest, userTestQuestion };
	}

	@Method
	public static async computeUserTestQuestion(ctx: ContextWrapper) {
		const userAnswer: string = ctx.params.userAnswer;
		const startDate = moment(ctx.params.attemptStartedAt);
		const endDate = moment(ctx.params.attemptEndedAt);
		const currentTimeSpent = moment.duration(endDate.diff(startDate)).asSeconds();
		const isVideoActivityTest: boolean = ctx.params.isVideoActivityTest ? true : false;
		const isUserQuestionPaperTest: boolean = ctx.params.isUserQuestionPaperTest;

		let question: Question | PreviousQuestion;

		if (isUserQuestionPaperTest) {
			question = await UserTestDao.getGenericResource(ctx, PreviousQuestion, {
				where: { id: ctx.params.questionId },
			});
		} else {
			question = await UserTestDao.getGenericResource(ctx, Question, {
				where: { id: ctx.params.questionId },
			});
		}

		let userTestQuestion: UserTestQuestion = await UserTestDao.getGenericResource(ctx, UserTestQuestion, {
			where: {
				questionId: ctx.params.questionId,
				userTestId: ctx.params.userTestId,
			},
		});

		if (question.solution == userAnswer) {
			userTestQuestion.score = userTestQuestion.markAllocation;
			userTestQuestion.analysis = this.getUserTestQuestionAnalysis(userTestQuestion, currentTimeSpent, userTestQuestion.actualDuration);
		} else {
			userTestQuestion.score = 0;
			userTestQuestion.analysis = currentTimeSpent > userTestQuestion.actualDuration ? QuestionAnalysisType.ExtraTime: QuestionAnalysisType.Lost;
		}

		userTestQuestion.timeTaken = userTestQuestion.timeTaken + currentTimeSpent;
		userTestQuestion.correctAnswer = question.solution;
		userTestQuestion.userAnswer = userAnswer;
		userTestQuestion.status = ActivityStatus.Completed;
		userTestQuestion = await UserTestDao.saveGenericResource(ctx, userTestQuestion);

		await this.computeUserTest(ctx, userTestQuestion.userTestId);

		if (isVideoActivityTest) {
			return {
				analysis: userTestQuestion.analysis,
			};
		}

		return true;
	}

	@Method
	public static getUserTestQuestionAnalysis(userTestQuestion: UserTestQuestion, timeSpent: number, actualDuration: number) {
		if (timeSpent == actualDuration) {
			userTestQuestion.analysis = QuestionAnalysisType.OnTime;
		}

		if (timeSpent < actualDuration) {
			userTestQuestion.analysis = QuestionAnalysisType.Fast;
		}

		if (timeSpent > actualDuration) {
			userTestQuestion.analysis = QuestionAnalysisType.ExtraInnings;
		}

		return userTestQuestion.analysis;
	}

	@Method
	public static async computeUserTest(ctx: ContextWrapper, userTestId: string, killUserTest: boolean = false) {
		const isPracticeTest: boolean = ctx.params.isPracticeTest ? true : false;
		// get all the questions
		const userTestQuestions: UserTestQuestion[] = await UserTestDao.getGenericResources(ctx, UserTestQuestion, {
			where: {
				userTestId: userTestId,
			},
		});

		if (!killUserTest && (!userTestQuestions.length || (userTestQuestions.length && userTestQuestions.length !== +ctx.params.index))) {
			return;
		}

		// get userTest
		const userTest: UserTest = await UserTestDao.getGenericResource(ctx, UserTest, { where: { id: userTestId } });

		// score
		let totalScore = 0;
		let userScore = 0;
		let testActualDuration = 0;
		let userTimeTaken = 0;

		userTestQuestions.forEach((e) => {
			totalScore = totalScore + e.markAllocation;
			userScore = userScore + e.score;
			testActualDuration = testActualDuration + e.actualDuration;
			userTimeTaken = userTimeTaken + e.timeTaken;
		});

		const percentage: number = (userScore * 100) / totalScore;

		userTest.score = percentage;
		userTest.analysis = this.getUserTestAnalysis(percentage);
		userTest.actualDuration = testActualDuration;
		userTest.timeTaken = userTimeTaken;
		userTest.status = ActivityStatus.Completed;
		await UserTestDao.saveGenericResource(ctx, userTest);

		// update time-dim of pre and post tests
		if (!isPracticeTest) {
			await ctx.call('analytics.updateAssessmentAnalytics', {
				userId: userTest.userId,
				activityDimId: userTest.activityDimId,
				timeSpent: userTest.timeTaken,
				testScore: userTest.score,
				analysis: userTest.analysis,
			});
		}
	}

	@Method
	public static getUserTestAnalysis(percentage: number) {
		if (percentage >= 80) {
			return TestAnalysisType.Good;
		} else if (percentage >= 60 && percentage < 80) {
			return TestAnalysisType.Fair;
		} else if (percentage >= 40 && percentage < 60) {
			return TestAnalysisType.Average;
		} else {
			return TestAnalysisType.Poor;
		}
	}

	@Method
	public static async createUserTestQuestionsVideos(ctx: ContextWrapper, formattedQuestionAndOptions: QuestionAndOptions[], userTest: UserTest) {
		// create user Test questions
		const newUserTestQuestions: UserTestQuestion[] = await this.setUserTestQuestions(ctx, formattedQuestionAndOptions, userTest);

		const userTestQuestionInfo: UserTestQuestionForVideoMapper[] = UserTestDto.transformResources(
			newUserTestQuestions,
			new UserTestQuestionForVideoMapper(),
		);

		userTestQuestionInfo.forEach((e) => {
			e.timeInSec = formattedQuestionAndOptions.find((f) => f.questionId == e.questionId)?.timeInSec || 0;
		});

		return userTestQuestionInfo;
	}

	@Method
	public static async deleteUserTestQuestions(ctx: ContextWrapper, userTestId: string) {
		// soft delete user test
		await UserTestDao.softDeleteResourceByIds(ctx, UserTest, [userTestId]);

		// soft delete user test questions
		const userTestQuestions: UserTestQuestion[] = await UserTestDao.getGenericResources(ctx, UserTestQuestion, {
			where: { userTestId: userTestId },
		});

		await UserTestDao.softDeleteResourceByIds(
			ctx,
			UserTestQuestion,
			userTestQuestions.map((e) => e.id),
		);
	}

	@Method
	public static getFormattedQuestionsAndOptionsForAssessmentReview(questions: AssessmentReviewQuestionMapper[]) {
		const result = [
			...questions
				.reduce((r, { questionId, question, solution, explanation, userAnswer, key, value }) => {
					r.has(questionId) ||
						r.set(questionId, {
							questionId,
							question,
							solution,
							explanation,
							userAnswer,
							options: [],
						});
					r.get(questionId).options.push({ key, value });
					return r;
				}, new Map())
				.values(),
		];

		return result;
	}

	public static async createUserSubjectPracticeTest(ctx: ContextWrapper, subjectId: string) {
		// TODO: do it through PL-SQL

		const userTests: UserTest[] = [];
		// create tests for subject
		let newUserSubjectTest = this.setUserTestDetails(ctx, new UserTest(), UserTestType.Subject);
		newUserSubjectTest = await UserTestDao.saveGenericResource(ctx, newUserSubjectTest);
		userTests.push(newUserSubjectTest);
		const chapters: Chapter[] = await UserTestDao.getGenericResources(ctx, Chapter, { where: { subjectId: subjectId } }, true);

		await async.forEachLimit(chapters, 1, async (c: Chapter) => {
			ctx.params.chapterId = c.id;
			let newUserChapterTest = this.setUserTestDetails(ctx, new UserTest(), UserTestType.Chapter);
			newUserChapterTest = await UserTestDao.saveGenericResource(ctx, newUserChapterTest);
			userTests.push(newUserChapterTest);
		});

		return userTests;
	}

	@Method
	public static async createUserPracticeTestQuestios(ctx: ContextWrapper, testType: UserTestType) {
		// get questions associated with assignedActivityId
		const dbQuestions: AssignedActivityQuestionMapper[] = await UserTestDao.getAssignedActivityQuestions(ctx);

		if (!dbQuestions.length) {
			return;
		}

		const formattedQuestionAndOptions: QuestionAndOptions[] = this.getFormattedQuestionsAndOptions(dbQuestions);

		return { formattedQuestionAndOptions };
	}

	@Method
	public static getFormattedQuestionsAndOptionsForQuestionPaperTest(questions: AssignedActivityQuestionMapper[]) {
		const result = [
			...questions
				.reduce((r, { questionId, question, marks, diffLevel, key, value }) => {
					r.has(questionId) ||
						r.set(questionId, {
							questionId,
							question,
							marks,
							diffLevel,
							options: [],
						});
					r.get(questionId).options.push({ key, value });
					return r;
				}, new Map())
				.values(),
		];

		return result;
	}
}
