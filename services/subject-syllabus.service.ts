import { SubjectSyllabusDao } from "@Dao/subject-syllabus.dao";
import { ErrorHelper } from "@Helpers/error-helper";
import { ContextWrapper } from "@Helpers/molecular-helper";
import { SubjectSyllabusHelper } from "@Helpers/service-helpers/subject-syllabus.helper";
import AuthSchema from "./auth";
import { Action } from "moleculer-decorators";
import { Constants } from "@Utility/constants";
import { SubjectSyllabusDto,SubjectSyllabusMapper} from "src/dto/subject-syllabus.dto";
import { Messages } from "@Utility/Messages";
import { PagedResponse } from "src/dto/base.dto";
import { SubjectSyllabus } from "@Models/subject-syllabus";

export default class SubjectSyllabusService extends AuthSchema {
	public name: string = 'subjectSyllabus';
	public static SUBJECT_SYLLABUS_PARAMS = {
		idx: { type: 'number' },
		subjectId: { type: 'string' },
		universityId: { type: 'string' },
		branchId: { type: 'string' },
		chapterId: { type: 'string' },
	};

	@Action({
		params: {
			...Constants.DEFAULT_PAGINATION_PARAMS,
		},
		auth: {
			ignoreAuthToken: true,
		},
	})
	public async getSubjectSyllabus(ctx: ContextWrapper): Promise<PagedResponse<SubjectSyllabusMapper>> {
		const ss = await SubjectSyllabusDao.getSubjectSyllabus(ctx);
		ss.items = SubjectSyllabusDto.transformResources(ss.items, new SubjectSyllabusMapper());
		return ss;
	}

	@Action({
		params: {
			...SubjectSyllabusService.SUBJECT_SYLLABUS_PARAMS,
		},
		auth: {
			ignoreAuthToken: true,
		},
	})
	public async addSubjectSyllabus(ctx: ContextWrapper) {
		const ss: SubjectSyllabus = await SubjectSyllabusDao.checkSubjectSyllabus(ctx);
		if (ss) {
			ErrorHelper.throwError(Messages.SUBJECT_SYLLABUS_EXISTS, 400, Constants.SYSTEM_EXCEPTION_TYPES.DATA_NOT_FOUND);
		}
		let newss: SubjectSyllabus = await SubjectSyllabusHelper.setSubjectSyllabus(ctx, new SubjectSyllabus());
		newss = await SubjectSyllabusDao.saveGenericResource(ctx, newss);
		return SubjectSyllabusDto.transformResource(newss, new SubjectSyllabusMapper());
	}

	@Action({
		params: {
			...SubjectSyllabusService.SUBJECT_SYLLABUS_PARAMS,
			subjectSyllabusId: { type: 'string' },
		},
		auth: {
			ignoreAuthToken: true,
		},
	})
	public async updateSubjectSyllabus(ctx: ContextWrapper) {
		let ss: SubjectSyllabus = await SubjectSyllabusDao.getGenericResource(ctx, SubjectSyllabus, {
			where: { id: ctx.params.subjectSyllabusId },
		});
		if (!ss) {
			ErrorHelper.throwError(Messages.INVALID_SUBJECT_SYLLABUS, 400, Constants.SYSTEM_EXCEPTION_TYPES.DATA_NOT_FOUND);
		}
		const dupss: SubjectSyllabus = await SubjectSyllabusDao.checkSubjectSyllabus(ctx, true);

		if (dupss) {
			ErrorHelper.throwError(Messages.SUBJECT_SYLLABUS_NAME_EXISTS, 400, Constants.SYSTEM_EXCEPTION_TYPES.DATA_NOT_FOUND);
		}
		ss = await SubjectSyllabusHelper.setSubjectSyllabus(ctx, ss);
		ss = await SubjectSyllabusDao.saveGenericResource(ctx, ss);
		return SubjectSyllabusDto.transformResource(ss, new SubjectSyllabusMapper());
	}

	@Action({
		params: {
			subjectSyllabusId: { type: 'string' },
		},
		auth: {
			ignoreAuthToken: true,
		},
	})
	public async getSubjectSyllabusById(ctx: ContextWrapper): Promise<SubjectSyllabusMapper> {
		const ss: SubjectSyllabus = await SubjectSyllabusDao.getGenericResource(ctx, SubjectSyllabus, {
			where: { id: ctx.params.subjectSyllabusId },
		});
		if (!ss) {
			ErrorHelper.throwError(Messages.INVALID_SUBJECT_SYLLABUS, 400, Constants.SYSTEM_EXCEPTION_TYPES.DATA_NOT_FOUND);
		}
		return SubjectSyllabusDto.transformResource(ss, new SubjectSyllabusMapper());
	}

	@Action({
		params: {
			subjectSyllabusId: { type: 'string' },
		},
		auth: {
			ignoreAuthToken: true,
		},
	})
	public async deleteSubjectSyllabus(ctx: ContextWrapper) {
		const ss: SubjectSyllabus = await SubjectSyllabusDao.getGenericResource(ctx, SubjectSyllabus, {
			where: { id: ctx.params.subjectSyllabusId },
		});
		if (!ss) {
			ErrorHelper.throwError(Messages.INVALID_SUBJECT_SYLLABUS, 400, Constants.SYSTEM_EXCEPTION_TYPES.DATA_NOT_FOUND);
		}
		await SubjectSyllabusDao.softDeleteResource(ctx, ss);
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
	public async getSubjectSyllabusBySubject(ctx: ContextWrapper): Promise<PagedResponse<SubjectSyllabusMapper>> {
		const ss = await SubjectSyllabusDao.getSubjectSyllabusBySubject(ctx);
		ss.items = SubjectSyllabusDto.transformResources(ss.items, new SubjectSyllabusMapper());
		return ss;
	}
}
module.exports = new SubjectSyllabusService();
