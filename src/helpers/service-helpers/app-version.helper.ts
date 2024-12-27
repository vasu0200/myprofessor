import { ContextWrapper } from '@Helpers/molecular-helper';
import { AppVersion } from '@Models/app-version';

import { Method } from 'moleculer-decorators';

export class AppVersionHelper {
	@Method
	public static setVersionDetails(ctx: ContextWrapper, appVersion: AppVersion) {
		appVersion.title = ctx.params.title || '';
		appVersion.description = ctx.params.description || '';
		appVersion.version = ctx.params.version;
		appVersion.additionalInfo = ctx.params.additionalInfo || '';
		return appVersion;
	}
}
