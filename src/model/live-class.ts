import SystemHelper from '@Helpers/system-helpers';
import { Entity, Column, CreateDateColumn, UpdateDateColumn, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Chapter } from './chapter';
import { Section } from './section';
import { Subject } from './subject';
import { User } from './user';

@Entity({ name: 'live_classes' })
export class LiveClass {
	@PrimaryColumn({})
	id: string;

	@Column()
	name: string;

	@Column({})
	platform: string;

	@Column({})
	description: string;

	@Column({ type: 'date' })
	date: string;

	@Column({ name: 'from_time', type: 'time' })
	fromTime: string;

	@Column({ name: 'to_time', type: 'time' })
	toTime: string;

	@Column({ name: 'subject_id' })
	subjectId: string;

	@Column({ name: 'chapter_id' })
	chapterId: string;

	@Column({ name: 'professor_id' })
	professorId: string;

	@Column({ name: 'section_id' })
	sectionId: string;

	@Column({ name: 'meeting_id' })
	meetingId: string;

	@Column({ name: 'internal_meeting_id' })
	internalMeetingId: string;

	@Column({ name: 'video_url' })
	videoUrl: string;

	@Column({ name: 'meeting_url' })
	meetingUrl: string;

	@Column({ name: 'moderator_pass' })
	moderatorPass: string;

	@Column({ name: 'attendee_pass' })
	attendeePass: string;

	@Column({ name: 'start_time', type: 'timestamp' })
	startTime: string;

	@Column({ name: 'end_time', type: 'timestamp' })
	endTime: string;

	@Column({ name: 'no_of_students', type: 'int' })
	noOfStudents: number;

	@Column({ name: 'professor_redirect_url' })
	professorRedirectUrl: string;

	@Column({ name: 'student_redirect_url' })
	studentRedirectUrl: string;

	@ManyToOne(() => Subject, (s) => s.id)
	@JoinColumn({ name: 'subject_id' })
	subject?: Subject;

	@ManyToOne(() => Chapter, (c) => c.id)
	@JoinColumn({ name: 'chapter_id' })
	chapter?: Chapter;

	@ManyToOne(() => User, (u) => u.id)
	@JoinColumn({ name: 'professor_id' })
	professor?: User;

	@ManyToOne(() => Section, (s) => s.id)
	@JoinColumn({ name: 'section_id' })
	section?: Section;

	@Column({ name: 'created_by' })
	createdBy: string;

	@CreateDateColumn({ name: 'created_at' })
	createdAt?: Date;

	@Column({ nullable: true, name: 'updated_by' })
	updatedBy?: string;

	@UpdateDateColumn({ name: 'updated_at' })
	updatedAt?: Date;

	@Column({ type: 'tinyint' })
	deleted: boolean;

	constructor() {
		this.id = SystemHelper.getUUID();
		this.createdBy = '';
		this.name = '';
		this.platform = '';
		this.description = '';
		this.date = '';
		this.fromTime = '';
		this.toTime = '';
		this.subjectId = '';
		this.chapterId = '';
		this.professorId = '';
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
		this.professorRedirectUrl = '';
		this.studentRedirectUrl = '';
		this.deleted = false;
	}
}
