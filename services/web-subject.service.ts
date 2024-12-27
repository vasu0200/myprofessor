import { WebSubjectDao } from '@Dao/web-subject.dao';
import { ErrorHelper } from '@Helpers/error-helper';
import { ContextWrapper } from '@Helpers/molecular-helper';
import { WebSubject } from '@Models/web-subject';
import { Constants } from '@Utility/constants';
import { Messages } from '@Utility/Messages';
import { Action } from 'moleculer-decorators';
import { WebSubjectHelper } from '@Helpers/service-helpers/web-subject.helper';
import { PagedResponse } from 'src/dto/base.dto';
import { WebSubjectDto, WebSubjectMapper } from 'src/dto/web-subject.dto';
import AuthSchema from './auth';

export default class SubjectswebService extends AuthSchema {
	public name: string = 'webSubject';
	public static WebSubject_PARAMS = {
		index: { type: 'number' },
		universityId: { type: 'string' },
		branchId: { type: 'string' },
		subjectId: { type: 'string' },
	};

	@Action({
		params: {
			...Constants.DEFAULT_PAGINATION_PARAMS,
		},
		auth: {
			ignoreAuthToken: true,
		},
	})
	public async getWebSubjects(ctx: ContextWrapper): Promise<PagedResponse<WebSubjectMapper>> {
		const webSubjects = await WebSubjectDao.getWebSubjects(ctx);
		webSubjects.items = WebSubjectDto.transformResources(webSubjects.items, new WebSubjectMapper());
		return webSubjects;
	}

	@Action({
		params: {
			...Constants.DEFAULT_PAGINATION_PARAMS,
		},
		auth: {
			ignoreAuthToken: true,
		},
	})
	public async getWebSubjectsByBranch(ctx: ContextWrapper): Promise<PagedResponse<WebSubjectMapper>> {
		const webSubjects = await WebSubjectDao.getWebSubjectsByBranch(ctx);
		webSubjects.items = WebSubjectDto.transformResources(webSubjects.items, new WebSubjectMapper());
		return webSubjects;
	}

	@Action({
		params: {
			...SubjectswebService.WebSubject_PARAMS,
		},
		auth: {
			ignoreAuthToken: true,
		},
	})
	public async addWebSubject(ctx: ContextWrapper) {
		const webSubject: WebSubject = await WebSubjectDao.checkWebSubject(ctx);

		if (webSubject) {
			ErrorHelper.throwError(Messages.SUBJECT_NAME_EXISTS, 400, Constants.SYSTEM_EXCEPTION_TYPES.DATA_NOT_FOUND);
		}
		let newWebSubject: WebSubject = await WebSubjectHelper.setWebSubjectDetails(ctx, new WebSubject());
		newWebSubject = await WebSubjectDao.saveGenericResource(ctx, newWebSubject);
		return WebSubjectDto.transformResource(newWebSubject, new WebSubjectMapper());
	}

	@Action({
		params: {
			webSubjectId: { type: 'string' },
		},
		auth: {
			ignoreAuthToken: true,
		},
	})
	public async getWebSubjectById(ctx: ContextWrapper): Promise<WebSubjectMapper> {
		const webSubject: WebSubject = await WebSubjectDao.getGenericResource(ctx, WebSubject, { where: { id: ctx.params.webSubjectId } });

		if (!webSubject) {
			ErrorHelper.throwError(Messages.INVALID_SUBJECT, 400, Constants.SYSTEM_EXCEPTION_TYPES.DATA_NOT_FOUND);
		}
		return WebSubjectDto.transformResource(webSubject, new WebSubjectMapper());
	}

	@Action({
		params: {
			...SubjectswebService.WebSubject_PARAMS,
			webSubjectId: { type: 'string' },
		},
		auth: {
			ignoreAuthToken: true,
		},
	})
	public async updateWebSubject(ctx: ContextWrapper) {
		let webSubject: WebSubject = await WebSubjectDao.getGenericResource(ctx, WebSubject, { where: { id: ctx.params.webSubjectId } });

		if (!webSubject) {
			ErrorHelper.throwError(Messages.INVALID_SUBJECT, 400, Constants.SYSTEM_EXCEPTION_TYPES.DATA_NOT_FOUND);
		}

		const dupWebSubject: WebSubject = await WebSubjectDao.checkWebSubject(ctx, true);

		if (dupWebSubject) {
			ErrorHelper.throwError(Messages.SUBJECT_NAME_EXISTS, 400, Constants.SYSTEM_EXCEPTION_TYPES.DATA_NOT_FOUND);
		}

		webSubject = await WebSubjectHelper.setWebSubjectDetails(ctx, webSubject);
		webSubject = await WebSubjectDao.saveGenericResource(ctx, webSubject);
		return WebSubjectDto.transformResource(webSubject, new WebSubjectMapper());
	}

	@Action({
		params: {
			webSubjectId: { type: 'string' },
		},
		auth: {
			ignoreAuthToken: true,
		},
	})
	public async deleteWebSubject(ctx: ContextWrapper) {
		const subject: WebSubject = await WebSubjectDao.getGenericResource(ctx, WebSubject, { where: { id: ctx.params.webSubjectId } });

		if (!subject) {
			ErrorHelper.throwError(Messages.INVALID_SUBJECT, 400, Constants.SYSTEM_EXCEPTION_TYPES.DATA_NOT_FOUND);
		}
		await WebSubjectDao.softDeleteResource(ctx, subject);
	}
}
module.exports = new SubjectswebService();
