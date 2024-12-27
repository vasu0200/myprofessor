import { BaseDto } from './base.dto';

export class LiveClassDto extends BaseDto {}

export class LiveClassMapper {
	id: string;
	name: string;
	platform: string;
	description: string;
	date: string;
	fromTime: number;
	toTime: number;
	topicId: string;
	subjectId: string;
	chapterId: string;
	teacherId: string;
	sectionId: string;
	meetingId: string;
	internalMeetingId: string;
	videoUrl: string;
	meetingUrl: string;
	moderatorPass: string;
	attendeePass: string;
	startTime: string;
	endTime: string;
	noOfStudents: number;
	teacherRedirectUrl: string;
	studentRedirectUrl: string;

	constructor() {
		this.id = '';
		this.name = '';
		this.platform = '';
		this.description = '';
		this.date = '';
		this.fromTime = 0;
		this.toTime = 0;
		this.topicId = '';
		this.subjectId = '';
		this.chapterId = '';
		this.teacherId = '';
		this.sectionId = '';
		this.meetingId = '';
		this.internalMeetingId = '';
		this.videoUrl = '';
		this.meetingUrl = '';
		this.moderatorPass = '';
		this.attendeePass = '';
		this.startTime = '';
		this.endTime = '';
		this.noOfStudents = 0;
		this.teacherRedirectUrl = '';
		this.studentRedirectUrl = '';
	}
}
