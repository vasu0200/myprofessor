import AuthSchema from './auth';
import { ErrorHelper } from '@Helpers/error-helper';
import { ContextWrapper } from '@Helpers/molecular-helper';
import { Action } from 'moleculer-decorators';
import { PagedResponse } from 'src/dto/base.dto';
import { BlogDao } from '@Dao/blog.dao';
import { BlogDto, BlogMapper } from 'src/dto/blog.dto';
import { Messages } from '@Utility/Messages';
import { Blog } from '@Models/blogs';
import { BlogHelper } from '@Helpers/service-helpers/blog.helper';
import { Constants } from '@Utility/constants';

export default class BlogService extends AuthSchema {
	public name: string = 'blog';

	public static BLOG_PARAMS = {
		title: { type: 'string' },
		description: { type: 'string' },
		image: { type: 'string' },
		idx: { type: 'number' },
	};

	@Action({
		params: {
			...Constants.DEFAULT_PAGINATION_PARAMS,
		},
		auth: {
			ignoreAuthToken: true,
		},
	})
	public async getBlogs(ctx: ContextWrapper): Promise<PagedResponse<BlogMapper>> {
		const blogs = await BlogDao.getBlogs(ctx);
		blogs.items = BlogDto.transformResources(blogs.items, new BlogMapper());
		return blogs;
	}

	@Action({
		params: {
			...BlogService.BLOG_PARAMS,
		},
		auth: {
			ignoreAuthToken: true,
		},
	})
	public async addBlog(ctx: ContextWrapper) {
		const blog: Blog = await BlogDao.checkBlog(ctx);
		if (blog) {
			ErrorHelper.throwError(Messages.BLOG_EXISTS, 400, Constants.SYSTEM_EXCEPTION_TYPES.DATA_NOT_FOUND);
		}
		let newBlog: Blog = await BlogHelper.setBlog(ctx, new Blog());
		newBlog = await BlogDao.saveGenericResource(ctx, newBlog);
		return BlogDto.transformResource(newBlog, new BlogMapper());
	}

	@Action({
		params: {
			blogId: { type: 'string' },
			...BlogService.BLOG_PARAMS,
		},
		auth: {
			ignoreAuthToken: true,
		},
	})
	public async updateBlog(ctx: ContextWrapper) {
		let blog: Blog = await BlogDao.getGenericResource(ctx, Blog, {
			where: { id: ctx.params.blogId },
		});
		if (!blog) {
			ErrorHelper.throwError(Messages.INVALID_BLOG, 400, Constants.SYSTEM_EXCEPTION_TYPES.DATA_NOT_FOUND);
		}
		const dupTsc: Blog = await BlogDao.checkBlog(ctx, true);

		if (dupTsc) {
			ErrorHelper.throwError(Messages.BLOG_EXISTS, 400, Constants.SYSTEM_EXCEPTION_TYPES.DATA_NOT_FOUND);
		}
		blog = await BlogHelper.setBlog(ctx, blog);
		blog = await BlogDao.saveGenericResource(ctx, blog);
		return BlogDto.transformResource(blog, new BlogMapper());
	}

	@Action({
		params: {
			blogId: { type: 'string' },
		},
		auth: {
			ignoreAuthToken: true,
		},
	})
	public async getBlogById(ctx: ContextWrapper) {
		const blog: Blog = await BlogDao.getGenericResource(ctx, Blog, {
			where: { id: ctx.params.blogId },
		});
		if (!blog) {
			ErrorHelper.throwError(Messages.INVALID_BLOG, 400, Constants.SYSTEM_EXCEPTION_TYPES.DATA_NOT_FOUND);
		}
		return BlogDto.transformResource(blog, new BlogMapper());
	}

	@Action({
		params: {
			blogId: { type: 'string' },
		},
		auth: {
			ignoreAuthToken: true,
		},
	})
	public async deleteBlog(ctx: ContextWrapper) {
		const blog: Blog = await BlogDao.getGenericResource(ctx, Blog, {
			where: { id: ctx.params.blogId },
		});
		if (!blog) {
			ErrorHelper.throwError(Messages.INVALID_BLOG, 400, Constants.SYSTEM_EXCEPTION_TYPES.DATA_NOT_FOUND);
		}
		await BlogDao.softDeleteResource(ctx, blog);
		return true;
	}
}
module.exports = new BlogService();
