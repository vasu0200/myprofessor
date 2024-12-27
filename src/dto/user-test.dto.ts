import { BaseDto } from './base.dto';

export class UserTestDto extends BaseDto {}

export class AssignedActivityQuestionMapper {
	questionId: string;
	assignedActivityId: string;
	question: string;
	questionType: string;
	diffLevel: string;
	timeInSec: string;
	schedulerId: string;
	videoId: string;
	key: string;
	value: string;
	marks: string;

	constructor() {
		this.questionId = '';
		this.assignedActivityId = '';
		this.diffLevel = '';
		this.question = '';
		this.questionType = '';
		this.timeInSec = '';
		this.schedulerId = '';
		this.videoId = '';
		this.key = '';
		this.value = '';
		this.marks = '';
	}
}

export class UserTestQuestionMapper {
	userTestId: string;
	questionId: string;
	index: number;
	status: string;

	constructor() {
		this.userTestId = '';
		this.questionId = '';
		this.index = 0;
		this.status = '';
	}
}

export class UserTestQuestionForVideoMapper {
	userTestId: string;
	questionId: string;
	index: number;
	timeInSec: number;
	status: string;

	constructor() {
		this.userTestId = '';
		this.questionId = '';
		this.index = 0;
		this.timeInSec = 0;
		this.status = '';
	}
}

export class UserTestMapper {
	id: string;
	status: string;
	score: number;
	analysis: string;

	constructor() {
		this.id = '';
		this.analysis = '';
		this.score = 0;
		this.status = '';
	}
}

export class AssessmentReviewQuestionMapper {
	questionId: string;
	question: string;
	solution: string;
	explanation: string;
	userAnswer: string;
	key: string;
	value: string;

	constructor() {
		this.questionId = '';
		this.solution = '';
		this.question = '';
		this.explanation = '';
		this.userAnswer = '';
		this.key = '';
		this.value = '';
	}
}

export class UserPracticeTestMapper {
	id: string;
	status: string;
	subjectId: string;
	chapterId: string;
	testType: string;

	constructor() {
		this.id = '';
		this.subjectId = '';
		this.chapterId = '';
		this.testType = '';
		this.status = '';
	}
}
