"use strict";

/**
 * user service
 */
module.exports = {

	name: "users",

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
		list: {
			cache: true,
			rest: {
				method: "GET",
				path: "/list"
			},
			async handler() {
				return await this.models.user.findAll({
					include: {
						model: this.models.order, as: 'user_orders'
					}	
				});
			}
		},

		create: {
			cache: false,
			rest: {
				method: "POST",
				path: "/create"
			},
			async handler(ctx) {
				const user =  await this.models.user.create({ 
					email: ctx.params.email,
					username: ctx.params.username,
					password: ctx.params.password,
					role: "user",
					status: "active",
				});
				await this.broker.cacher.clean("users.**");
				return user;
			}
		}
	},

	/**
	 * Events
	 */
	events: {
		async "some.thing"(ctx) {
			this.logger.info("Something happened", ctx.params);
		}
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
