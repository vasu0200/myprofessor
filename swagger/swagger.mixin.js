'use strict';
const _ = require('lodash');
const fs = require('fs');
const { MoleculerServerError } = require('moleculer').Errors;
const SwaggerUI = require('./swagger.ui');
const SwaggerJson = require('./swagger.config.json');

module.exports = function (mixinOptions) {
	mixinOptions = _.defaultsDeep(mixinOptions, {
		routeOptions: {
			path: '/swagger',
		},
		schema: null,
		schemes: ['http', 'https'], // supported api schemes
		consumes: ['application/json'],
		produces: ['application/json'],
	});

	let shouldUpdateSchema = true;
	let schema = null;

	return {
		events: {
			'$services.changed': {
				tracing: false,
				handler() {
					this.invalidateOpenApiSchema();
				},
			},
		},

		methods: {
			// Invalidate the generated Swagger schema
			invalidateOpenApiSchema() {
				shouldUpdateSchema = true;
			},

			// Generate Swagger Schema
			generateOpenAPISchema() {
				try {
					const res = _.defaultsDeep(mixinOptions.schema, SwaggerJson);

					const services = this.broker.registry.getServiceList({ withActions: true });
					services.forEach((service) => {
						// --- COMPILE SERVICE-LEVEL DEFINITIONS ---
						if (service.settings.openapi) {
							_.merge(res, service.settings.openapi);
						}

						// --- COMPILE ACTION-LEVEL DEFINITIONS ---
						_.forIn(service.actions, (action) => {
							if (_.isObject(action.openapi)) {
								let def = _.cloneDeep(action.openapi);
								if (def.$path) {
									let { method, path } = def.$path;
									delete def.$path;
									_.set(res.paths, [path, method.toLowerCase()], def);
								}
							}
						});
					});

					return res;
				} catch (err) {
					throw new MoleculerServerError('Unable to compile OpenAPI schema', 500, 'UNABLE_COMPILE_OPENAPI_SCHEMA', { err });
				}
			},

			getOpenAPISchema() {
				if (shouldUpdateSchema || !schema) {
					// Create new server & regenerate GraphQL schema
					this.logger.info('♻ Regenerate Swagger schema...');

					schema = this.generateOpenAPISchema();

					shouldUpdateSchema = false;

					this.logger.debug(schema);

					// if (process.env.NODE_ENV != 'production') {
					// 	fs.writeFileSync('./openapi.json', JSON.stringify(schema, null, 4), 'utf8');
					// }

					return schema;
				}
			},
		},

		created() {
			const route = _.defaultsDeep(mixinOptions.routeOptions, {
				use: [
					(req, res, next) => {
						res.set = (key, value) => res.setHeader(key, value);
						res.send = (content) =>
							this.sendResponse(req, res, content, {
								responseType: res.getHeader('Content-Type') || 'text/html',
							});

						req.swaggerDoc = this.getOpenAPISchema();

						next();
					},
					...SwaggerUI.serve,
					SwaggerUI.setup(),
				],

				aliases: {
					'GET /openapi.json'(req, res) {
						// Send back the generated schema
						try {
							const schema = this.getOpenAPISchema();

							const ctx = req.$ctx;
							ctx.meta.responseType = 'application/json';

							return this.sendResponse(req, res, schema);
						} catch (err) {
							this.logger.warn(err);
							this.sendError(req, res, err);
						}
					},
				},

				mappingPolicy: 'restrict',
			});

			// Add route
			this.settings.routes.unshift(route);
		},

		started() {
			this.logger.info(`📜 Swagger Documentation is available at localhost:3000${mixinOptions.routeOptions.path}`);
		},
	};
};
