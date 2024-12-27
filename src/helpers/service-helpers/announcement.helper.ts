import { ContextWrapper } from '@Helpers/molecular-helper';
import { Announcement } from '@Models/announcement';
import { Method } from 'moleculer-decorators';
import moment from 'moment';

export class AnnouncementHelper {
	@Method
	public static async setAnnouncementDetails(ctx: ContextWrapper, target: Announcement): Promise<Announcement> {
		target.title = ctx.params.title;
		target.description = ctx.params.description;
		target.fromDate = new Date(moment(ctx.params.fromDate).startOf('day').format());
		target.toDate = new Date(moment(ctx.params.toDate).startOf('day').format());
		target.collegeId = ctx.params.collegeId;
		target.semesters = ctx.params.semesters.toString() || '';
		target.branches = ctx.params.branches.toString() || '';
		target.sections = ctx.params.sections.toString() || '';
		target.semesters = ctx.params.semesters.toString() || '';

		return target;
	}
}
