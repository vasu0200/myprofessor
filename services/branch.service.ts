import { BranchDao } from '@Dao/branch.dao';
import { ErrorHelper } from '@Helpers/error-helper';
import { ContextWrapper } from '@Helpers/molecular-helper';
import { BranchHelper } from '@Helpers/service-helpers/branch.helper';
import { Branch } from '@Models/branch';
import { UserRoleType } from '@Utility/enum';
import { Constants } from '@Utility/constants';
import { Messages } from '@Utility/Messages';
import { Action } from 'moleculer-decorators';
import { PagedResponse } from 'src/dto/base.dto';
import { BranchDto, BranchMapper, BranchSectionMapper, TeacherBranchMapper } from 'src/dto/branch.dto';
import AuthSchema from './auth';
import { Semester } from '@Models/semester';

export default class BranchService extends AuthSchema {
	public name: string = 'branch';

	@Action({
		params: {
			...Constants.DEFAULT_PAGINATION_PARAMS,
			universityId: { type: 'string' },
		},
		auth: {
			ignoreAuthToken: true,
		},
	})
	public async getBranches(ctx: ContextWrapper): Promise<PagedResponse<BranchMapper>> {
		const branches = await BranchDao.getBranches(ctx);
		branches.items = BranchDto.transformResources(branches.items, new BranchMapper());
		return branches;
	}

	@Action({
		params: {
			...Constants.DEFAULT_PAGINATION_PARAMS,
			universityId: { type: 'string' },
		},
		auth: {
			ignoreAuthToken: true,
		},
	})
	public async getBranchesForWebsite(ctx: ContextWrapper): Promise<PagedResponse<BranchMapper>> {
		const branches = await BranchDao.getBranches(ctx);
		branches.items = BranchDto.transformResources(branches.items, new BranchMapper());
		return branches;
	}

	@Action({
		params: {
			name: { type: 'string' },
			image: { type: 'string', optional: true },
			isDefault: { type: 'boolean', optional: true },
			universityId: { type: 'string' },
		},
		auth: {
			role: UserRoleType.SuperAdmin,
		},
	})
	public async createBranch(ctx: ContextWrapper): Promise<BranchMapper> {
		let branch: Branch = await BranchDao.checkBranch(ctx);

		if (branch) {
			ErrorHelper.throwError(Messages.BRANCH_NAME_EXISTS, 400, Constants.SYSTEM_EXCEPTION_TYPES.DATA_NOT_FOUND);
		}

		let newBranch = await BranchHelper.setBranchDetails(ctx, new Branch());
		newBranch = await BranchDao.saveGenericResource(ctx, newBranch);

		// TODO: add default section
		return BranchDto.transformResource(newBranch, new BranchMapper());
	}

	@Action({
		params: {
			universityId: { type: 'string' },
			branchId: { type: 'string' },
		},
		auth: {
			role: UserRoleType.SuperAdmin,
		},
	})
	public async getBranch(ctx: ContextWrapper): Promise<BranchMapper> {
		const branch: Branch = await BranchDao.getGenericResource(ctx, Branch, { where: { id: ctx.params.branchId } });

		if (!branch) {
			ErrorHelper.throwError(Messages.INVALID_BRANCH, 400, Constants.SYSTEM_EXCEPTION_TYPES.DATA_NOT_FOUND);
		}

		return BranchDto.transformResource(branch, new BranchMapper());
	}

	@Action({
		params: {
			branchId: { type: 'string' },
			universityId: { type: 'string' },
			name: { type: 'string' },
			image: { type: 'string', optional: true },
			index: { type: 'number' },
		},
		auth: {
			role: UserRoleType.SuperAdmin,
		},
	})
	public async updateBranch(ctx: ContextWrapper): Promise<BranchMapper> {
		let branch: Branch = await BranchDao.getGenericResource(ctx, Branch, { where: { id: ctx.params.branchId } });

		if (!branch) {
			ErrorHelper.throwError(Messages.INVALID_BRANCH, 400, Constants.SYSTEM_EXCEPTION_TYPES.DATA_NOT_FOUND);
		}

		let dupBranch: Branch = await BranchDao.checkBranch(ctx, true);

		if (dupBranch) {
			ErrorHelper.throwError(Messages.BRANCH_NAME_EXISTS, 400, Constants.SYSTEM_EXCEPTION_TYPES.DATA_NOT_FOUND);
		}

		branch = await BranchHelper.setBranchDetails(ctx, branch);
		branch = await BranchDao.saveGenericResource(ctx, branch);

		return BranchDto.transformResource(branch, new BranchMapper());
	}

	@Action({
		params: {
			branchId: { type: 'string' },
		},
		auth: {
			role: UserRoleType.SuperAdmin,
		},
	})
	public async deleteBranch(ctx: ContextWrapper): Promise<boolean> {
		const branch: Branch = await BranchDao.getGenericResource(ctx, Branch, { where: { id: ctx.params.branchId } });

		if (!branch) {
			ErrorHelper.throwError(Messages.INVALID_BRANCH, 400, Constants.SYSTEM_EXCEPTION_TYPES.DATA_NOT_FOUND);
		}

		await BranchDao.softDeleteResource(ctx, branch, Semester, { where: { branchId: branch.id } });
		return true;
	}

	@Action({
		params: {
			...Constants.DEFAULT_PAGINATION_PARAMS,
			teacherId: { type: 'string' },
		},
	})
	public async getAssignedBranches(ctx: ContextWrapper): Promise<PagedResponse<BranchMapper>> {
		const branches = await BranchDao.getAssignedBranches(ctx);
		branches.items = BranchDto.transformResources(branches.items, new TeacherBranchMapper());
		return branches;
	}

	@Action({
		params: {
			branchId: { type: 'string' },
			teacherId: { type: 'string' },
		},
	})
	public async getBranchesSections(ctx: ContextWrapper): Promise<PagedResponse<BranchMapper>> {
		let branches = await BranchDao.getBranchesSections(ctx);
		branches = BranchDto.transformResources(branches, new BranchSectionMapper());
		return branches;
	}
}

module.exports = new BranchService();
