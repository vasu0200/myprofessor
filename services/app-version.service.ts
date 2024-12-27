import { AppVersiontDao } from '@Dao/app-version.dao';
import { ContextWrapper } from '@Helpers/molecular-helper';
import { AppVersionHelper } from '@Helpers/service-helpers/app-version.helper';
import { AppVersion } from '@Models/app-version';
import { Action, BaseSchema } from 'moleculer-decorators';

export default class AppVersionService extends BaseSchema {
	public name: string = 'appVersion';

	@Action({
		auth: {
			ignoreAuthToken: true,
		},
	})
	public async getAppLatestVersion(ctx: ContextWrapper) {
		const appVersion: AppVersion = await AppVersiontDao.getAppLatestVersion(ctx);

		return appVersion;
	}

	@Action({
		params: {
			title: { type: 'string', optional: true },
			description: { type: 'string', optional: true },
			version: { type: 'string' },
			additionalInfo: { type: 'string', optional: true },
		},
		auth: {
			ignoreAuthToken: true,
		},
	})
	public async addNewVersion(ctx: ContextWrapper) {
		let newVersion = await AppVersionHelper.setVersionDetails(ctx, new AppVersion());
		newVersion = await AppVersiontDao.saveGenericResource(ctx, newVersion);

		return newVersion;
	}
}

module.exports = new AppVersionService();
