"use strict";

const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
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
				path: "/register"
			},
			params: {
				email: { type: "email" },
				password: { type: "string", min: 8 }
			},
			async handler(ctx) {
				const user =  await this.models.user.create({ 
					email: ctx.params.email,
					password: ctx.params.password,
					role: "user",
					status: "active",
				});
				await this.broker.cacher.clean("users.**");
				return {
					"message": "Sucessfully registered",
					user
				};
			}
		},

		login: {
			cache: false,
			rest: {
				method: "POST",
				path: "/login"
			},
			params: {
				email: { type: "email" },
				password: { type: "string" }
			},
			async handler(ctx) {
				return await this.models.user
					.findOne({ 
						where: { 
							email: ctx.params.email,
							status: 'active'
						} 
					})
					.then(async (user) => {
						if (await bcrypt.compare(ctx.params.password, user.password)) {
							let generatedToken = jwt.sign({...user.dataValues}, process.env.JWT_SECRET, {
								expiresIn: "7 days"
							});

							user.password = undefined;

							return {
								"message": "Successfully authenticated!",
								user,
								"bearer_token": generatedToken,
							};
						}
						
						throw new Errors.UnAuthorizedError;
					})
					.catch(err => {
						return { 
							"message": "Failed to authenticate. Please check your e-mail and password!",
						};
					});
			}
		},

		resolveToken: {
			cache: false,
			rest: {
				method: "POST",
				path: "/resolveToken"
			},
			params: {
				token: { type: "string" }
			},
			async handler(ctx) {
				try {
					return jwt.verify(ctx.params.token , process.env.JWT_SECRET);
				} catch(err) {
					throw new Errors.UnAuthorizedError
				}
			}
		},

	},

	/**
	 * Events
	 */
	events: {

	},

	/**
	 * Methods
	 */
	methods: {

	},

	/**
	 * Service created lifecycle event handler
	 */
	created() {

	},

	/**
	 * Service started lifecycle event handler
	 */
	async started() {

	},

	/**
	 * Service stopped lifecycle event handler
	 */
	async stopped() {

	}
};
