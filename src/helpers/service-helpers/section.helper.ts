import { ContextWrapper } from '@Helpers/molecular-helper';
import { Section } from '@Models/section';
import { Method } from 'moleculer-decorators';

export class SectionHelper {
	@Method
	public static setSectionDetails(ctx: ContextWrapper, target: Section) {
		target.name = ctx.params.name;
		target.isDefault = ctx.params.isDefault || false;
		target.collegeBranchId = ctx.params.collegeBranchId;
		return target;
	}
}
