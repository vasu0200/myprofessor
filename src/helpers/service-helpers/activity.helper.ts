import { ContextWrapper } from '@Helpers/molecular-helper';
import { Activity } from '@Models/activity';
import { ActivityInfo } from '@Models/activity-info';
import { AssignedActivity, AssignedActivityInfoByUniversalTopic } from '@Models/assigned-activity';
import { Question } from '@Models/question';
import { Option } from '@Models/option';
import { Method } from 'moleculer-decorators';
import AwsHelper from '@Helpers/aws-helper';
import { TargetSourceType, ActivityStatus } from '@Utility/enum';
import { ActivityDao } from '@Dao/activity.dao';
import { In } from 'typeorm';
import { UserActivityAnalytics, UserAnalyticsConfig } from '@Models/user-activity-analytics';
import async from 'async';
import { ActivityDim } from '@Models/activity-dim';
import { AnalyticsDao } from '@Dao/analytics.dao';
import SystemHelper from '@Helpers/system-helpers';
import AdmZip from 'adm-zip';
import { existsSync, mkdirSync, readFileSync, rmdir, writeFileSync } from 'fs';
import Mime from 'mime-types';
import { ErrorHelper } from '@Helpers/error-helper';
import { Constants } from '@Utility/constants';
import { BaseDao } from '@Dao/base.dao';
const appConfig = require('../../../app-config.json');

export class ActivityHelper {
	@Method
	public static setActivityDetails(
		ctx: ContextWrapper,
		source: { id: string; seq: number; activityId: string },
		target: AssignedActivity,
		activities: Activity[],
		resourceType: TargetSourceType,
	) {
		target.activityId = source.activityId;
		target.name = activities.find((e) => e.id == source.activityId)?.activity || '';
		target.seq = source.seq;
		target.topicId = ctx.params.topicId;
		target.universalTopicId = ctx.params.universalTopicId;
		target.resourceType = resourceType;
		target.sectionId = ctx.params.sectionId;
		return target;
	}

	@Method
	public static async setActivityInfoDetails(ctx: ContextWrapper, target: ActivityInfo): Promise<ActivityInfo> {
		target.assignedActivityId = ctx.params.assignedActivityId;
		target.duration = ctx.params.duration;

		// prepare s3 path url
		ctx.params.fileName = `Universal-library/Universal-Subjects/universal-subject-${ctx.params.subjectId}/universal-topics/universal-topic-${
			target.id
		}/assigned-activities/activities/activity-${target.id}/${ctx.params.fileName ? ctx.params.fileName : SystemHelper.getUUID()}`;

		target.url = ctx.params.url ? ctx.params.url : await AwsHelper.getS3Url(ctx, appConfig.aws.bucketName, ctx.params.fileData, [], 100);
		target.pdfPages = ctx.params.pdfPages || target.pdfPages;
		target.validPdfPages = ctx.params.validPdfPages;

		return target;
	}

	@Method
	public static async setHtml5ActivityInfo(ctx: ContextWrapper, target: ActivityInfo): Promise<any> {
		target.assignedActivityId = ctx.meta.$multipart.assignedActivityId;
		target.url = await this.processZipFileData(ctx, target.id);
		return target;
	}

	@Method
	public static async processZipFileData(ctx: ContextWrapper, activityInfoId: string) {
		try {
			const base64EncodedString: string = await SystemHelper.convertFileStreamToBase64(ctx.params);

			const fileName: string = ctx.meta.filename;
			const zipFolderPath: string = './public/zip_uploads/';

			if (!existsSync(zipFolderPath)) {
				mkdirSync(zipFolderPath);
			}

			writeFileSync(zipFolderPath + fileName, base64EncodedString, { encoding: 'base64' });

			const zip = new AdmZip(zipFolderPath + fileName);
			const zipEntries: AdmZip.IZipEntry[] = zip.getEntries();
			zip.extractAllTo(zipFolderPath);
			let currentDirectory: string = '';
			let fileUrlToSave: string = '';

			await async.forEachLimit(zipEntries, 1, async (zipEntry: AdmZip.IZipEntry) => {
				if (zipEntry.entryName.includes('.html')) {
					currentDirectory = `${zipEntry.entryName.split('/')[0]}/`;
				}
				if (zipEntry.isDirectory) {
					currentDirectory = zipEntry.entryName;
				} else {
					const fileUrl: string = await ctx.call('s3.upload', {
						fileData: readFileSync(zipFolderPath + currentDirectory + zipEntry.name, { encoding: 'base64' }),
						fileName:
							`Universal-library/Universal-Subjects/universal-subject-${ctx.meta.$multipart.subjectId}/universal-topics/universal-topic-${ctx.meta.$multipart.topicId}/assigned-activities/activities/activity-${activityInfoId}/` +
							currentDirectory +
							zipEntry.name?.toLowerCase(),
						bucketName: appConfig.aws.bucketName,
						viewableInline: true,
						contentType: Mime.lookup(zipEntry.name),
					});

					if (zipEntry.name.includes('.html')) {
						fileUrlToSave = fileUrl;
					}
				}
			});

			rmdir(zipFolderPath, { recursive: true }, (err) => {
				if (err) {
					ctx.broker.logger.error(`ERROR OCCURED WHILE DELETING ZIP FILES :: ${err}`);
					ErrorHelper.throwError('Error Occured while processing zip files', 400, Constants.SYSTEM_EXCEPTION_TYPES.EXTERNAL_SERVICES_ERROR);
				}
			});

			return fileUrlToSave;
		} catch (err) {
			const zipFolderPath: string = './public/zip_uploads/';
			rmdir(zipFolderPath, { recursive: true }, (err) => {
				if (err) {
					ctx.broker.logger.error(`ERROR OCCURED WHILE DELETING ZIP FILES :: ${err}`);
					ErrorHelper.throwError('Error Occured while processing zip files', 400, Constants.SYSTEM_EXCEPTION_TYPES.EXTERNAL_SERVICES_ERROR);
				}
			});
			return '';
		}
	}

	@Method
	public static setQuestionInfo(ctx: ContextWrapper, target: Question): Question {
		target.assignedActivityId = ctx.params.assignedActivityId;
		target.question = ctx.params.question;
		target.solution = ctx.params.solution;
		target.explanation = ctx.params.explanation;
		target.marks = +ctx.params.marks;
		target.diffLevel = ctx.params.diffLevel;
		target.questionType = ctx.params.questionType;
		target.videoId = ctx.params.videoId;
		target.timeinsec = ctx.params.timeinsec;
		return target;
	}

	@Method
	public static setOptionInfo(source: { key: string; value: string }, target: Option): Option {
		target.key = source.key;
		target.value = source.value;
		return target;
	}

	@Method
	public static setUniversalTopicActivityDetails(ctx: ContextWrapper, activity: AssignedActivityInfoByUniversalTopic, target: AssignedActivity) {
		target.activityId = activity.activityId;
		target.name = activity.name;
		target.seq = activity.seq;
		target.topicId = ctx.params.topicId;
		target.universalTopicId = ctx.params.universalTopicId;
		target.resourceType = TargetSourceType.Admin;
		return target;
	}

	@Method
	public static async handleAssignedActivityDelete(ctx: ContextWrapper, assignedActivityId: string) {
		// get questions and delete
		const questions: Question[] = await ActivityDao.getGenericResources(ctx, Question, { where: { assignedActivityId: assignedActivityId } }, true);
		if (questions.length) {
			const questionIds: string[] = questions.map((q) => q.id);
			await ActivityDao.softDeleteResourceByIds(ctx, Question, questionIds);

			// get options and delete
			const options: Option[] = await ActivityDao.getGenericResources(ctx, Option, { where: { questionId: In(questionIds) } }, true);
			await ActivityDao.softDeleteResourceByIds(
				ctx,
				Option,
				options.map((o) => o.id),
			);
		}
		// get activityInfo
		const activityInfo: ActivityInfo = await ActivityDao.getGenericResource(ctx, ActivityInfo, {
			where: { assignedActivityId: assignedActivityId },
		});

		if (activityInfo) {
			await ActivityDao.softDeleteResource(ctx, activityInfo);
		}

		ctx.broadcast('analytics.delete', { assignedActivityIds: [assignedActivityId] });
	}

	@Method
	public static async handleUserActivityAnalytics(ctx: ContextWrapper, userAnalyticsConfig: UserAnalyticsConfig[]) {
		const newActivityDims: any[] = [];
		const newUserActivites: any[] = [];
		await async.forEachLimit(userAnalyticsConfig, 1, async (config) => {
			// create record for activity-dm
			let newActivityDim = this.setActivityDimDetails(ctx, config, new ActivityDim());
			// newActivityDim = await AnalyticsDao.saveGenericResource(ctx, newActivityDim);
			newActivityDims.push(newActivityDim);

			// create record for user activity analytics
			let newUserActivityAnalytics = this.setUserActivityAnalyticsDetails(config, new UserActivityAnalytics(), config.userId, newActivityDim.id);
			// newUserActivityAnalytics = await AnalyticsDao.saveGenericResource(ctx, newUserActivityAnalytics);
			newUserActivites.push(newUserActivityAnalytics);
		});
		await BaseDao.saveBulkGenericResources(ctx, ActivityDim, newActivityDims);
		await BaseDao.saveBulkGenericResources(ctx, UserActivityAnalytics, newUserActivites);
	}

	@Method
	public static setActivityDimDetails(
		ctx: ContextWrapper,
		config: UserAnalyticsConfig,
		target: ActivityDim,
		status: ActivityStatus = ActivityStatus.NotStarted,
	) {
		target.activityId = config.assignedActivityId;
		target.status = status;
		target.activityType = config.activityType;
		target.videoPausedAt = ctx.params.videoPausedAt || -1;
		target.pdfPagePausedAt = ctx.params.pdfPagePausedAt || -1;
		target.preTestScore = ctx.params.preTestScore || -1;
		target.videoPausedAt = ctx.params.videoPausedAt || -1;
		target.postTestScore = ctx.params.postTestScore || -1;
		return target;
	}

	@Method
	public static setUserActivityAnalyticsDetails(
		config: UserAnalyticsConfig,
		target: UserActivityAnalytics,
		userId: string,
		activityDimId: string,
		timeId: string | null = null,
		progress: number = 0,
	) {
		target.activityDimId = activityDimId;
		target.universityId = config.universityId;
		target.collegeId = config.collegeId;
		target.branchId = config.branchId;
		target.semesterId = config.semesterId;
		target.sectionId = config.sectionId;
		target.subjectId = config.subjectId;
		target.chapterId = config.chapterId;
		target.topicId = config.topicId;
		target.userId = userId;
		target.timeId = timeId;
		target.progress = progress;
		return target;
	}

	@Method
	public static async setCkEditorImageDetails(ctx: ContextWrapper): Promise<{ url: string; fileName: string; uploaded: number }> {
		// prepare s3 path url
		ctx.params.fileName = `ckupload/files/${ctx.params.fileName ? ctx.params.fileName : SystemHelper.getUUID()}`;
		const url: string = await AwsHelper.getS3Url(ctx, appConfig.aws.bucketName, ctx.params.file, [], 100);

		return { url: url, fileName: ctx.params.fileName, uploaded: 1 };
	}
}
