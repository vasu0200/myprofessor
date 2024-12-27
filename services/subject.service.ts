import { SubjectDao } from '@Dao/subject.dao';
import { ErrorHelper } from '@Helpers/error-helper';
import { ContextWrapper } from '@Helpers/molecular-helper';
import { SubjectHelper } from '@Helpers/service-helpers/subject.helper';
import { Chapter } from '@Models/chapter';
import { Subject } from '@Models/subject';
import { Constants } from '@Utility/constants';
import { Messages } from '@Utility/Messages';
import { Action } from 'moleculer-decorators';
import { PagedResponse } from 'src/dto/base.dto';
import { SubjectDto, SubjectMapper, TeacherSubjectMapper } from 'src/dto/subject.dto';
import AuthSchema from './auth';
import { TargetSourceType } from '@Utility/enum';

export default class SubjectService extends AuthSchema {
	public name: string = 'subject';
	// eslint-disable-next-line @typescript-eslint/member-ordering
	public static SUBJECT_PARAMS = {
		name: { type: 'string' },
		color: { type: 'string' },
		idx: { type: 'number' },
		image: { type: 'string', optional: true },
		semesterId: { type: 'string' },
		universityId: { type: 'string', optional: true },
		branchId: { type: 'string' },
	};

	@Action({
		params: {
			...Constants.DEFAULT_PAGINATION_PARAMS,
			semesterId: { type: 'string' },
		},
		auth: {
			ignoreAuthToken: true,
		},
	})
	public async getSubjects(ctx: ContextWrapper): Promise<PagedResponse<SubjectMapper>> {
		const subjects = await SubjectDao.getSubjects(ctx);
		subjects.items = SubjectDto.transformResources(subjects.items, new SubjectMapper());
		return subjects;
	}

	@Action({
		params: {
			...SubjectService.SUBJECT_PARAMS,
			collegeSemesterId: { type: 'string', optional: true },
			resourceType: { type: 'enum', values: [TargetSourceType.Admin, TargetSourceType.Professor], optional: true },
		},
		auth: {
			ignoreAuthToken: true,
		},
	})
	public async addSubject(ctx: ContextWrapper) {
		const subject: Subject = await SubjectDao.checkSubject(ctx);

		if (subject) {
			ErrorHelper.throwError(Messages.SUBJECT_NAME_EXISTS, 400, Constants.SYSTEM_EXCEPTION_TYPES.DATA_NOT_FOUND);
		}

		let newSubject: Subject = await SubjectHelper.setSubjectDetails(ctx, new Subject());
		newSubject = await SubjectDao.saveGenericResource(ctx, newSubject);
		return SubjectDto.transformResource(newSubject, new SubjectMapper());
	}

	@Action({
		params: {
			...SubjectService.SUBJECT_PARAMS,
			collegeSemesterId: { type: 'string' },
		},
		auth: {
			ignoreAuthToken: true,
		},
	})
	public async addCollegeSubject(ctx: ContextWrapper) {
		return await ctx.call('subject.addSubject', { ...ctx.params });
	}

	@Action({
		params: {
			...Constants.DEFAULT_PAGINATION_PARAMS,
			semesterId: { type: 'string' },
			collegeSemesterId: { type: 'string', optional: true },
		},
		auth: {
			ignoreAuthToken: true,
		},
	})
	public async getCollegeSemesterSubjects(ctx: ContextWrapper): Promise<PagedResponse<SubjectMapper>> {
		const subjects = await SubjectDao.getCollegeSubjects(ctx);
		subjects.items = SubjectDto.transformResources(subjects.items, new SubjectMapper());
		return subjects;
	}

	@Action({
		params: {
			subjectId: { type: 'string' },
			...SubjectService.SUBJECT_PARAMS,
		},
	})
	public async updateSubject(ctx: ContextWrapper) {
		let subject: Subject = await SubjectDao.getGenericResource(ctx, Subject, { where: { id: ctx.params.subjectId } });

		if (!subject) {
			ErrorHelper.throwError(Messages.INVALID_SUBJECT, 400, Constants.SYSTEM_EXCEPTION_TYPES.DATA_NOT_FOUND);
		}

		const dupSubject: Subject = await SubjectDao.checkSubject(ctx, true);

		if (dupSubject) {
			ErrorHelper.throwError(Messages.SUBJECT_NAME_EXISTS, 400, Constants.SYSTEM_EXCEPTION_TYPES.DATA_NOT_FOUND);
		}

		subject = await SubjectHelper.setSubjectDetails(ctx, subject);
		subject = await SubjectDao.saveGenericResource(ctx, subject);
		return SubjectDto.transformResource(subject, new SubjectMapper());
	}

	@Action({
		params: {
			subjectId: { type: 'string' },
		},
	})
	public async getSubject(ctx: ContextWrapper): Promise<SubjectMapper> {
		const subject: Subject = await SubjectDao.getGenericResource(ctx, Subject, { where: { id: ctx.params.subjectId } });

		if (!subject) {
			ErrorHelper.throwError(Messages.INVALID_SUBJECT, 400, Constants.SYSTEM_EXCEPTION_TYPES.DATA_NOT_FOUND);
		}

		return SubjectDto.transformResource(subject, new SubjectMapper());
	}

	@Action({
		params: {
			subjectId: { type: 'string' },
		},
	})
	public async deleteSubject(ctx: ContextWrapper) {
		const subject: Subject = await SubjectDao.getGenericResource(ctx, Subject, { where: { id: ctx.params.subjectId } });

		if (!subject) {
			ErrorHelper.throwError(Messages.INVALID_SUBJECT, 400, Constants.SYSTEM_EXCEPTION_TYPES.DATA_NOT_FOUND);
		}

		await SubjectDao.softDeleteResource(ctx, subject, Chapter, { where: { subjectId: subject.id } });
		return true;
	}

	@Action({
		params: {
			...Constants.DEFAULT_PAGINATION_PARAMS,
			teacherId: { type: 'string' },
			semesterId: { type: 'string' },
			sectionId: { type: 'string' },
		},
		auth: {
			ignoreAuthToken: true,
		},
	})
	public async getTeacherSubjects(ctx: ContextWrapper): Promise<PagedResponse<SubjectMapper>> {
		const subjects = await SubjectDao.getTeacherSubjects(ctx);
		subjects.items = SubjectDto.transformResources(subjects.items, new TeacherSubjectMapper());
		return subjects;
	}

	@Action({
		params: {
			userId: { type: 'string' },
			subjectId: { type: 'string' },
		},
	})
	public async getSubjectKnowledgeMapStats(ctx: ContextWrapper) {
		return await SubjectDao.getSubjectKnowledgeMapStats(ctx);
	}

	@Action({
		params: {
			subjectId: { type: 'string' },
		},
	})
	public async getTopicsBySubjectId(ctx: ContextWrapper) {
		return await SubjectDao.getTopicsBySubjectId(ctx);
	}

	@Action({
		params: {
			universityId: { type: 'string' },
			branchId: { type: 'string' },
		},
		auth: {
			ignoreAuthToken: true,
		},
	})
	public async getSubjectsForWebsite(ctx: ContextWrapper) {
		return await SubjectDao.getSubjectsForWebsite(ctx);
	}
}

module.exports = new SubjectService();
