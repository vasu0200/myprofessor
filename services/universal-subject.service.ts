import { UniversalSubjectDao } from '@Dao/universal-subject.dao';
import { ErrorHelper } from '@Helpers/error-helper';
import { UniversalLibraryHelper } from '@Helpers/service-helpers/universal-library.helper';
import { UniversalSubject } from '@Models/universal-subject';
import { UniversalTopic } from '@Models/universal-topic';
import { Constants } from '@Utility/constants';
import { UserRoleType } from '@Utility/enum';
import { Messages } from '@Utility/Messages';
import { Action } from 'moleculer-decorators';
import { PagedResponse } from 'src/dto/base.dto';
import { UniversalSubjectDto, UniversalSubjectMapper } from 'src/dto/universal-subject.dto';
import { ContextWrapper } from 'src/helpers/molecular-helper';
import AuthSchema from './auth';

export default class UniversalSubjectService extends AuthSchema {
	public name: string = 'universalSubject';

	@Action({
		params: {
			name: { type: 'string' },
			description: { type: 'string', optional: true },
			image: { type: 'string', optional: true },
		},
		auth: {
			role: UserRoleType.SuperAdmin,
		},
	})
	public async createSubject(ctx: ContextWrapper): Promise<UniversalSubjectMapper> {
		const subject: UniversalSubject = await UniversalSubjectDao.checkSubject(ctx);

		if (subject) {
			ErrorHelper.throwError(Messages.UNIVERSAL_SUBJECT_NAME_EXISTS, 404, Constants.SYSTEM_EXCEPTION_TYPES.VALIDATION_ERROR);
		}

		// set subject details
		let newUniversalSubject = await UniversalLibraryHelper.setSubjectDetails(ctx, new UniversalSubject());
		newUniversalSubject = await UniversalSubjectDao.saveGenericResource(ctx, newUniversalSubject);
		return UniversalSubjectDto.transformResource(newUniversalSubject, new UniversalSubjectMapper());
	}

	@Action({
		params: {
			...Constants.DEFAULT_PAGINATION_PARAMS,
		},
		auth: {
			role: UserRoleType.SuperAdmin,
		},
	})
	public async getSubjects(ctx: ContextWrapper): Promise<PagedResponse<UniversalSubjectMapper>> {
		const universalSubjects = await UniversalSubjectDao.getSubjects(ctx);
		universalSubjects.items = UniversalSubjectDto.transformResources(universalSubjects.items, new UniversalSubjectMapper());
		return universalSubjects;
	}

	@Action({
		params: {
			subjectId: { type: 'string' },
		},
		auth: {
			role: UserRoleType.SuperAdmin,
		},
	})
	public async getSubject(ctx: ContextWrapper) {
		const universalSubject = await UniversalSubjectDao.getGenericResource(ctx, UniversalSubject, { where: { id: ctx.params.subjectId } });

		if (!universalSubject) {
			ErrorHelper.throwError(Messages.INVALID_UNIVERSAL_SUBJECT, 400, Constants.SYSTEM_EXCEPTION_TYPES.DATA_NOT_FOUND);
		}

		return UniversalSubjectDto.transformResource(universalSubject, new UniversalSubjectMapper());
	}

	@Action({
		params: {
			subjectId: { type: 'string' },
			name: { type: 'string' },
			description: { type: 'string', optional: true },
			image: { type: 'string', optional: true },
		},
		auth: {
			ignoreAuthToken: true,
		},
	})
	public async updateSubject(ctx: ContextWrapper): Promise<UniversalSubjectMapper> {
		// set subject details
		let universalSubject = await UniversalSubjectDao.getGenericResource(ctx, UniversalSubject, { where: { id: ctx.params.subjectId } });

		if (!universalSubject) {
			ErrorHelper.throwError(Messages.INVALID_UNIVERSAL_SUBJECT, 400, Constants.SYSTEM_EXCEPTION_TYPES.DATA_NOT_FOUND);
		}

		const subject: UniversalSubject = await UniversalSubjectDao.checkSubject(ctx, true);

		if (subject) {
			ErrorHelper.throwError(Messages.UNIVERSAL_SUBJECT_NAME_EXISTS, 404, Constants.SYSTEM_EXCEPTION_TYPES.VALIDATION_ERROR);
		}

		universalSubject = await UniversalLibraryHelper.setSubjectDetails(ctx, universalSubject);

		universalSubject = await UniversalSubjectDao.saveGenericResource(ctx, universalSubject);
		return UniversalSubjectDto.transformResource(universalSubject, new UniversalSubjectMapper());
	}

	@Action({
		params: {
			subjectId: { type: 'string' },
		},
		auth: {
			role: UserRoleType.SuperAdmin,
		},
	})
	public async deleteSubject(ctx: ContextWrapper): Promise<boolean> {
		const universalSubject = await UniversalSubjectDao.getGenericResource(ctx, UniversalSubject, { where: { id: ctx.params.subjectId } });

		if (!universalSubject) {
			ErrorHelper.throwError(Messages.INVALID_UNIVERSAL_SUBJECT, 400, Constants.SYSTEM_EXCEPTION_TYPES.DATA_NOT_FOUND);
		}

		await UniversalSubjectDao.softDeleteResource(ctx, universalSubject, UniversalTopic, { where: { subjectId: universalSubject.id } });
		return true;
	}

	@Action({
		params: {
			...Constants.DEFAULT_PAGINATION_PARAMS,
			searchValue: { type: 'string' },
		},
		auth: {
			role: UserRoleType.SuperAdmin,
		},
	})
	public async searchSubjects(ctx: ContextWrapper): Promise<PagedResponse<UniversalSubjectMapper>> {
		const universalSubjects = await UniversalSubjectDao.getSubjects(ctx, ctx.params.searchValue);
		universalSubjects.items = UniversalSubjectDto.transformResources(universalSubjects.items, new UniversalSubjectMapper());
		return universalSubjects;
	}
}

module.exports = new UniversalSubjectService();
