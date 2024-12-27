import { SemesterDao } from '@Dao/semester.dao';
import { ErrorHelper } from '@Helpers/error-helper';
import { ContextWrapper } from '@Helpers/molecular-helper';
import { SemesterHelper } from '@Helpers/service-helpers/semester.helper';
import { Semester } from '@Models/semester';
import { UserRoleType } from '@Utility/enum';
import { Constants } from '@Utility/constants';
import { Messages } from '@Utility/Messages';
import { Action } from 'moleculer-decorators';
import { PagedResponse } from 'src/dto/base.dto';
import { SemesterDto, SemesterMapper } from 'src/dto/semester.dto';
import AuthSchema from './auth';
import { Subject } from '@Models/subject';
import { CollegeSemester } from '@Models/college-semester';

export default class SemesterService extends AuthSchema {
	public name: string = 'semester';

	@Action({
		params: {
			...Constants.DEFAULT_PAGINATION_PARAMS,
			branchId: { type: 'string' },
		},
		auth: {
			ignoreAuthToken: true,
		},
	})
	public async getSemesters(ctx: ContextWrapper): Promise<PagedResponse<SemesterMapper>> {
		const branches = await SemesterDao.getSemesters(ctx);
		branches.items = SemesterDto.transformResources(branches.items, new SemesterMapper());
		return branches;
	}

	@Action({
		params: {
			name: { type: 'string' },
			image: { type: 'string', optional: true },
			isCustom: { type: 'boolean', optional: true },
			collegeId: { type: 'string', optional: true },
			branchId: { type: 'string' },
		},
		auth: {
			role: UserRoleType.SuperAdmin,
		},
	})
	public async createSemester(ctx: ContextWrapper): Promise<SemesterMapper> {
		const semester: Semester = await SemesterDao.checkSemester(ctx);

		if (semester) {
			ErrorHelper.throwError(Messages.SEMESTER_NAME_EXISTS, 400, Constants.SYSTEM_EXCEPTION_TYPES.DATA_NOT_FOUND);
		}

		let newSemester = await SemesterHelper.setSemesterDetails(ctx, new Semester());
		newSemester = await SemesterDao.saveGenericResource(ctx, newSemester);

		if (ctx.params.isCustom) {
			// create college semester
			const collegeSemester = SemesterHelper.setCollegeSemesterDetails(ctx, new CollegeSemester(), newSemester.id);
			await SemesterDao.saveGenericResource(ctx, collegeSemester);
		}

		return SemesterDto.transformResource(newSemester, new SemesterMapper());
	}

	@Action({
		params: {
			name: { type: 'string' },
			image: { type: 'string', optional: true },
			collegeId: { type: 'string' },
			branchId: { type: 'string' },
		},
		auth: {
			role: UserRoleType.CollegeAdmin,
		},
	})
	public async createCollegeSemester(ctx: ContextWrapper) {
		return await ctx.call('semester.createSemester', { ...ctx.params, ...{ isCustom: true } });
	}

	@Action({
		params: {
			semesterId: { type: 'string' },
		},
		auth: {
			role: UserRoleType.SuperAdmin,
		},
	})
	public async getSemester(ctx: ContextWrapper): Promise<SemesterMapper> {
		const semester: Semester = await SemesterDao.getGenericResource(ctx, Semester, { where: { id: ctx.params.semesterId } });

		if (!semester) {
			ErrorHelper.throwError(Messages.INVALID_SEMESTER, 400, Constants.SYSTEM_EXCEPTION_TYPES.DATA_NOT_FOUND);
		}

		return SemesterDto.transformResource(semester, new SemesterMapper());
	}

	@Action({
		params: {
			semesterId: { type: 'string' },
			name: { type: 'string' },
			image: { type: 'string', optional: true },
			index: { type: 'number' },
		},
		auth: {
			role: UserRoleType.SuperAdmin,
		},
	})
	public async updateSemester(ctx: ContextWrapper): Promise<SemesterMapper> {
		let semester: Semester = await SemesterDao.getGenericResource(ctx, Semester, { where: { id: ctx.params.semesterId } });

		if (!semester) {
			ErrorHelper.throwError(Messages.INVALID_SEMESTER, 400, Constants.SYSTEM_EXCEPTION_TYPES.DATA_NOT_FOUND);
		}

		const dupSemester: Semester = await SemesterDao.checkSemester(ctx, true);

		if (dupSemester) {
			ErrorHelper.throwError(Messages.SEMESTER_NAME_EXISTS, 400, Constants.SYSTEM_EXCEPTION_TYPES.DATA_NOT_FOUND);
		}

		semester = await SemesterHelper.setSemesterDetails(ctx, semester);
		semester = await SemesterDao.saveGenericResource(ctx, semester);
		return SemesterDto.transformResource(semester, new SemesterMapper());
	}

	@Action({
		params: {
			semesterId: { type: 'string' },
		},
		auth: {
			role: UserRoleType.SuperAdmin,
		},
	})
	public async deleteSemester(ctx: ContextWrapper): Promise<boolean> {
		const semester: Semester = await SemesterDao.getGenericResource(ctx, Semester, { where: { id: ctx.params.semesterId } });

		if (!semester) {
			ErrorHelper.throwError(Messages.INVALID_SEMESTER, 400, Constants.SYSTEM_EXCEPTION_TYPES.DATA_NOT_FOUND);
		}

		await SemesterDao.softDeleteResource(ctx, semester, Subject, { where: { semesterId: semester.id } });
		return true;
	}

	@Action({
		params: {},
		auth: {
			role: UserRoleType.CollegeAdmin,
		},
	})
	public async getCollegeBranchSemesters(ctx: ContextWrapper) {
		return await SemesterDao.getCollegeSemesters(ctx, ctx.params.collegeId, ctx.params.branchId);
	}
}

module.exports = new SemesterService();
