import { ContextWrapper } from '@Helpers/molecular-helper';
import SystemHelper from '@Helpers/system-helpers';
import { Method } from 'moleculer-decorators';
import { WebSubject } from '@Models/web-subject';

export class WebSubjectHelper {
	@Method
	public static async setWebSubjectDetails(ctx: ContextWrapper, target: WebSubject) {
		target.universityId = ctx.params.universityId;
		target.branchId = ctx.params.branchId;
		target.subjectId = ctx.params.subjectId;
		target.index = ctx.params.index;
		return target;
	}
}
