import { BaseDto } from './base.dto';

export class BreadCrumbDto extends BaseDto {}

export class BreadCrumbMapper {
	universityId: string;
	universityName: string;
	branchId: string;
	branchName: string;
	semesterId: string;
	semesterName: string;
	subjectId: string;
	subjectName: string;
	chapterId: string;
	chapterName: string;
	topicId: string;
	topicName: string;
	sectionId: string;
	sectionName: string;
	uniSubId: string;
	uniSubName: string;
	uniTopicId: string;
	uniTopicName: string;
	activityId: string;
	activityName: string;
	schoolId: string;
	schoolName: string;

	constructor() {
		this.universityId = '';
		this.universityName = '';
		this.branchId = '';
		this.branchName = '';
		this.semesterId = '';
		this.semesterName = '';
		this.subjectId = '';
		this.subjectName = '';
		this.chapterId = '';
		this.chapterName = '';
		this.topicId = '';
		this.topicName = '';
		this.sectionId = '';
		this.sectionName = '';
		this.uniSubId = '';
		this.uniSubName = '';
		this.uniTopicId = '';
		this.uniTopicName = '';
		this.activityId = '';
		this.activityName = '';
		this.schoolId = '';
		this.schoolName = '';
	}
}
