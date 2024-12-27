import { BaseDto } from './base.dto';

export class UniversalTopicDto extends BaseDto {}

export class UniversalTopicMapper {
	id: string;
	topicName: string;
	topicDesc: string;
	topicCode: string;
	image: string;
	subjectId: string;
	noOfActivities: number;
	dependencyTopics: string;
	constructor() {
		this.id = '';
		this.topicName = '';
		this.image = '';
		this.topicDesc = '';
		this.topicCode = '';
		this.subjectId = '';
		this.noOfActivities = 0;
		this.dependencyTopics = '';
	}
}

export class UniversalTopicGlobalMapper {
	universalTopicId: string;
	universalTopicName: string;
	universalTopicCode: string;
	universalTopicImage: string;
	universalDependencyTopics: string;

	constructor() {
		this.universalTopicId = '';
		this.universalTopicName = '';
		this.universalTopicCode = '';
		this.universalTopicImage = '';
		this.universalDependencyTopics = '';
	}
}
