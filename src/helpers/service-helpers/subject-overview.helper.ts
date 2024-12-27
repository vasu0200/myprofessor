import { ContextWrapper } from '@Helpers/molecular-helper';
import { SubjectOverview } from '@Models/subject-overview';
import { Method } from 'moleculer-decorators';

export class SubjectOverviewHelper {
	@Method
	public static async setSubjectOverviewDetails(ctx: ContextWrapper, target: SubjectOverview) {
		target.index = ctx.params.index;
		target.universityId = ctx.params.universityId;
		target.branchId = ctx.params.branchId;
		target.subjectId = ctx.params.subjectId;
		target.description = ctx.params.description;
		return target;
	}
}
