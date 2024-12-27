import AwsHelper from '@Helpers/aws-helper';
import { ContextWrapper, ResponseWrapper } from '@Helpers/molecular-helper';
import SystemHelper from '@Helpers/system-helpers';
import { LoggerRequestType } from '@Utility/enum';
import { Service, ServiceBroker } from 'moleculer';
import ApiGateway from 'moleculer-web';
import ApiRoutes from '@Utility/api-routes';
import Events from '@Utility/events';
const SwaggerService = require('../swagger/swagger.mixin');

export default class ApiService extends Service {
	public constructor(broker: ServiceBroker) {
		super(broker);
		// @ts-ignore
		this.parseServiceSchema({
			name: 'api',
			mixins: [
				ApiGateway,
				SwaggerService({}), // Swagger
			],
			// More info about settings: https://moleculer.services/docs/0.14/moleculer-web.html
			settings: {
				port: process.env.PORT || 5000,
				cors: {
					origin: '*',
					methods: ['GET', 'OPTIONS', 'POST', 'PUT', 'PATCH', 'DELETE'],
					allowedHeaders: '*',
					credentials: true,
					maxAge: null,
				},
				routes: [
					{
						path: '/api',
						whitelist: [
							// Access to any actions in all services under "/api" URL
							'**',
						],
						// Route-level Express middlewares. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Middlewares
						use: [],
						// Enable/disable parameter merging method. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Disable-merging
						mergeParams: true,

						// Enable authentication. Implement the logic into `authenticate` method. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Authentication
						authentication: false,

						// Enable authorization. Implement the logic into `authorize` method. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Authorization
						authorization: false,

						// The auto-alias feature allows you to declare your route alias directly in your services.
						// The gateway will dynamically build the full routes from service schema.
						autoAliases: true,

						aliases: {
							...ApiRoutes,
						},

						async onError(req: any, res: any, err: any) {
							await ResponseWrapper.sendErrorResponse(req, res, err, broker);
						},

						async onBeforeCall(ctx: ContextWrapper, route: any, req: any, res: any) {
							// Log Incoming Request
							ctx.meta.requestId = SystemHelper.getUUID();
							ctx.meta.headers = req.headers;
							const loggerInfo = {
								type: LoggerRequestType.APIRequest,
								requestId: ctx.meta.requestId,
								url: req.url,
								method: req.method,
								requestBody: SystemHelper.ignoreLoggerFields(req.body),
							};
							ctx.broker.logger.info('Request', JSON.stringify(loggerInfo));
							await AwsHelper.logToCloudWatch([{ timestamp: new Date().valueOf(), message: JSON.stringify(loggerInfo) }], ctx.broker);

							// set auth token
							ctx.meta.jwt = req.headers['jwt'] || '';
						},

						async onAfterCall(ctx: ContextWrapper, route: any, req: any, res: any, data: any) {
							// build response obj
							const responseObject = ResponseWrapper.sendDataResponse(req, res, data);

							// Log Outgoing Response
							const loggerInfo = {
								type: LoggerRequestType.APIResponse,
								requestId: ctx.meta.requestId,
								url: req.url,
								method: req.method,
								responseBody: req.url == '/my-professor/swagger.json' ? {} : data,
								statusCode: res.code,
							};
							ctx.broker.logger.info('Response', JSON.stringify(loggerInfo));
							await AwsHelper.logToCloudWatch([{ timestamp: new Date().valueOf(), message: JSON.stringify(loggerInfo) }], ctx.broker);
							return responseObject;
						},

						// Calling options. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Calling-options
						callingOptions: {},

						bodyParsers: {
							json: {
								strict: false,
								limit: '10MB',
							},
							urlencoded: {
								extended: true,
								limit: '10MB',
							},
						},

						// Mapping policy setting. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Mapping-policy
						mappingPolicy: 'restrict',

						// Enable/disable logging
						logging: true,
					},
				],
				// Do not log client side errors (does not log an error response when the error.code is 400<=X<500)
				log4XXResponses: false,
				// Logging the request parameters. Set to any log level to enable it. E.g. "info"
				logRequestParams: null,
				// Logging the response data. Set to any log level to enable it. E.g. "info"
				logResponseData: null,
				// Serve assets from "public" folder
				assets: {
					folder: 'public',
					// Options to `server-static` module
					options: {},
				},
			},

			methods: {},
			events: {
				...Events(broker),
			},
		});
	}
}
