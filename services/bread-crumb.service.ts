import { BreadCrumbDao } from '@Dao/bread-crumb.dao';
import { ContextWrapper } from '@Helpers/molecular-helper';
import { Action } from 'moleculer-decorators';
import { PagedResponse } from 'src/dto/base.dto';
import { BreadCrumbDto, BreadCrumbMapper } from 'src/dto/bread-crumb.dto';
import AuthSchema from './auth';

export default class BreadCrumbService extends AuthSchema {
	public name: string = 'breadCrumb';

	static BREAD_CRUMB_PARAMS = {
		universityId: { type: 'string', optional: true },
		branchId: { type: 'string', optional: true },
		semesterId: { type: 'string', optional: true },
		subjectId: { type: 'string', optional: true },
		chapterId: { type: 'string', optional: true },
	};

	@Action({
		params: {
			...BreadCrumbService.BREAD_CRUMB_PARAMS,
		},
	})
	public async getBreadCrumbs(ctx: ContextWrapper): Promise<PagedResponse<BreadCrumbMapper>> {
		let breadCrumbs = await BreadCrumbDao.getBreadCrumbs(ctx);
		breadCrumbs = BreadCrumbDto.transformResource(breadCrumbs, new BreadCrumbMapper());
		return breadCrumbs;
	}

	@Action({
		params: {
			uniSubjectId: { type: 'string', optional: true },
			uniTopicId: { type: 'string', optional: true },
			activityId: { type: 'string', optional: true },
		},
	})
	public async getUniversalBreadCrumb(ctx: ContextWrapper): Promise<PagedResponse<BreadCrumbMapper>> {
		let breadCrumbs = await BreadCrumbDao.getBreadCrumbs(ctx);
		breadCrumbs = BreadCrumbDto.transformResource(breadCrumbs, new BreadCrumbMapper());
		return breadCrumbs;
	}

	@Action({
		params: {
			...BreadCrumbService.BREAD_CRUMB_PARAMS,
			topic: { type: 'string', optional: true },
			section: { type: 'string', optional: true },
			activity: { type: 'string', optional: true },
		},
	})
	public async getTeacherBreadCrumb(ctx: ContextWrapper): Promise<PagedResponse<BreadCrumbMapper>> {
		let breadCrumbs = await BreadCrumbDao.getBreadCrumbs(ctx);
		return breadCrumbs;
	}

	@Action({
		params: {
			branchId: { type: 'string', optional: true },
			semesterId: { type: 'string', optional: true },
			subjectId: { type: 'string', optional: true },
			chapterId: { type: 'string', optional: true },
			topicId: { type: 'string', optional: true },
			sectionId: { type: 'string', optional: true },
			activityId: { type: 'string', optional: true },
			schoolId: { type: 'string', optional: true },
		},
	})
	public async getStudentBreadCrumb(ctx: ContextWrapper): Promise<PagedResponse<BreadCrumbMapper>> {
		let breadCrumbs = await BreadCrumbDao.getBreadCrumbs(ctx);
		breadCrumbs = BreadCrumbDto.transformResource(breadCrumbs, new BreadCrumbMapper());
		return breadCrumbs;
	}
}

module.exports = new BreadCrumbService();
