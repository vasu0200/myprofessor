import { UserTestDao } from '@Dao/user-test.dao';
import { ErrorHelper } from '@Helpers/error-helper';
import { ContextWrapper } from '@Helpers/molecular-helper';
import { UserTestHelper } from '@Helpers/service-helpers/user-test.helper';
import { ActivityDim } from '@Models/activity-dim';
import { UserTestQuestion } from '@Models/user-test-questions';
import { QuestionAndOptions, UserTest } from '@Models/user-tests';
import { Constants } from '@Utility/constants';
import { ActivityCodeType, ActivityStatus, UserTestType } from '@Utility/enum';
import { Action } from 'moleculer-decorators';
import { AssignedActivityQuestionMapper, UserPracticeTestMapper, UserTestDto, UserTestMapper, UserTestQuestionMapper } from 'src/dto/user-test.dto';
import AuthSchema from './auth';
import async from 'async';
import { Messages } from '@Utility/Messages';
import { In } from 'typeorm';

export default class UserTestService extends AuthSchema {
	public name: string = 'userTest';

	@Action({
		params: {
			userId: { type: 'string' },
			assignedActivityId: { type: 'string' },
			activityDimId: { type: 'string', optional: true },
		},
	})
	public async getUserActivityQuestion(ctx: ContextWrapper) {
		// check If userTest exists
		const userTests: UserTest[] = await UserTestDao.getGenericResources(ctx, UserTest, {
			where: {
				userId: ctx.params.userId,
				assignedActivityId: ctx.params.assignedActivityId,
			},
		});

		if (userTests.length) {
			let totalTests: number = 0;
			let oldUserTests: UserTest[] = [];

			await async.forEachLimit(userTests, 1, async (ut: UserTest) => {
				if (ut.status == ActivityStatus.InProgress) {
					// delete userTest and questions
					await UserTestHelper.deleteUserTestQuestions(ctx, ut.id);
				}

				if (ut.status == ActivityStatus.Completed) {
					totalTests = totalTests + 1;
					oldUserTests.push(ut);
				}
			});
			if (oldUserTests.length) return UserTestDto.transformResources(oldUserTests, new UserTestMapper());
		}

		// create userTest and questions and return questionIds
		return await UserTestHelper.scheduleUserTest(ctx);
	}

	@Action({
		params: {
			assignedActivityId: { type: 'string' },
			activityDimId: { type: 'string' },
			questionId: { type: 'string' },
			userTestId: { type: 'string' },
			index: { type: 'string' },
		},
	})
	public async getUserTestNextQuestion(ctx: ContextWrapper) {
		const { userTest, userTestQuestion } = await UserTestHelper.checkUserTest(ctx);

		const dbQuestions = await UserTestDao.getAssignedActivityQuestions(ctx, true, userTestQuestion.questionId);

		const formattedQuestionAndOptions: QuestionAndOptions[] = UserTestHelper.getFormattedQuestionsAndOptions(dbQuestions);
		const userTestQuestionInfo: UserTestQuestionMapper = UserTestDto.transformResource(userTest, new UserTestQuestionMapper());

		return { ...userTestQuestionInfo, ...formattedQuestionAndOptions[0] };
	}

	@Action({
		params: {
			assignedActivityId: { type: 'string', optional: true },
			activityDimId: { type: 'string', optional: true },
			attemptStartedAt: { type: 'string' }, // YYY-MM-DD HH:MM:SS
			attemptEndedAt: { type: 'string' }, // YYY-MM-DD HH:MM:SS
			userTestId: { type: 'string' },
			questionId: { type: 'string' },
			userAnswer: { type: 'string' },
		},
	})
	public async validateUserTestQuestion(ctx: ContextWrapper) {
		const userTestQuestion: UserTestQuestion = await UserTestDao.getGenericResource(ctx, UserTestQuestion, {
			where: {
				userTestId: ctx.params.userTestId,
				questionId: ctx.params.questionId,
			},
		});

		if (!userTestQuestion) {
			ErrorHelper.throwError(Messages.INVALID_TEST, 400, Constants.SYSTEM_EXCEPTION_TYPES.UNAUTHORIZED);
		}

		return await UserTestHelper.computeUserTestQuestion(ctx);
	}

	@Action({
		params: {
			assignedActivityId: { type: 'string', optional: true },
			activityDimId: { type: 'string', optional: true },
			userTestId: { type: 'string' },
		},
	})
	public async endUserTest(ctx: ContextWrapper) {
		await UserTestHelper.computeUserTest(ctx, ctx.params.userTestId, true);
	}

	@Action({
		params: {
			assignedActivityId: { type: 'string' },
			activityDimId: { type: 'string' },
			userId: { type: 'string' },
		},
	})
	public async reAttemptUserTest(ctx: ContextWrapper) {
		// get the activityType
		const activityDim: ActivityDim = await UserTestDao.getGenericResource(ctx, ActivityDim, { where: { id: ctx.params.activityDimId } });

		if (ctx.params.activityDimId != -1 && activityDim?.activityType !== ActivityCodeType.Post) {
			// should provide chance for new test
			ErrorHelper.throwError(Messages.CANNOT_REATTEMPT_TEST, 400, Constants.SYSTEM_EXCEPTION_TYPES.UNAUTHORIZED);
		}

		// check user attempts
		const userTests: UserTest[] = await UserTestDao.getGenericResources(ctx, UserTest, {
			where: {
				userId: ctx.params.userId,
				assignedActivityId: ctx.params.assignedActivityId,
				activityDimId: ctx.params.activityDimId,
				status: ActivityStatus.Completed,
			},
		});

		if (userTests.length && userTests.length >= Constants.MAX_ATTEMPTS_FOR_TEST) {
			ErrorHelper.throwError(Messages.MAX_REATTEMPTS_REACHED, 400, Constants.SYSTEM_EXCEPTION_TYPES.UNAUTHORIZED);
		}

		// create userTest and questions and return questionIds
		return await UserTestHelper.scheduleUserTest(ctx);
	}

	@Action({
		params: {
			userId: { type: 'string' },
			assignedActivityId: { type: 'string' },
			activityDimId: { type: 'string' },
		},
	})
	public async getUserVideoActivityQuestionIds(ctx: ContextWrapper) {
		const resultValue = await UserTestHelper.createUserTest(ctx, UserTestType.Video);

		if (resultValue && resultValue.formattedQuestionAndOptions.length) {
			return await UserTestHelper.createUserTestQuestionsVideos(ctx, resultValue.formattedQuestionAndOptions, resultValue.newUserTest);
		}

		return resultValue;
	}

	@Action({
		params: {
			attemptStartedAt: { type: 'string' }, // YYY-MM-DD HH:MM:SS
			attemptEndedAt: { type: 'string' }, // YYY-MM-DD HH:MM:SS
			userTestId: { type: 'string' },
			questionId: { type: 'string' },
			userAnswer: { type: 'string' },
		},
	})
	public async validateVideoQuestion(ctx: ContextWrapper) {
		return await ctx.call('userTest.validateUserTestQuestion', { ...ctx.params, ...{ isVideoActivityTest: true } });
	}

	@Action({
		params: {
			userId: { type: 'string' },
			activityDimId: { type: 'string' },
		},
	})
	public async getUserPostAssessments(ctx: ContextWrapper) {
		return await UserTestDao.getUserPostAssessments(ctx.params.activityDimId, ctx.params.userId);
	}

	@Action({
		params: {
			userId: { type: 'string' },
			assignedActivityId: { type: 'string' },
		},
	})
	public async getUserRecommendedPostAssessments(ctx: ContextWrapper) {
		return await UserTestDao.getUserRecommendedPostAssessments(ctx.params.assignedActivityId, ctx.params.userId);
	}

	@Action({
		params: {
			userId: { type: 'string' },
			activityDimId: { type: 'string', optional: true },
			userTestId: { type: 'string' },
		},
	})
	public async getAssessmentReport(ctx: ContextWrapper) {
		const userTest: UserTest = await UserTestDao.getGenericResource(ctx, UserTest, { where: { id: ctx.params.userTestId } });

		if (!userTest) {
			ErrorHelper.throwError(Messages.INVALID_TEST, 400, Constants.SYSTEM_EXCEPTION_TYPES.DATA_NOT_FOUND);
		}

		const userTestInfo = { id: userTest.id, analysis: userTest.analysis, score: userTest.score, status: userTest.status };

		const analysis: { analysis: string; total: number }[] = await UserTestDao.getUserTestQuestionsGroupedByAnalysis(
			ctx.params.userTestId,
			ctx.params.userId,
		);

		const questions = await UserTestDao.getUserTestQuestionsAnalysis(ctx.params.userTestId, ctx.params.userId);

		return { userTestInfo, analysis, questions };
	}

	@Action({
		params: {
			userId: { type: 'string' },
			userTestId: { type: 'string' },
		},
	})
	public async getAssessmentReviewQuestions(ctx: ContextWrapper) {
		const userTest: UserTest = await UserTestDao.getGenericResource(ctx, UserTest, {
			where: { id: ctx.params.userTestId, userId: ctx.params.userId },
		});

		if (!userTest) {
			ErrorHelper.throwError(Messages.INVALID_TEST, 400, Constants.SYSTEM_EXCEPTION_TYPES.DATA_NOT_FOUND);
		}

		if (userTest && userTest.status != ActivityStatus.Completed) {
			ErrorHelper.throwError('Please complete the test before requesting the review !!', 400, Constants.SYSTEM_EXCEPTION_TYPES.DATA_NOT_FOUND);
		}

		const dbQuestions = await UserTestDao.getAssesmentQuestionsForReview(ctx);
		return UserTestHelper.getFormattedQuestionsAndOptionsForAssessmentReview(dbQuestions);
	}

	@Action({
		params: {
			subjectId: { type: 'string' },
			userId: { type: 'string' },
		},
	})
	public async getSubjectPracticeTests(ctx: ContextWrapper) {
		const returnValue: { userPracticeTest: any; attempts: any } = { userPracticeTest: [], attempts: [] };
		const subjectPracticeTests: UserTest[] = await UserTestDao.getGenericResources(
			ctx,
			UserTest,
			{
				where: {
					userId: ctx.params.userId,
					subjectId: ctx.params.subjectId,
					testType: In([UserTestType.Chapter, UserTestType.Subject]),
				},
			},
			true,
		);

		if (!subjectPracticeTests.length) {
			const userPracticeTests = await UserTestHelper.createUserSubjectPracticeTest(ctx, ctx.params.subjectId);
			returnValue.userPracticeTest = UserTestDto.transformResources(userPracticeTests, new UserPracticeTestMapper());
		} else {
			returnValue.userPracticeTest = UserTestDto.transformResources(subjectPracticeTests, new UserPracticeTestMapper());
			returnValue.attempts = await UserTestDao.getUserPractiseTestAttempts(ctx);
		}

		returnValue.userPracticeTest = await UserTestDao.getUserSubjectPracticeTest(ctx);

		return returnValue;
	}

	@Action({
		params: {
			userTestId: { type: 'string' },
			subjectId: { type: 'string' },
			chapterId: { type: 'string', optional: true },
			userId: { type: 'string' },
			testType: { type: 'string' },
		},
	})
	public async getUserPracticeTestQuestions(ctx: ContextWrapper) {
		const type: UserTestType = ctx.params.testType;
		// check if userTest exists
		const userTest: UserTest = await UserTestDao.getGenericResource(ctx, UserTest, {
			where: {
				userId: ctx.params.userId,
				id: ctx.params.userTestId,
			},
		});

		if (!userTest) {
			ErrorHelper.throwError(Messages.INVALID_TEST, 400, Constants.SYSTEM_EXCEPTION_TYPES.DATA_NOT_FOUND);
		}

		const userTestQuestions: UserTestQuestion[] = await UserTestDao.getGenericResources(
			ctx,
			UserTestQuestion,
			{
				where: {
					userTestId: userTest.id,
				},
			},
			true,
		);

		if (userTestQuestions.length) {
			return UserTestDto.transformResources(userTestQuestions, new UserTestQuestionMapper());
		}

		const dbQuestions = await UserTestDao.getUserPracticeTestQuestions(ctx, type);

		const practiceTestQuestions = await UserTestHelper.setUserTestQuestions(ctx, dbQuestions, userTest);
		return UserTestDto.transformResources(practiceTestQuestions, new UserTestQuestionMapper());
	}

	@Action({
		params: {
			userTestId: { type: 'string' },
			questionId: { type: 'string' },
			index: { type: 'string' },
			testType: { type: 'string' },
			userId: { type: 'string' },
		},
	})
	public async getUserPracticeTestNextQuestion(ctx: ContextWrapper) {
		const userTest: UserTest = await UserTestDao.getGenericResource(ctx, UserTest, {
			where: { id: ctx.params.userTestId, userId: ctx.params.userId },
		});

		if (!userTest) {
			ErrorHelper.throwError(Messages.INVALID_TEST, 400, Constants.SYSTEM_EXCEPTION_TYPES.DATA_NOT_FOUND);
		}

		const dbQuestions: AssignedActivityQuestionMapper[] = await UserTestDao.getUserPracticeTestNextQuestion(ctx, ctx.params.testType);
		const formattedQuestionAndOptions: QuestionAndOptions[] = UserTestHelper.getFormattedQuestionsAndOptions(dbQuestions);

		return formattedQuestionAndOptions;
	}

	@Action({
		params: {
			userTestId: { type: 'string' },
			questionId: { type: 'string' },
			index: { type: 'string' },
			testType: { type: 'string' },
			userId: { type: 'string' },
			attemptStartedAt: { type: 'string' }, // YYY-MM-DD HH:MM:SS
			attemptEndedAt: { type: 'string' }, // YYY-MM-DD HH:MM:SS
			userAnswer: { type: 'string' },
		},
	})
	public async validateUserPracticeTestQuestion(ctx: ContextWrapper) {
		return await ctx.call('userTest.validateUserTestQuestion', { ...ctx.params, ...{ isPracticeTest: true } });
	}

	@Action({
		params: {
			userTestId: { type: 'string' },
		},
	})
	public async endUserPracticeTest(ctx: ContextWrapper) {
		return await ctx.call('userTest.endUserTest', { ...ctx.params, ...{ isPracticeTest: true } });
	}

	@Action({
		params: {
			subjectId: { type: 'string' },
			chapterId: { type: 'string', optional: true },
			userId: { type: 'string' },
			testType: { type: 'string' },
		},
	})
	public async reAttemptUserPracticeTest(ctx: ContextWrapper) {
		//TODO:clean up the orphan practice tests
		const filterObj =
			ctx.params.testType === UserTestType.Subject
				? { subjectId: ctx.params.subjectId }
				: { subjectId: ctx.params.subjectId, chapterId: ctx.params.chapterId };
		const userTests: UserTest[] = await UserTestDao.getGenericResources(ctx, UserTest, {
			where: {
				userId: ctx.params.userId,
				testType: ctx.params.testType || UserTestType.Subject,
				status: ActivityStatus.NotStarted,
				...filterObj,
			},
		});

		if (userTests.length) {
			await UserTestDao.softDeleteResourceByIds(
				ctx,
				UserTest,
				userTests.map((e) => e.id),
			);
		}
		const type: UserTestType = ctx.params.testType;
		// create practice test
		let newTest = UserTestHelper.setUserTestDetails(ctx, new UserTest(), ctx.params.testType);
		newTest = await UserTestDao.saveGenericResource(ctx, newTest);
		// create questions
		const dbQuestions = await UserTestDao.getUserPracticeTestQuestions(ctx, type);

		const practiceTestQuestions = await UserTestHelper.setUserTestQuestions(ctx, dbQuestions, newTest);
		const questions = UserTestDto.transformResources(practiceTestQuestions, new UserTestQuestionMapper());
		return { newUserTest: UserTestDto.transformResource(newTest, new UserPracticeTestMapper()), questions: questions };
	}

	@Action({
		params: {
			subjectId: { type: 'string' },
			chapterId: { type: 'string', optional: true },
			userId: { type: 'string' },
			testType: { type: 'string' },
		},
	})
	public async getUserPracticeTestsByType(ctx: ContextWrapper) {
		const type: UserTestType = ctx.params.testType;
		return await UserTestDao.getUserPracticeTestsByType(ctx, type);
	}

	@Action({
		params: {
			subjectId: { type: 'string' },
			userId: { type: 'string' },
		},
	})
	public async getSubjectLearningAnalysis(ctx: ContextWrapper) {
		//TODO: if query is getting late, change workflow to send chapterIds from client
		const diffLevelLearningAnalysis = await UserTestDao.getSubjectLearningAnalysisByDiffLevel(ctx);
		const subjectLearningAnalysis = await UserTestDao.getSubjectLearningAnalysis(ctx);

		subjectLearningAnalysis.forEach((e, index) => {
			const filteredDataByChapter = diffLevelLearningAnalysis.filter((dla) => dla.chapterId == e.chapterId);
			subjectLearningAnalysis[index].diffLevelAnalysis = filteredDataByChapter.reduce((acc, curr, index) => {
				acc[index] = {
					diffLevel: curr.diffLevel,
					totalQuestions: acc[curr.diffLevel]?.totalQuestions ? acc[curr.diffLevel].totalQuestions + curr.totalQuestions : curr.totalQuestions,
				};
				return acc;
			}, []);
		});

		return subjectLearningAnalysis;
	}

	@Action({
		params: {
			subjectId: { type: 'string' },
			userId: { type: 'string' },
		},
	})
	public async getSubjectLearningAverages(ctx: ContextWrapper) {
		return await UserTestDao.getSubjectLearningAverages(ctx);
	}

	@Action({
		params: {
			previousQuestionPaperId: { type: 'string' },
		},
	})
	public async getUserQuestionPaperUserTestList(ctx: ContextWrapper) {
		return await UserTestDao.getUserQuestionPaperUserTestList(ctx);
	}

	@Action({
		params: {
			previousQuestionPaperId: { type: 'string' },
			userId: { type: 'string' },
		},
	})
	public async createUserQuestionPaperTest(ctx: ContextWrapper) {
		// check if userTest exists
		const userTests: UserTest[] = await UserTestDao.getGenericResources(ctx, UserTest, {
			where: {
				userId: ctx.params.userId,
				previousQuestionPaperId: ctx.params.previousQuestionPaperId,
				testType: UserTestType.QuestionPaper,
				status: ActivityStatus.InProgress,
			},
		});

		if (userTests.length) {
			await UserTestDao.softDeleteResourceByIds(
				ctx,
				UserTest,
				userTests.map((e) => e.id),
			);
		}
		// create user test
		let userTest: UserTest = await UserTestHelper.setUserTestDetails(ctx, new UserTest(), UserTestType.QuestionPaper);
		userTest = await UserTestDao.saveGenericResource(ctx, userTest);

		const dbQuestions = await UserTestDao.getUserPreviousQuestionPaperPracticeTestQuestions(ctx);
		const practiceTestQuestions = await UserTestHelper.setUserTestQuestions(ctx, dbQuestions, userTest);
		return UserTestDto.transformResources(practiceTestQuestions, new UserTestQuestionMapper());
	}

	@Action({
		params: {
			previousQuestionPaperId: { type: 'string' },
			questionId: { type: 'string' },
			userId: { type: 'string' },
		},
	})
	public async getUserQuestionPaperTestQuestion(ctx: ContextWrapper) {
		const questions = await UserTestDao.getUserQuestionPaperTestQuestion(ctx);
		return UserTestHelper.getFormattedQuestionsAndOptionsForQuestionPaperTest(questions);
	}

	@Action({
		params: {
			userTestId: { type: 'string' },
		},
	})
	public async validateUserQuestionPaperTestQuestion(ctx: ContextWrapper) {
		return await ctx.call('userTest.validateUserTestQuestion', { ...ctx.params, ...{ isPracticeTest: true, isUserQuestionPaperTest: true } });
	}

	@Action({
		params: {
			userTestId: { type: 'string' },
		},
	})
	public async endUserQuestionPaperTest(ctx: ContextWrapper) {
		return await ctx.call('userTest.endUserTest', { ...ctx.params, ...{ isPracticeTest: true } });
	}

	@Action({
		params: {
			userTestId: { type: 'string' },
			userId: { type: 'string' },
		},
	})
	public async getUserQuestionPaperTestQuestionsForReview(ctx: ContextWrapper) {
		const dbQuestions = await UserTestDao.getUserQuestionPaperTestQuestionsForReview(ctx);
		return UserTestHelper.getFormattedQuestionsAndOptionsForAssessmentReview(dbQuestions);
	}

	@Action({
		params: {
			questionPaperId: { type: 'string' },
		},
	})
	public async getUserSubjectiveQuestionPaperTestQuestions(ctx: ContextWrapper) {
		const questions = await UserTestDao.getUserSubjectiveQuestionPaperTestQuestions(ctx);
		return UserTestHelper.getFormattedQuestionsAndOptionsForAssessmentReview(questions);
	}
}

module.exports = new UserTestService();
