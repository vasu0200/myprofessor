import { BaseDto } from './base.dto';

export class AnalyticsDto extends BaseDto {}

export class UserSubjectsAnalyticMapper {
	subjectId: string;
	gradeId: string;
	name: string;
	description: string;
	color: string;
	idx: number;
	image: string;
	boardId: string;
	noOfChapters: number;
	noOfTopics: number;
	progress: number;
	constructor() {
		this.subjectId = '';
		this.gradeId = '';
		this.name = '';
		this.description = '';
		this.color = '';
		this.idx = 0;
		this.image = '';
		this.boardId = '';
		this.noOfChapters = 0;
		this.noOfTopics = 0;
		this.progress = 0;
	}
}

export class UserChaptersAnalyticMapper {
	subjectId: string;
	chapterId: string;
	chapterName: string;
	description: string;
	idx: number;
	image: string;
	noOfActivities: number;
	noOfTopics: number;
	progress: number;
	constructor() {
		this.subjectId = '';
		this.chapterId = '';
		this.description = '';
		this.chapterName = '';
		this.idx = 0;
		this.image = '';
		this.noOfActivities = 0;
		this.noOfTopics = 0;
		this.progress = 0;
	}
}

export class UserTopicsAnalyticMapper {
	subjectId: string;
	universalTopicId: string;
	topicId: string;
	topicName: string;
	code: string;
	idx: number;
	image: string;
	topicDescription: string;
	progress: number;
	prevRepeatedCount: number;
	constructor() {
		this.subjectId = '';
		this.universalTopicId = '';
		this.topicId = '';
		this.topicName = '';
		this.code = '';
		this.idx = 0;
		this.image = '';
		this.topicDescription = '';
		this.progress = 0;
		this.prevRepeatedCount = 0;
	}
}

export class UserActivitiesAnalyticMapper {
	assignedActivityId: string;
	name: string;
	activityType: string;
	faIcon: string;
	seq: number;
	cardImage: string;
	status: string;
	duration: number;
	pdfPages: number;
	totalQuestions: number;
	progress: number;
	activityDimId: string;
	userAnalyticId: string;
	updatedAt: string;

	constructor() {
		this.assignedActivityId = '';
		this.name = '';
		this.activityType = '';
		this.faIcon = '';
		this.seq = 0;
		this.cardImage = '';
		this.status = '';
		this.duration = 0;
		this.totalQuestions = 0;
		this.progress = 0;
		this.pdfPages = 0;
		this.activityDimId = '';
		this.userAnalyticId = '';
		this.updatedAt = '';
	}
}

export class UserActivityAnalyticInfoMapper {
	activityDimId: string;
	pdfPages: string;
	url: string;
	duration: number;
	validPdfPages: string;
	videoPausedAt: number;
	pdfPagePausedAt: number;
	activityType: string;
	progress: number;
	assignedActivityId: string;

	constructor() {
		this.activityDimId = '';
		this.pdfPages = '';
		this.url = '';
		this.duration = 0;
		this.progress = 0;
		this.validPdfPages = '';
		this.videoPausedAt = 0;
		this.pdfPagePausedAt = 0;
		this.activityDimId = '';
		this.activityType = '';
		this.assignedActivityId = '';
	}
}
