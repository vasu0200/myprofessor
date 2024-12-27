import { SubjectOverviewDao } from '@Dao/subject-overview.dao';
import { ErrorHelper } from '@Helpers/error-helper';
import { ContextWrapper } from '@Helpers/molecular-helper';
import { SubjectOverviewHelper } from '@Helpers/service-helpers/subject-overview.helper';
import { Constants } from '@Utility/constants';
import { Messages } from '@Utility/Messages';
import { Action } from 'moleculer-decorators';
import { PagedResponse } from 'src/dto/base.dto';
import { SubjectOverviewDto, SubjectOverviewMapper } from 'src/dto/subject-overview.dto';
import AuthSchema from './auth';
import { SubjectOverview } from '@Models/subject-overview';

export default class SubjectOverviewService extends AuthSchema {
	public name: string = 'subjectOverview';
	public static SUBJECT_OVERVIEW_PARAMS = {
		index: { type: 'number' },
		universityId: { type: 'string' },
		branchId: { type: 'string' },
		subjectId: { type: 'string' },
		description: { type: 'string' },
	};

	@Action({
		params: {
			...Constants.DEFAULT_PAGINATION_PARAMS,
		},
		auth: {
			ignoreAuthToken: true,
		},
	})
	public async getSubjectOverview(ctx: ContextWrapper): Promise<PagedResponse<SubjectOverviewMapper>> {
		const subjects = await SubjectOverviewDao.getSubjectOverview(ctx);
		subjects.items = SubjectOverviewDto.transformResources(subjects.items, new SubjectOverviewMapper());
		return subjects;
	}

	@Action({
		params: {
			...SubjectOverviewService.SUBJECT_OVERVIEW_PARAMS,
		},
		auth: {
			ignoreAuthToken: true,
		},
	})
	public async addSubjectOverview(ctx: ContextWrapper) {
		const subject: SubjectOverview = await SubjectOverviewDao.checkSubjectOverview(ctx);

		if (subject) {
			ErrorHelper.throwError(Messages.SUBJECT_OVERVIEW_EXISTS, 400, Constants.SYSTEM_EXCEPTION_TYPES.DATA_NOT_FOUND);
		}
		let newsubject: SubjectOverview = await SubjectOverviewHelper.setSubjectOverviewDetails(ctx, new SubjectOverview());
		newsubject = await SubjectOverviewDao.saveGenericResource(ctx, newsubject);
		return SubjectOverviewDto.transformResource(newsubject, new SubjectOverviewMapper());
	}

	@Action({
		params: {
			subjectOverviewId: { type: 'string' },
		},
		auth: {
			ignoreAuthToken: true,
		},
	})
	public async getSubjectOverviewById(ctx: ContextWrapper): Promise<SubjectOverviewMapper> {
		const subject: SubjectOverview = await SubjectOverviewDao.getGenericResource(ctx, SubjectOverview, {
			where: { id: ctx.params.subjectOverviewId },
		});

		if (!subject) {
			ErrorHelper.throwError(Messages.INVALID_SUBJECT_OVERVIEW, 400, Constants.SYSTEM_EXCEPTION_TYPES.DATA_NOT_FOUND);
		}
		return SubjectOverviewDto.transformResource(subject, new SubjectOverviewMapper());
	}

	@Action({
		params: {
			...SubjectOverviewService.SUBJECT_OVERVIEW_PARAMS,
			subjectOverviewId: { type: 'string' },
		},
		auth: {
			ignoreAuthToken: true,
		},
	})
	public async updateSubjectOverview(ctx: ContextWrapper) {
		let subject: SubjectOverview = await SubjectOverviewDao.getGenericResource(ctx, SubjectOverview, { where: { id: ctx.params.subjectOverviewId } });

		if (!subject) {
			ErrorHelper.throwError(Messages.INVALID_SUBJECT_OVERVIEW, 400, Constants.SYSTEM_EXCEPTION_TYPES.DATA_NOT_FOUND);
		}

		const dupSubject: SubjectOverview = await SubjectOverviewDao.checkSubjectOverview(ctx, true);

		if (dupSubject) {
			ErrorHelper.throwError(Messages.SUBJECT_OVERVIEW_EXISTS, 400, Constants.SYSTEM_EXCEPTION_TYPES.DATA_NOT_FOUND);
		}

		subject = await SubjectOverviewHelper.setSubjectOverviewDetails(ctx, subject);
		subject = await SubjectOverviewDao.saveGenericResource(ctx, subject);
		return SubjectOverviewDto.transformResource(subject, new SubjectOverviewMapper());
	}

	@Action({
		params: {
			subjectOverviewId: { type: 'string' },
		},
		auth: {
			ignoreAuthToken: true,
		},
	})
	public async deleteSubjectOverview(ctx: ContextWrapper) {
		const subject: SubjectOverview = await SubjectOverviewDao.getGenericResource(ctx, SubjectOverview, {
			where: { id: ctx.params.subjectOverviewId },
		});

		if (!subject) {
			ErrorHelper.throwError(Messages.INVALID_SUBJECT_OVERVIEW, 400, Constants.SYSTEM_EXCEPTION_TYPES.DATA_NOT_FOUND);
		}
		await SubjectOverviewDao.softDeleteResource(ctx, subject);
	}

	@Action({
		params: {
			...Constants.DEFAULT_PAGINATION_PARAMS,
		},
		auth: {
			ignoreAuthToken: true,
		},
	})
	public async getSubjectOverviewBySubject(ctx: ContextWrapper) {
		const subject = await SubjectOverviewDao.getSubjectOverviewBySubject(ctx);
		return subject ? SubjectOverviewDto.transformResource(subject, new SubjectOverviewMapper()) : subject;
	}
}

module.exports = new SubjectOverviewService();
