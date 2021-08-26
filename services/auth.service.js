"use strict";

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Errors } = require("moleculer-web");

/**
 * auth service
 */
module.exports = {
	name: "auth",

	/**
	 * Service settings
	 */
	settings: {},

	/**
	 * Service metadata
	 */
	metadata: {},

	/**
	 * Service dependencies
	 */
	dependencies: [],

	/**
	 * Actions
	 */
	actions: {
		register: {
			cache: false,
			rest: {
				method: "POST",
				path: "/register",
			},
			params: {
				first_name: { type: "string" },
				last_name: { type: "string" },
				email: { type: "email" },
				birth: { type: "date", optional: true },
				password: { type: "string", min: 8 },
			},
			async handler(ctx) {
				const user = await this.models.user.create({
					first_name: ctx.params.first_name,
					last_name: ctx.params.last_name,
					email: ctx.params.email,
					password: ctx.params.password,
					birth: ctx.params.birth,
					active: true, // Remove when validate mail is ready
				});
				await this.broker.cacher.clean("users.**");

				user.password = undefined;

				return {
					message: "Sucessfully registered",
					user,
				};
			},
		},

		login: {
			cache: false,
			rest: {
				method: "POST",
				path: "/login",
			},
			params: {
				email: { type: "email" },
				password: { type: "string" },
			},
			async handler(ctx) {
				return await this.models.user
					.findOne({
						where: {
							email: ctx.params.email,
							active: true,
						},
					})
					.then(async (user) => {
						if (
							await bcrypt.compare(
								ctx.params.password,
								user.password
							)
						) {
							let generatedToken = jwt.sign(
								{ ...user.dataValues },
								process.env.JWT_SECRET,
								{
									expiresIn: "7 days",
								}
							);

							user.password = undefined;

							return {
								message: "Successfully authenticated!",
								user,
								bearer_token: generatedToken,
							};
						}

						throw new Errors.ForbiddenError();
					})
					.catch((err) => {
						throw new Errors.ForbiddenError();
					});
			},
		},

		checkToken: {
			cache: false,
			rest: {
				method: "POST",
				path: "/checkToken",
			},
			params: {
				token: { type: "string" },
			},
			async handler(ctx) {
				try {
					if (jwt.verify(ctx.params.token, process.env.JWT_SECRET)) {
						return ctx.params.token;
					}

					throw new Errors.ForbiddenError();
				} catch (err) {
					throw new Errors.ForbiddenError();
				}
			},
		},

		resolveToken: {
			cache: false,
			rest: {
				method: "POST",
				path: "/resolveToken",
			},
			params: {
				token: { type: "string" },
				key: { type: "string" },
			},
			async handler(ctx) {
				try {
					return jwt.verify(ctx.params.token, ctx.params.key);
				} catch (err) {
					throw new Errors.UnAuthorizedError();
				}
			},
		},
	},

	/**
	 * Events
	 */
	events: {},

	/**
	 * Methods
	 */
	methods: {},

	/**
	 * Service created lifecycle event handler
	 */
	created() {},

	/**
	 * Service started lifecycle event handler
	 */
	async started() {},

	/**
	 * Service stopped lifecycle event handler
	 */
	async stopped() {},
};
