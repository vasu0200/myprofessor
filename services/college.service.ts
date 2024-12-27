import { CollegeDao } from '@Dao/college.dao';
import { ErrorHelper } from '@Helpers/error-helper';
import { ContextWrapper } from '@Helpers/molecular-helper';
import { CollegeHelper } from '@Helpers/service-helpers/college.helper';
import { Address } from '@Models/address';
import { College } from '@Models/college';
import { Constants } from '@Utility/constants';
import { Messages } from '@Utility/Messages';
import { Action } from 'moleculer-decorators';
import async from 'async';
import { PagedResponse } from 'src/dto/base.dto';
import {
	CollegeAddressMapper,
	CollegeDto,
	CollegeBranchesMapper,
	CollegeMapper,
	CollegeViewMapper,
	SectionMapper,
	SubjectGradeMapper,
} from 'src/dto/college.dto';
import { Role } from '@Models/role';
import { BranchMapper } from 'src/dto/branch.dto';
import AuthSchema from './auth';
import { UserRoleType } from '@Utility/enum';
import { CollegeBranch } from '@Models/college-branch';
import { Section } from '@Models/section';
import { UserBranch } from '@Models/user-branch';

export default class CollegeService extends AuthSchema {
	public name: string = 'college';
	public static COLLEGE_PARAMS = {
		name: { type: 'string' },
		email: { type: 'email' },
		phoneNumber: { type: 'string', optional: true },
		mobileNumber: { type: 'string' },
		logo: { type: 'string', optional: true },
		universityId: { type: 'string' },
		productType: { type: 'string' },
		branches: { type: 'array', items: { type: 'string' } },
		fromDate: { type: 'string' },
		toDate: { type: 'string' },
	};
	public static ADDRESS_PARAMS = {
		address1: { type: 'string' },
		address2: { type: 'string', optional: true },
		city: { type: 'string' },
		state: { type: 'string' },
		country: { type: 'string' },
		landMark: { type: 'string', optional: true },
		zipCode: { type: 'string' },
	};
	static USER_GRADE_PARAMS = {
		userId: { type: 'string' },
		schoolId: { type: 'string' },
		gradeId: { type: 'string' },
		sectionId: { type: 'string' },
	};

	@Action({
		params: {
			...Constants.DEFAULT_PAGINATION_PARAMS,
		},
		auth: {
			role: UserRoleType.SuperAdmin,
		},
	})
	public async getColleges(ctx: ContextWrapper): Promise<PagedResponse<CollegeMapper>> {
		const colleges = await CollegeDao.getColleges(ctx);
		colleges.items = CollegeDto.transformResources(colleges.items, new CollegeMapper());
		return colleges;
	}

	@Action({
		params: {
			collegeId: { type: 'string' },
		},
		auth: {
			role: UserRoleType.SuperAdmin,
		},
	})
	public async getCollege(ctx: ContextWrapper): Promise<{ college: CollegeViewMapper; address: CollegeAddressMapper; collegeBranches: string[] }> {
		const college: College = await CollegeDao.getGenericResource(ctx, College, { where: { id: ctx.params.collegeId } });

		if (!college) {
			ErrorHelper.throwError(Messages.INVALID_COLLEGE, 400, Constants.SYSTEM_EXCEPTION_TYPES.DATA_NOT_FOUND);
		}

		const address: Address = (await college.address) || new Address();
		const collegeBranches: CollegeBranch[] = (await college.collegeBranches) || [];

		const schoolReturnValue = CollegeDto.transformResource(college, new CollegeViewMapper());
		const addressReturnValue = CollegeDto.transformResource(address, new CollegeAddressMapper());

		return { college: schoolReturnValue, address: addressReturnValue, collegeBranches: collegeBranches.map((e) => e.branchId) };
	}

	@Action({
		params: {
			...CollegeService.COLLEGE_PARAMS,
			...CollegeService.ADDRESS_PARAMS,
		},
		auth: {
			role: UserRoleType.SuperAdmin,
		},
	})
	public async createCollege(ctx: ContextWrapper): Promise<{ college: CollegeViewMapper; address: CollegeAddressMapper; collegeBranches: string[] }> {
		const users: any = await ctx.call('user.getUsersByEmails', { emailIds: ctx.params.emailIds });

		if (users.length > 0) {
			const dupEmails = users
				.filter((u) => ctx.params.emailIds.includes(u.email.toUpperCase()))
				.map((usr) => usr.email)
				.join(', ');
			ErrorHelper.throwError(`${Messages.DUPLICATE_COLLEGE_ADMINS} ${dupEmails}`, 400, Constants.SYSTEM_EXCEPTION_TYPES.DUPLICATE_DATA);
		}

		// save address
		let newAddress: Address = CollegeHelper.setAddressDetails(ctx, new Address());
		newAddress = await CollegeDao.saveGenericResource(ctx, newAddress);

		let newCollege: College = await CollegeHelper.setCollegeDetails(ctx, new College());

		newCollege.addressId = newAddress.id;
		newCollege = await CollegeDao.saveGenericResource(ctx, newCollege);

		// handle college branches assignment
		const { branchesToSave, branchesTodelete } = CollegeHelper.handleCollegeBranches(ctx, newCollege.id);

		// delete college branches
		await CollegeDao.softDeleteResourceByIds(ctx, CollegeBranch, branchesTodelete);

		// save new college branches
		const collegeBranches: string[] = [];
		await async.forEachLimit(branchesToSave, 1, async (e) => {
			const collegeBranch: CollegeBranch = await CollegeDao.saveGenericResource(ctx, e);
			collegeBranches.push(collegeBranch.branchId);

			// create default section
			await ctx.call('section.addSection', { name: Constants.DEFAULT_SECTION_NAME, isDefault: true, collegeBranchId: collegeBranch.id });
		});

		const college = CollegeDto.transformResource(newCollege, new CollegeViewMapper());
		const address = CollegeDto.transformResource(newAddress, new CollegeAddressMapper());

		return { college, address, collegeBranches };
	}

	@Action({
		params: {
			...CollegeService.COLLEGE_PARAMS,
			collegeId: { type: 'string' },
			...CollegeService.ADDRESS_PARAMS,
		},
		auth: {
			role: UserRoleType.SuperAdmin,
		},
	})
	public async updateCollege(ctx: ContextWrapper): Promise<{ college: CollegeViewMapper; address: CollegeAddressMapper; collegeBranches: string[] }> {
		const users: any = await ctx.call('user.getUsersByEmails', { emailIds: ctx.params.emailIds });

		if (users.length > 0) {
			let dupEmails = users.filter((u) => !ctx.params.emailIds.includes(u.email.toUpperCase())).map((usr) => usr.email);
			if (dupEmails.length > 0) {
				dupEmails = dupEmails.join(', ');
				ErrorHelper.throwError(`${Messages.DUPLICATE_COLLEGE_ADMINS} ${dupEmails}`, 400, Constants.SYSTEM_EXCEPTION_TYPES.DUPLICATE_DATA);
			}
		}

		let college: College = await CollegeDao.getGenericResource(ctx, College, { where: { id: ctx.params.collegeId } });

		if (!college) {
			ErrorHelper.throwError(Messages.INVALID_COLLEGE, 400, Constants.SYSTEM_EXCEPTION_TYPES.DATA_NOT_FOUND);
		}

		college = await CollegeHelper.setCollegeDetails(ctx, college);

		let address: Address = CollegeHelper.setAddressDetails(ctx, (await college.address) || new Address());
		address = await CollegeDao.saveGenericResource(ctx, address);

		college = await CollegeDao.saveGenericResource(ctx, college);

		// const dbSchoolGrades: CollegeBranch[] = (await college.collegeBranches) || [new CollegeBranch()];

		// // handle college branches assignment
		// const { branchesToSave, branchesTodelete } = CollegeHelper.handleCollegeBranches(ctx, college.id, dbSchoolGrades);

		// // delete college branches
		// await CollegeDao.softDeleteResourceByIds(ctx, CollegeBranch, branchesTodelete);

		// // save new college grades
		const collegeBranches: string[] = [];
		// await async.forEachLimit(branchesToSave, 1, async (e) => {
		// 	const collegeBranch: CollegeBranch = await CollegeDao.saveGenericResource(ctx, e);
		// 	collegeBranches.push(collegeBranch.branchId);

		// 	// create default section
		// 	await ctx.call('section.addSection', { name: Constants.DEFAULT_SECTION_NAME, isDefault: true, collegeBranchId: collegeBranch.id });
		// });

		const schoolReturnValue = CollegeDto.transformResource(college, new CollegeViewMapper());
		const addressReturnValue = CollegeDto.transformResource(address, new CollegeAddressMapper());

		return { college: schoolReturnValue, address: addressReturnValue, collegeBranches: collegeBranches };
	}

	@Action({
		params: {
			collegeId: { type: 'string' },
		},
		auth: {
			role: UserRoleType.SuperAdmin,
		},
	})
	public async deleteCollege(ctx: ContextWrapper): Promise<boolean> {
		const college: College = await CollegeDao.getGenericResource(ctx, College, { where: { id: ctx.params.collegeId } });

		if (!college) {
			ErrorHelper.throwError(Messages.INVALID_COLLEGE, 400, Constants.SYSTEM_EXCEPTION_TYPES.DATA_NOT_FOUND);
		}

		await CollegeDao.softDeleteResource(ctx, college, CollegeBranch, { where: { collegeId: college.id } });
		return true;
	}

	@Action({
		params: {
			collegeId: { type: 'string' },
			admins: {
				type: 'array',
				items: {
					type: 'object',
					props: {
						email: { type: 'email' },
						password: { type: 'string' },
					},
				},
			},
		},
		auth: {
			role: UserRoleType.SuperAdmin,
		},
	})
	public async addCollegeAdmins(ctx: ContextWrapper) {
		const admins: { email: string; password: string }[] = ctx.params.admins;
		const college: College = await CollegeDao.getGenericResource(ctx, College, { where: { id: ctx.params.collegeId } });
		const role: Role = await CollegeDao.getGenericResource(ctx, Role, { where: { name: UserRoleType.CollegeAdmin } });

		if (!college) {
			ErrorHelper.throwError(Messages.INVALID_COLLEGE, 400, Constants.SYSTEM_EXCEPTION_TYPES.DATA_NOT_FOUND);
		}

		// get existig college admins
		const dbCollegeAdmins: {
			email: string;
			password: string;
			name: string;
			roleId: string;
			userId: string;
		}[] = await CollegeDao.getCollegeAdmins(ctx);

		// new admins
		const newAdmins: { email: string; password: string }[] = admins.filter((e) => {
			return dbCollegeAdmins.every((dbs) => {
				return dbs.email.toUpperCase() !== e.email.toUpperCase();
			});
		});

		// INFO: Use this if needed
		// const adminsToUpdatePassword: { email: string; password: string }[] = [];
		const adminsToDelete: { email: string; password: string; name: String; roleId: string; userId: string }[] = [];

		dbCollegeAdmins.forEach((dbs) => {
			const admin = admins.find((a) => a.email.toUpperCase() == dbs.email.toUpperCase());

			if (!admin) {
				// admins that needs to be soft deleted
				adminsToDelete.push(dbs);
			}

			// INFO: Use this if needed
			// if (admin && admin.password != '') {
			// 	// admins for whose passwords need to be updated
			// 	adminsToUpdatePassword.push(admin);
			// }
		});

		if (adminsToDelete.length > 0) {
			await async.forEachLimit(adminsToDelete, 1, async (e) => {
				await ctx.call('user.deleteUserWithRole', { userId: e.userId, roleId: role.id });
			});
		}

		// INFO: Use it if needed
		// if (adminsToUpdatePassword.length > 0) {
		// 	await async.forEachLimit(adminsToUpdatePassword, 1, async (e) => {});
		// }

		if (newAdmins.length > 0) {
			await async.forEachLimit(newAdmins, 1, async (e) => {
				await ctx.call('user.createPartialUser', {
					email: e.email,
					password: e.password,
					roleId: role.id,
					roleName: role.name,
					collegeId: college.id,
					universityId: college.universityId,
				});
			});
		}
	}

	@Action({
		params: {
			collegeId: { type: 'string' },
		},
		auth: {
			role: UserRoleType.SuperAdmin,
		},
	})
	public async getCollegeAdmins(ctx: ContextWrapper) {
		const college: College = await CollegeDao.getGenericResource(ctx, College, { where: { id: ctx.params.collegeId } });

		if (!college) {
			ErrorHelper.throwError(Messages.INVALID_COLLEGE, 400, Constants.SYSTEM_EXCEPTION_TYPES.DATA_NOT_FOUND);
		}

		return await CollegeDao.getCollegeAdmins(ctx);
	}

	@Action({
		params: {
			...Constants.DEFAULT_PAGINATION_PARAMS,
			collegeId: { type: 'string' },
		},
	})
	public async getCollegeBranches(ctx: ContextWrapper): Promise<PagedResponse<CollegeBranchesMapper>> {
		const collegeBranches = await CollegeDao.getCollegeBranches(ctx, ctx.params.collegeId);
		collegeBranches.items = CollegeDto.transformResources(collegeBranches.items, new CollegeBranchesMapper());
		return collegeBranches;
	}

	@Action({
		params: {
			collegeId: { type: 'string' },
			name: { type: 'string' },
			index: { type: 'number', optional: true },
			image: { type: 'string', optional: true },
		},
	})
	public async createCollegeBranch(ctx: ContextWrapper): Promise<CollegeBranchesMapper> {
		// get college info
		const college: College = await CollegeDao.getGenericResource(ctx, College, { where: { id: ctx.params.collegeId } });

		// add branch
		const branchInfo: BranchMapper = await ctx.call('branch.createBranch', {
			name: ctx.params.name,
			image: ctx.params.image,
			isDefault: false,
			universityId: college.universityId,
			index: ctx.params.index,
		});

		// add college branch
		let collegeBranch: CollegeBranch = CollegeHelper.setCollegeBranchDetails(new CollegeBranch(), college.id, branchInfo.id);
		collegeBranch = await CollegeDao.saveGenericResource(ctx, collegeBranch);

		const returnValue = CollegeDto.transformResource({ ...collegeBranch, ...branchInfo }, new CollegeBranchesMapper());
		returnValue.collegeBranchId = collegeBranch.id;
		return returnValue;
	}

	@Action({
		params: {
			collegeId: { type: 'string' },
			collegeBranchId: { type: 'string' },
		},
	})
	public async getCollegeBranch(ctx: ContextWrapper): Promise<CollegeBranchesMapper> {
		const collegeBranch = await CollegeDao.getCollegeBranch(ctx, ctx.params.collegeId, ctx.params.collegeBranchId);
		return CollegeDto.transformResource(collegeBranch, new CollegeBranchesMapper());
	}

	@Action({
		params: {
			collegeId: { type: 'string' },
			collegeBranchId: { type: 'string' },
			name: { type: 'string' },
			index: { type: 'number', optional: true },
			image: { type: 'string', optional: true },
		},
	})
	public async updateCollegeBranch(ctx: ContextWrapper): Promise<CollegeBranchesMapper> {
		const college: College = await CollegeDao.getGenericResource(ctx, College, { where: { id: ctx.params.collegeId } });
		let collegeBranch = await CollegeDao.getGenericResource(ctx, CollegeBranch, { where: { id: ctx.params.collegeBranchId } });

		if (!collegeBranch) {
			ErrorHelper.throwError(Messages.INVALID_BRANCH, 400, Constants.SYSTEM_EXCEPTION_TYPES.DATA_NOT_FOUND);
		}

		// update branch
		const branchInfo: BranchMapper = await ctx.call('branch.updateBranch', {
			branchId: collegeBranch.branchId,
			name: ctx.params.name,
			image: ctx.params.image,
			index: ctx.params.index,
			isDefault: false,
			universityId: college.universityId,
		});

		// add college branch
		// collegeBranch = CollegeHelper.setCollegeBranchDetails(new CollegeBranch(), college.id, branchInfo.id);
		collegeBranch = await CollegeDao.saveGenericResource(ctx, collegeBranch);

		const returnValue = CollegeDto.transformResource({ ...collegeBranch, ...branchInfo }, new CollegeBranchesMapper());
		returnValue.collegeBranchId = collegeBranch.id;

		return returnValue;
	}

	@Action({
		params: {
			collegeId: { type: 'string' },
			collegeBranchId: { type: 'string' },
		},
	})
	public async deleteCollegeBranch(ctx: ContextWrapper): Promise<boolean> {
		const collegeBranch = await CollegeDao.getGenericResource(ctx, CollegeBranch, { where: { id: ctx.params.collegeBranchId } });

		if (!collegeBranch) {
			ErrorHelper.throwError(Messages.INVALID_BRANCH, 400, Constants.SYSTEM_EXCEPTION_TYPES.DATA_NOT_FOUND);
		}

		// delete branch
		await ctx.call('branch.deleteBranch', { branchId: collegeBranch.branchId });

		// delete college branch
		await CollegeDao.softDeleteResource(ctx, collegeBranch);

		return true;
	}

	// @Action({
	// 	params: {
	// 		userId: { type: 'string' },
	// 	},
	// })
	// public async getUserGrade(ctx: ContextWrapper): Promise<UserGradeMapper> {
	// 	const userGrade: UserGrade = await CollegeDao.getGenericResource(ctx, UserGrade, { where: { userId: ctx.params.userId } });
	// 	return CollegeDto.transformResource(userGrade || new UserGrade(), new UserGradeMapper());
	// }

	// @Action({
	// 	params: {
	// 		...CollegeService.USER_GRADE_PARAMS,
	// 	},
	// 	// TODO: In security validate student role
	// })
	// public async assignGradesToStudent(ctx: ContextWrapper) {
	// 	//TODO: validate roleId for the user
	// 	let userGrade: UserGrade = await CollegeDao.getGenericResource(ctx, UserGrade, { where: { userId: ctx.params.userId } });

	// 	// set userGrade details
	// 	userGrade = CollegeHelper.setUserGradeDetails(ctx, userGrade ? userGrade : new UserGrade());

	// 	// save userGrade
	// 	userGrade = await CollegeDao.saveGenericResource(ctx, userGrade);

	// 	// TODO: Trigger action to create corresponding analytic activities
	// 	return CollegeDto.transformResource(userGrade, new UserGradeMapper());
	// }

	@Action({
		params: {
			collegeId: { type: 'string' },
			userId: { type: 'string' },
		},
	})
	public async getClassMappingInfo(ctx: ContextWrapper) {
		const collegeBranchesAndSemInfo = await CollegeDao.getCollegeBranchAndSemestersInfo(ctx, ctx.params.collegeId);

		// get corresponding sections and subjects
		await async.forEachLimit(collegeBranchesAndSemInfo, 1, async (e) => {
			e.sections = await CollegeDao.getGenericResources(ctx, Section, { where: { collegeBranchId: e.collegeBranchId } }, true);
			e.sections = CollegeDto.transformResources(e.sections, new SectionMapper());
			e.subjects = await CollegeDao.getUserSemesterSubjects(ctx, e.semesterId, e.collegeSemesterId);
			e.subjects = CollegeDto.transformResources(e.subjects, new SubjectGradeMapper());
		});

		const userBranches: UserBranch[] = await CollegeDao.getGenericResources(ctx, UserBranch, { where: { userId: ctx.params.userId } }, true);
		return { collegeBranchesAndSemInfo, userBranches };
	}

	@Action({
		params: {
			universityId: { type: 'string' },
			collegeId: { type: 'string' },
			userId: { type: 'string' },
			branchesInfo: {
				type: 'array',
				items: {
					type: 'object',
					props: {
						subjectId: 'string',
						sectionId: 'string',
						semesterId: 'string',
						branchId: 'string',
					},
				},
			},
		},
		// TODO: In security validate teacher role
	})
	public async assignSubjectsToProfessor(ctx: ContextWrapper) {
		const userBranches: UserBranch[] = await CollegeDao.getGenericResources(ctx, UserBranch, { where: { userId: ctx.params.userId } }, true);
		const paramBranchesInfo: { subjectId: string; sectionId: string; semesterId: string; branchId: string }[] = ctx.params.branchesInfo;
		const newGradesToAdd: any[] = [];

		if (!userBranches.length) {
			// save all the user branches
			await async.forEachLimit(paramBranchesInfo, 1, async (pgi) => {
				ctx.params.subjectId = pgi.subjectId;
				ctx.params.branchId = pgi.branchId;
				ctx.params.semesterId = pgi.semesterId;
				ctx.params.sectionId = pgi.sectionId;
				const userBranch = CollegeHelper.setUserBranchDetails(ctx, new UserBranch());
				await CollegeDao.saveGenericResource(ctx, userBranch);
			});

			return;
		}

		await async.forEachLimit(paramBranchesInfo, 1, async (pgi) => {
			if (
				!userBranches.some(
					(ug) => ug.sectionId == pgi.sectionId && ug.subjectId == pgi.subjectId && ug.branchId == pgi.branchId && ug.semesterId == pgi.semesterId,
				)
			) {
				ctx.params.subjectId = pgi.subjectId;
				ctx.params.branchId = pgi.branchId;
				ctx.params.semesterId = pgi.semesterId;
				ctx.params.sectionId = pgi.sectionId;
				const userBranch = CollegeHelper.setUserBranchDetails(ctx, new UserBranch());
				await CollegeDao.saveGenericResource(ctx, userBranch);
				newGradesToAdd.push(pgi);
			}
		});

		const userGradesToDelete: string[] = userBranches
			.filter(
				(e) =>
					!paramBranchesInfo.some(
						(pgi) => pgi.semesterId == e.semesterId && pgi.branchId == e.branchId && pgi.sectionId == e.sectionId && pgi.subjectId == e.subjectId,
					),
			)
			.map((e) => e.id);

		if (userGradesToDelete.length) {
			await CollegeDao.softDeleteResourceByIds(ctx, UserBranch, userGradesToDelete);
		}
	}

	@Action({
		params: {
			collegeId: { type: 'string' },
			userId: { type: 'string' },
		},
	})
	public async unAssignGradesFromTeacher(ctx: ContextWrapper) {
		const userGrades: UserBranch[] = await CollegeDao.getGenericResources(ctx, UserBranch, { where: { userId: ctx.params.userId } }, true);
		await CollegeDao.softDeleteResourceByIds(
			ctx,
			UserBranch,
			userGrades.map((e) => e.id),
		);
	}

	// @Action({
	// 	params: {
	// 		status: { type: 'string' },
	// 		schoolId: { type: 'string' },
	// 	},
	// 	auth: {
	// 		role: UserRoleType.SuperAdmin,
	// 	},
	// })
	// public async changeStatus(ctx: ContextWrapper) {
	// 	let college: College = await CollegeDao.getGenericResource(ctx, College, { where: { id: ctx.params.schoolId } });

	// 	if (!college) {
	// 		ErrorHelper.throwError(Messages.INVALID_COLLEGE, 400, Constants.SYSTEM_EXCEPTION_TYPES.DATA_NOT_FOUND);
	// 	}

	// 	if (college.status == ctx.params.status) {
	// 		ErrorHelper.throwError('Cannot Perform this action', 400, Constants.SYSTEM_EXCEPTION_TYPES.VALIDATION_ERROR);
	// 	}

	// 	college.status = ctx.params.status;
	// 	college = await CollegeDao.saveGenericResource(ctx, college);
	// 	return CollegeDto.transformResource(college, new CollegeViewMapper());
	// }

	@Action({
		params: {
			collegeId: { type: 'string' },
			branchId: { type: 'string' },
		},
	})
	public async getUserCollegeSections(ctx: ContextWrapper) {
		return await CollegeDao.getUserCollegeSections(ctx, ctx.meta.userId, ctx.params.collegeId, ctx.params.branchId);
	}

	@Action({
		params: {
			collegeId: { type: 'string' },
		},
	})
	public async getUserCollegeBranches(ctx: ContextWrapper) {
		return await CollegeDao.getUserCollegeBranches(ctx, ctx.meta.userId, ctx.params.collegeId);
	}

	@Action({
		params: {
			collegeId: { type: 'string' },
			branchId: { type: 'string' },
		},
	})
	public async getUserCollegeSemesters(ctx: ContextWrapper) {
		return await CollegeDao.getUserCollegeSemesters(ctx, ctx.meta.userId, ctx.params.collegeId, ctx.params.branchId, ctx.params.sectionId);
	}

	@Action({
		params: {
			collegeId: { type: 'string' },
			branchId: { type: 'string' },
			semesterId: { type: 'string' },
		},
	})
	public async getUserCollegeSubjects(ctx: ContextWrapper) {
		return await CollegeDao.getUserCollegeSubjects(ctx, ctx.meta.userId, ctx.params.collegeId, ctx.params.branchId, ctx.params.semesterId);
	}

	@Action({
		params: {
			collegeId: { type: 'string' },
			branchId: { type: 'string' },
			semesterId: { type: 'string' },
			subjectId: { type: 'string' },
		},
	})
	public async getUserCollegeChapters(ctx: ContextWrapper) {
		return await CollegeDao.getUserCollegeChapters(
			ctx,
			ctx.meta.userId,
			ctx.params.collegeId,
			ctx.params.branchId,
			ctx.params.semesterId,
			ctx.params.subjectId,
		);
	}

	@Action({
		params: {
			collegeId: { type: 'string' },
			branchId: { type: 'string' },
			semesterId: { type: 'string' },
			subjectId: { type: 'string' },
			chapterId: { type: 'string' },
		},
	})
	public async getUserCollegetopics(ctx: ContextWrapper) {
		return await CollegeDao.getUserCollegeTopics(
			ctx,
			ctx.meta.userId,
			ctx.params.collegeId,
			ctx.params.branchId,
			ctx.params.semesterId,
			ctx.params.subjectId,
			ctx.params.chapterId,
		);
	}

	@Action({
		params: {},
	})
	public async getCollegeSectionUsers(ctx: ContextWrapper) {
		return await CollegeDao.getCollegeSectionUsers(ctx);
	}

	// Professor Actions

	@Action({
		params: {
			collegeId: { type: 'string' },
		},
	})
	public async getProfessorCollegeBranches(ctx: ContextWrapper) {
		return await CollegeDao.getProfessorCollegeBranches(ctx, ctx.meta.userId, ctx.params.collegeId);
	}

	@Action({
		params: {
			collegeId: { type: 'string' },
			branchId: { type: 'string' },
		},
	})
	public async getProfessorCollegeSemesters(ctx: ContextWrapper) {
		return await CollegeDao.getProfessorCollegeSemesters(ctx, ctx.meta.userId, ctx.params.collegeId, ctx.params.branchId);
	}

	@Action({
		params: {
			collegeId: { type: 'string' },
			branchId: { type: 'string' },
			sectionId: { type: 'string' },
		},
	})
	public async getProfessorCollegeSemesterSections(ctx: ContextWrapper) {
		return await CollegeDao.getProfessorCollegeSemesterSections(
			ctx,
			ctx.meta.userId,
			ctx.params.collegeId,
			ctx.params.branchId,
			ctx.params.sectionId,
		);
	}

	@Action({
		params: {
			collegeId: { type: 'string' },
			sectionId: { type: 'string' },
		},
	})
	public async getProfessorCollegeSectionSubjects(ctx: ContextWrapper) {
		return await CollegeDao.getProfessorCollegeSectionSubjects(ctx, ctx.meta.userId, ctx.params.collegeId, ctx.params.sectionId);
	}
}

module.exports = new CollegeService();
