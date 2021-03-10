"use strict";

const ApiGateway = require("moleculer-web");

/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 * @typedef {import('http').IncomingMessage} IncomingRequest Incoming HTTP Request
 * @typedef {import('http').ServerResponse} ServerResponse HTTP Server Response
 */

module.exports = {
	name: "api",
	mixins: [ApiGateway],

	// More info about settings: https://moleculer.services/docs/0.14/moleculer-web.html
	settings: {
		// Exposed port
		port: process.env.PORT || 3000,

		// Exposed IP
		ip: "0.0.0.0",

		// Global Express middlewares. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Middlewares
		use: [],

		routes: [
			{
				path: "/api",
				whitelist: [
					"auth.register",
					"auth.login",
					"users.*",
				],
				http2: true,
				// HTTPS server with certificate ## MUST BE CONFIGURED IN PRODUCTION
				// https: {
				// 	key: fs.readFileSync(path.join(__dirname, "../ssl/key.pem")),
				// 	cert: fs.readFileSync(path.join(__dirname, "../ssl/cert.pem"))
				// },
				cors: {
					origin: "*",
					methods: ["GET", "OPTIONS", "POST", "PUT", "DELETE"],
					allowedHeaders: "*",
					//exposedHeaders: "*",
					credentials: true,
					maxAge: null
				},
				rateLimit: {
					window: 10 * 1000,
					limit: 10,
					headers: true
				},
				mergeParams: true,
				authentication: true,
				autoAliases: true,
				use: [],

				onBeforeCall(ctx, route, req, res) {
					// Set request headers to context meta
					ctx.meta.userAgent = req.headers["user-agent"];
				}, 

				bodyParsers: {
					json: {
						strict: false,
						limit: "1MB"
					},
					urlencoded: {
						extended: true,
						limit: "1MB"
					}
				},

				// Mapping policy setting. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Mapping-policy
				mappingPolicy: "all",
				logging: true,
				optimizeOrder: true,
			},
		],

		// Do not log client side errors (does not log an error response when the error.code is 400<=X<500)
		log4XXResponses: false,
		// Logging the request parameters. Set to any log level to enable it. E.g. "info"
		logRequestParams: null,
		// Logging the response data. Set to any log level to enable it. E.g. "info"
		logResponseData: null,


		// Serve assets from "public" folder. More info: https://moleculer.services/docs/0.14/moleculer-web.html#Serve-static-files
		assets: {
			folder: "public",

			// Options to `server-static` module
			options: {}
		}
	},

	methods: {

		/**
		 * Authenticate the request. It check the `Authorization` token value in the request header.
		 * Check the token value & resolve the user by the token.
		 * The resolved user will be available in `ctx.meta.user`
		 *
		 * @param {Context} ctx
		 * @param {Object} route
		 * @param {IncomingRequest} req
		 * @returns {Promise}
		 */
		async authenticate(ctx, route, req) {
			// Read the token from header
			const auth = req.headers["authorization"];

			if (auth && auth.startsWith("Bearer")) {
				const token = auth.slice(7);

				const res = await ctx.broker.call('auth.resolveToken', {'token': token});
				if (res) {
					// Returns the resolved user. It will be set to the `ctx.meta.user`
					return res;
				} else {
					// Invalid token
					throw new ApiGateway.Errors.UnAuthorizedError(ApiGateway.Errors.ERR_INVALID_TOKEN);
				}

			} else {
				// No token. Throw an error or do nothing if anonymous access is allowed.
				// throw new ApiGateway.Errors.UnAuthorizedError(ApiGateway.Errors.ERR_NO_TOKEN)
				return null;
			}
		},

	}
};
