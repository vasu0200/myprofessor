import { BaseDto } from './base.dto';

export class PreviousQuestionsDto extends BaseDto {}

export class PreviousQuestionsMapper {
	id: string;
	questionPaperId: string;
	topicId: string;
	question: string;
	correctOptions: string;
	solution: string;
	marks: number;
	difficultLevel: string;
	idx: number;

	constructor() {
		this.id = '';
		this.questionPaperId = '';
		this.topicId = '';
		this.question = '-1';
		this.correctOptions = '-1';
		this.solution = '-1';
		this.marks = 0;
		this.difficultLevel = '-1';
		this.idx = 0;
	}
}
