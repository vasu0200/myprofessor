import { UniversityDao } from '@Dao/university.dao';
import { ErrorHelper } from '@Helpers/error-helper';
import { ContextWrapper } from '@Helpers/molecular-helper';
import { UniversityHelper } from '@Helpers/service-helpers/university.helper';
import { University } from '@Models/university';
import { Branch } from '@Models/branch';
import { Constants } from '@Utility/constants';
import { Messages } from '@Utility/Messages';
import { Action } from 'moleculer-decorators';
import { PagedResponse } from 'src/dto/base.dto';
import { UniversityDto, UniversityMapper } from 'src/dto/university.dto';
import AuthSchema from './auth';
import { UserRoleType } from '@Utility/enum';
import { Context } from 'moleculer';

export default class UniversityService extends AuthSchema {
	public name: string = 'university';

	@Action({
		params: {
			...Constants.DEFAULT_PAGINATION_PARAMS,
		},
		auth: {
			ignoreAuthToken: true,
		},
	})
	public async getUniversities(ctx: ContextWrapper): Promise<PagedResponse<UniversityMapper>> {
		const universities = await UniversityDao.getUniversities(ctx);
		universities.items = UniversityDto.transformResources(universities.items, new UniversityMapper());
		return universities;
	}

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
	public async createUniversity(ctx: ContextWrapper): Promise<UniversityMapper> {
		const university: University = await UniversityDao.checkUniversity(ctx);

		if (university) {
			ErrorHelper.throwError(Messages.UNIVERSITY_NAME_EXISTS, 400, Constants.SYSTEM_EXCEPTION_TYPES.DUPLICATE_DATA);
		}

		let newUniversity = await UniversityHelper.setUniversityDetails(ctx, new University());
		newUniversity = await UniversityDao.saveGenericResource(ctx, newUniversity);
		return UniversityDto.transformResource(newUniversity, new UniversityMapper());
	}

	@Action({
		params: {
			universityId: { type: 'string' },
			name: { type: 'string' },
			description: { type: 'string', optional: true },
			image: { type: 'string', optional: true },
		},
		auth: {
			role: UserRoleType.SuperAdmin,
		},
	})
	public async updateUniversity(ctx: ContextWrapper): Promise<UniversityMapper> {
		let university: University = await UniversityDao.checkUniversity(ctx, true);

		if (university) {
			ErrorHelper.throwError(Messages.UNIVERSITY_NAME_EXISTS, 400, Constants.SYSTEM_EXCEPTION_TYPES.DATA_NOT_FOUND);
		}

		university = await UniversityDao.getGenericResource(ctx, University, { where: { id: ctx.params.universityId } });

		if (!university) {
			ErrorHelper.throwError(Messages.INVALID_UNIVERSITY, 400, Constants.SYSTEM_EXCEPTION_TYPES.DATA_NOT_FOUND);
		}

		university = await UniversityHelper.setUniversityDetails(ctx, university);
		university = await UniversityDao.saveGenericResource(ctx, university);
		return UniversityDto.transformResource(university, new UniversityMapper());
	}

	@Action({
		params: {
			universityId: { type: 'string' },
		},
		auth: {
			role: UserRoleType.SuperAdmin,
		},
	})
	public async getUniversity(ctx: ContextWrapper): Promise<UniversityMapper> {
		const university: University = await UniversityDao.getGenericResource(ctx, University, { where: { id: ctx.params.universityId } });

		if (!university) {
			ErrorHelper.throwError(Messages.INVALID_UNIVERSITY, 400, Constants.SYSTEM_EXCEPTION_TYPES.DATA_NOT_FOUND);
		}

		return UniversityDto.transformResource(university, new UniversityMapper());
	}

	@Action({
		params: {
			universityId: { type: 'string' },
		},
		auth: {
			role: UserRoleType.SuperAdmin,
		},
	})
	public async deleteUniversity(ctx: ContextWrapper): Promise<boolean> {
		const university: University = await UniversityDao.getGenericResource(ctx, University, { where: { id: ctx.params.universityId } });

		if (!university) {
			ErrorHelper.throwError(Messages.INVALID_UNIVERSITY, 400, Constants.SYSTEM_EXCEPTION_TYPES.DATA_NOT_FOUND);
		}

		await UniversityDao.softDeleteResource(ctx, university, Branch, { where: { universityId: university.id } });
		return true;
	}

	@Action({
		params: {
			...Constants.DEFAULT_PAGINATION_PARAMS,
		},
		auth: {
			ignoreAuthToken: true,
		},
	})
	public async getUniversitiesForWebsite(ctx: ContextWrapper): Promise<PagedResponse<UniversityMapper>> {
		const universities = await UniversityDao.getUniversities(ctx);
		universities.items = UniversityDto.transformResources(universities.items, new UniversityMapper());
		return universities;
	}
}

module.exports = new UniversityService();
