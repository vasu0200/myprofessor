import { BaseDto } from './base.dto';

export class PreviousQuestionPaperDto extends BaseDto {}

export class QuestionPaperTypeMapper {
	id: string;
	title: string;
	active: string;
	isMockTest: boolean;
	status: string;
	image: string;

	constructor() {
		this.id = '';
		this.title = '-1';
		this.active = '';
		this.isMockTest = false;
		this.status = '';
		this.image = '-1';
	}
}

export class QuestionPaperViewMapper {
	questionPaperId: string;
	questionPaperTypeId: string;
	paperCode: string;
	questionPaperTypeTitle: string;
	questionPaperTestType: string;
	questionPaperTitle: string;
	month: string;
	year: string;

	constructor() {
		this.questionPaperId = '';
		this.questionPaperTypeId = '';
		this.paperCode = '';
		this.questionPaperTypeTitle = '';
		this.questionPaperTestType = '';
		this.questionPaperTitle = '';
		this.month = '';
		this.year = '';
	}
}

export class QuestionPaperMapper {
	id: string;
	questionPaperTypeId: string;
	title: string;
	questionPaperTestType: string;
	paperCode: string;
	month: string;
	year: string;
	active: number;

	constructor() {
		this.id = '';
		this.questionPaperTypeId = '';
		this.title = '';
		this.questionPaperTestType = '';
		this.paperCode = '-1';
		this.month = '-1';
		this.year = '-1';
		this.active = 0;
	}
}

export class PreviousQuestionMapper {
	id: string;
	topicId: string;
	question: string;
	correctOptions: number;
	solution: string;
	marks: number;
	diffLevel: string;
	questionType: string;
	idx: number;
	explanation: string;

	constructor() {
		this.id = '';
		this.topicId = '';
		this.question = '';
		this.correctOptions = -1;
		this.solution = '';
		this.marks = -1;
		this.diffLevel = '';
		this.questionType = '';
		this.idx = -1;
		this.explanation = '';
	}
}

export class PreviousOptionMapper {
	id: string;
	previousQuestionId: string;
	value: string;
	key: string;

	constructor() {
		this.id = '';
		this.previousQuestionId = '';
		this.value = '';
		this.key = '';
	}
}

export class PreviousQuestionPaperMap {
	id: string;
	universityId: string;
	branchId: string;
	semesterId: string;
	subjectId: string;
	universityName: string;
	branchName: string;
	semesterName: string;
	subjectName: string;
	previousQuestionPaperId: string;
	status: string;

	constructor() {
		this.id = '';
		this.universityId = '';
		this.branchId = '';
		this.subjectId = '';
		this.previousQuestionPaperId = '';
		this.status = '';
		this.semesterId = '';
		this.universityName = '';
		this.branchName = '';
		this.semesterName = '';
		this.subjectName = '';
	}
}
