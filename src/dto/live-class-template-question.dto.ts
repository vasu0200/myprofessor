import { BaseDto } from './base.dto';

export class LiveClassTemplateQuestionDto extends BaseDto {}

export class LiveClassTemplateQuestionMapper {
	id: string;
	questionsTemplateId: string;
	question: string;
	answerType: string;
	mandatory: number;

	constructor() {
		this.id = '';
		this.questionsTemplateId = '';
		this.question = '';
		this.answerType = '';
		this.mandatory = 0;
	}
}
