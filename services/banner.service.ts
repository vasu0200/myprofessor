import AuthSchema from './auth';
import { ErrorHelper } from '@Helpers/error-helper';
import { ContextWrapper } from '@Helpers/molecular-helper';
import { Action } from 'moleculer-decorators';
import { Constants } from '@Utility/constants';
import { BannerDao } from '@Dao/banner.dao';
import { PagedResponse } from 'src/dto/base.dto';
import { BannerDto, BannerMapper } from 'src/dto/banner.dto';
import { Messages } from '@Utility/Messages';
import { Banner } from '@Models/banner';
import { BannerHelper } from '@Helpers/service-helpers/banner.helper';

export default class BannerService extends AuthSchema {
	public name: string = 'banner';
	public static BANNER_PARAMS = {
		image: { type: 'string' },
		index: { type: 'number' },
	};

	@Action({
		params: {
			...Constants.DEFAULT_PAGINATION_PARAMS,
		},
		auth: {
			ignoreAuthToken: true,
		},
	})
	public async getBanners(ctx: ContextWrapper): Promise<PagedResponse<BannerMapper>> {
		const banners = await BannerDao.getBanners(ctx);
		banners.items = BannerDto.transformResources(banners.items, new BannerMapper());
		return banners;
	}

	@Action({
		params: {
			...BannerService.BANNER_PARAMS,
		},
		auth: {
			ignoreAuthToken: true,
		},
	})
	public async addBanner(ctx: ContextWrapper) {
		let newBanner: Banner = await BannerHelper.setBanner(ctx, new Banner());
		newBanner = await BannerDao.saveGenericResource(ctx, newBanner);
		const banner = BannerDto.transformResource(newBanner, new BannerMapper());
		return banner;
	}

	@Action({
		params: {
			bannerId: { type: 'string' },
			...BannerService.BANNER_PARAMS,
		},
		auth: {
			ignoreAuthToken: true,
		},
	})
	public async updateBanner(ctx: ContextWrapper) {
		let banner: Banner = await BannerDao.getGenericResource(ctx, Banner, {
			where: { id: ctx.params.bannerId },
		});
		if (!banner) {
			ErrorHelper.throwError(Messages.INVALID_BANNER, 400, Constants.SYSTEM_EXCEPTION_TYPES.DATA_NOT_FOUND);
		}
		banner = await BannerHelper.setBanner(ctx, banner);
		banner = await BannerDao.saveGenericResource(ctx, banner);
		return BannerDto.transformResource(banner, new BannerMapper());
	}

	@Action({
		params: {
			bannerId: { type: 'string' },
		},
		auth: {
			ignoreAuthToken: true,
		},
	})
	public async getBanner(ctx: ContextWrapper) {
		const banner: Banner = await BannerDao.getGenericResource(ctx, Banner, {
			where: { id: ctx.params.bannerId },
		});

		if (!banner) {
			ErrorHelper.throwError(Messages.INVALID_BANNER, 400, Constants.SYSTEM_EXCEPTION_TYPES.DATA_NOT_FOUND);
		}
		return BannerDto.transformResource(banner, new BannerMapper());
	}

	@Action({
		params: {
			bannerId: { type: 'string' },
		},
		auth: {
			ignoreAuthToken: true,
		},
	})
	public async deleteBanner(ctx: ContextWrapper) {
		const banner: Banner = await BannerDao.getGenericResource(ctx, Banner, {
			where: { id: ctx.params.bannerId },
		});

		if (!banner) {
			ErrorHelper.throwError(Messages.INVALID_BANNER, 400, Constants.SYSTEM_EXCEPTION_TYPES.DATA_NOT_FOUND);
		}

		await BannerDao.softDeleteResource(ctx, banner);
		return true;
	}
}
module.exports = new BannerService();
