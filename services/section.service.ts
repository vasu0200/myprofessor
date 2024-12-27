import { SectionDao } from '@Dao/section.dao';
import { ErrorHelper } from '@Helpers/error-helper';
import { ContextWrapper } from '@Helpers/molecular-helper';
import { SectionHelper } from '@Helpers/service-helpers/section.helper';
import { Section } from '@Models/section';
import { Constants } from '@Utility/constants';
import { Messages } from '@Utility/Messages';
import { Action } from 'moleculer-decorators';
import { SectionMapper } from 'src/dto/college.dto';
import { SectionDto } from 'src/dto/section.dto';
import AuthSchema from './auth';

export default class SectionService extends AuthSchema {
	public name: string = 'section';

	@Action({
		params: {
			name: { type: 'string' },
			isDefault: { type: 'boolean', optional: true },
			collegeBranchId: { type: 'string' },
		},
		auth: {
			ignoreAuthToken: true,
		},
	})
	public async addSection(ctx: ContextWrapper): Promise<SectionMapper> {
		let newSection: Section = SectionHelper.setSectionDetails(ctx, new Section());
		newSection = await SectionDao.saveGenericResource(ctx, newSection);
		return SectionDto.transformResource(newSection, new SectionMapper());
	}

	@Action({
		params: {
			collegeBranchId: { type: 'string' },
		},
	})
	public async getSections(ctx: ContextWrapper): Promise<SectionMapper[]> {
		const sections: Section[] = await SectionDao.getGenericResources(ctx, Section, { where: { collegeBranchId: ctx.params.collegeBranchId } });
		return SectionDto.transformResources(sections, new SectionMapper());
	}

	@Action({
		params: {
			name: { type: 'string' },
			collegeBranchId: { type: 'string' },
			sectionId: { type: 'string' },
		},
	})
	public async updateSection(ctx: ContextWrapper) {
		let section: Section = await SectionDao.getGenericResource(ctx, Section, { where: { id: ctx.params.sectionId } });
		if (!section) {
			ErrorHelper.throwError(Messages.INVALID_SECTION, 400, Constants.SYSTEM_EXCEPTION_TYPES.DATA_NOT_FOUND);
		}

		section = SectionHelper.setSectionDetails(ctx, section);
		section = await SectionDao.saveGenericResource(ctx, section);
		return SectionDto.transformResource(section, new SectionMapper());
	}

	@Action({
		params: {
			collegeBranchId: { type: 'string' },
			sectionId: { type: 'string' },
		},
	})
	public async deleteSection(ctx: ContextWrapper) {
		const section: Section = await SectionDao.getGenericResource(ctx, Section, { where: { id: ctx.params.sectionId } });

		if (!section) {
			ErrorHelper.throwError(Messages.INVALID_SECTION, 400, Constants.SYSTEM_EXCEPTION_TYPES.DATA_NOT_FOUND);
		}

		await SectionDao.softDeleteResource(ctx, section);
		return true;
	}
}

module.exports = new SectionService();
