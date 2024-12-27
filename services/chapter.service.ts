import { ChapterDao } from '@Dao/chapter.dao';
import { ErrorHelper } from '@Helpers/error-helper';
import { ContextWrapper } from '@Helpers/molecular-helper';
import { ChapterHelper } from '@Helpers/service-helpers/chapter.helper';
import { Chapter } from '@Models/chapter';
import { Topic } from '@Models/topic';
import { Constants } from '@Utility/constants';
import { Messages } from '@Utility/Messages';
import { Action } from 'moleculer-decorators';
import { PagedResponse } from 'src/dto/base.dto';
import { ChapterDto, ChapterMapper, TeacherChapterMapper } from 'src/dto/chapter.dto';
import AuthSchema from './auth';
import { TargetSourceType } from '@Utility/enum';

export default class ChapterService extends AuthSchema {
	public name: string = 'chapter';
	public static CHAPTER_PARAMS = {
		name: { type: 'string' },
		color: { type: 'string' },
		idx: { type: 'number' },
		image: { type: 'string', optional: true },
		subjectId: { type: 'string' },
		branchId: { type: 'string' },
		universityId: { type: 'string' },
		semesterId: { type: 'string' },
	};

	@Action({
		params: {
			...Constants.DEFAULT_PAGINATION_PARAMS,
			subjectId: { type: 'string' },
		},
	})
	public async getChapters(ctx: ContextWrapper): Promise<PagedResponse<ChapterMapper>> {
		const chapters = await ChapterDao.getChapters(ctx);
		chapters.items = ChapterDto.transformResources(chapters.items, new ChapterMapper());
		return chapters;
	}

	@Action({
		params: {
			...Constants.DEFAULT_PAGINATION_PARAMS,
			subjectId: { type: 'string' },
		},
	})
	public async getProfessorChapters(ctx: ContextWrapper): Promise<PagedResponse<ChapterMapper>> {
		const chapters = await ChapterDao.getProfessorChapters(ctx);
		return chapters;
	}

	@Action({
		params: {
			...ChapterService.CHAPTER_PARAMS,
			resourceType: { type: 'enum', values: [TargetSourceType.Admin, TargetSourceType.Professor], optional: true },
		},
	})
	public async addChapter(ctx: ContextWrapper) {
		const chapter: Chapter = await ChapterDao.checkChapter(ctx);

		if (chapter) {
			ErrorHelper.throwError(Messages.CHAPTER_NAME_EXISTS, 400, Constants.SYSTEM_EXCEPTION_TYPES.DATA_NOT_FOUND);
		}

		let newChapter: Chapter = await ChapterHelper.setChapterDetails(ctx, new Chapter());
		newChapter = await ChapterDao.saveGenericResource(ctx, newChapter);
		return ChapterDto.transformResource(newChapter, new ChapterMapper());
	}

	@Action({
		params: {
			chapterId: { type: 'string' },
		},
	})
	public async getChapter(ctx: ContextWrapper) {
		const chapter: Chapter = await ChapterDao.getGenericResource(ctx, Chapter, {
			where: { id: ctx.params.chapterId, subjectId: ctx.params.subjectId },
		});

		if (!chapter) {
			ErrorHelper.throwError(Messages.INVALID_CHAPTER, 400, Constants.SYSTEM_EXCEPTION_TYPES.DATA_NOT_FOUND);
		}

		return ChapterDto.transformResource(chapter, new ChapterMapper());
	}

	@Action({
		params: {
			chapterId: { type: 'string' },
			...ChapterService.CHAPTER_PARAMS,
		},
	})
	public async updateChapter(ctx: ContextWrapper) {
		let chapter: Chapter = await ChapterDao.getGenericResource(ctx, Chapter, {
			where: { id: ctx.params.chapterId, subjectId: ctx.params.subjectId },
		});

		if (!chapter) {
			ErrorHelper.throwError(Messages.INVALID_CHAPTER, 400, Constants.SYSTEM_EXCEPTION_TYPES.DATA_NOT_FOUND);
		}

		const dupChapter: Chapter = await ChapterDao.checkChapter(ctx, true);

		if (dupChapter) {
			ErrorHelper.throwError(Messages.CHAPTER_NAME_EXISTS, 400, Constants.SYSTEM_EXCEPTION_TYPES.DATA_NOT_FOUND);
		}

		chapter = await ChapterHelper.setChapterDetails(ctx, chapter);
		chapter = await ChapterDao.saveGenericResource(ctx, chapter);
		return ChapterDto.transformResource(chapter, new ChapterMapper());
	}

	@Action({
		params: {
			chapterId: { type: 'string' },
		},
	})
	public async deleteChapter(ctx: ContextWrapper) {
		const chapter: Chapter = await ChapterDao.getGenericResource(ctx, Chapter, {
			where: { id: ctx.params.chapterId, subjectId: ctx.params.subjectId },
		});

		if (!chapter) {
			ErrorHelper.throwError(Messages.INVALID_CHAPTER, 400, Constants.SYSTEM_EXCEPTION_TYPES.DATA_NOT_FOUND);
		}

		await ChapterDao.softDeleteResource(ctx, chapter, Topic, { where: { chapterId: chapter.id } });
		return true;
	}

	@Action({
		params: {
			...Constants.DEFAULT_PAGINATION_PARAMS,
			teacherId: { type: 'string' },
			gradeId: { type: 'string' },
			sectionId: { type: 'string' },
			subjectId: { type: 'string' },
		},
	})
	public async getTeacherChapters(ctx: ContextWrapper): Promise<PagedResponse<ChapterMapper>> {
		const chapters = await ChapterDao.getTeacherChapters(ctx);
		chapters.items = ChapterDto.transformResources(chapters.items, new TeacherChapterMapper());
		return chapters;
	}

	@Action({
		params: {
			userId: { type: 'string' },
			searchValue: { type: 'string' },
		},
		auth: {
			ignoreAuthToken: true,
		},
	})
	public async globalSearch(ctx: ContextWrapper) {
		return await ChapterDao.globalSearch(ctx);
	}

	@Action({
		params: {
			...Constants.DEFAULT_PAGINATION_PARAMS,
			subjectId: { type: 'string' },
		},
		auth: {
			ignoreAuthToken: true,
		},
	})
	public async getChaptersForWebsite(ctx: ContextWrapper): Promise<PagedResponse<ChapterMapper>> {
		const chapters = await ChapterDao.getChapters(ctx);
		chapters.items = ChapterDto.transformResources(chapters.items, new ChapterMapper());
		return chapters;
	}
}
module.exports = new ChapterService();
