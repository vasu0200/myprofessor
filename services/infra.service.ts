import { Action } from 'moleculer-decorators';
const SwaggerJson = require('../swagger/swagger.config.json');
import AuthSchema from './auth';

export default class InfraService extends AuthSchema {
	public name: string = 'infra';

	@Action({
		auth: {
			ignoreAuthToken: true,
		},
	})
	public async getSwaggerJson() {
		return SwaggerJson;
	}
}

module.exports = new InfraService();
