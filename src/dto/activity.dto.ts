import { DiffLevel, QuestionType } from '@Utility/enum';
import { BaseDto } from './base.dto';

export class ActivityDto extends BaseDto {}

export class ActivitiesMapper {
	id: string;
	activity: string;
	activityType: string;
	cardImage: string;
	faIcon: string;
	isRepeted: boolean;
	roleId: number;
	constructor() {
		this.id = '';
		this.activity = '';
		this.faIcon = '';
		this.activityType = '';
		this.cardImage = '';
		this.isRepeted = false;
		this.roleId = -1;
	}
}

export class AssignedActivityMapper {
	id: string;
	name: string;
	activityId: string;
	activityType: string;
	seq: number;
	topicId: string;
	sectionId: string;
	faIcon: string;
	activityInfoId: string;
	totalQuestions: number;
	duration: number;
	constructor() {
		this.id = '';
		this.name = '';
		this.activityId = '';
		this.seq = -1;
		this.topicId = '';
		this.sectionId = '';
		this.activityType = '';
		this.faIcon = '';
		this.activityInfoId = '';
		this.totalQuestions = 0;
		this.duration = 0;
	}
}

export class UniversalTopicAssignedActivityMapper {
	id: string;
	name: string;
	activityId: string;
	activity: string;
	seq: number;
	universalTopicId: string;
	faIcon: string;
	activityInfoId: string;
	activityType: string;
	totalQuestions: number;
	duration: number;

	constructor() {
		this.id = '';
		this.name = '';
		this.activityId = '';
		this.seq = -1;
		this.universalTopicId = '';
		this.activity = '';
		this.faIcon = '';
		this.activityInfoId = '';
		this.activityType = '';
		this.totalQuestions = 0;
		this.duration = 0;
	}
}

export class ActivityInfoMapper {
	id: string;
	assignedActivityId: string;
	url: string;
	duration: number;
	status: number;
	pdfPages: number;
	validPdfPages: string;
	constructor() {
		this.id = '';
		this.assignedActivityId = '';
		this.duration = -1;
		this.status = -1;
		this.url = '';
		this.pdfPages = 0;
		this.validPdfPages = '';
	}
}

export class QuestionMapper {
	id: string;
	assignedActivityId: string;
	question: string;
	solution: string;
	explanation: string;
	marks: number;
	timeinsec: number;
	diffLevel: string;
	questionType: string;

	constructor() {
		this.id = '';
		this.assignedActivityId = '';
		this.marks = -1;
		this.question = '';
		this.explanation = '';
		this.diffLevel = DiffLevel.Easy;
		this.questionType = QuestionType.Remember;
		this.timeinsec = -1;
		this.solution = '';
	}
}

export class OptionMapper {
	id: string;
	questionId: string;
	value: string;
	key: string;

	constructor() {
		this.id = '';
		this.questionId = '';
		this.value = '';
		this.key = '';
	}
}
