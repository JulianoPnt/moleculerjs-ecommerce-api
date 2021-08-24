"use strict";

const Authorize = require("../mixins/authorize.mixin");

/**
 * user service
 */
module.exports = {

	name: "users",

	mixins: [Authorize],

	hooks: {
		before: {
			"*": ["checkIsAuthenticated"],
			list: ["checkUserRole"],
			// update: ["checkUserRole", "checkOwner"],
			// remove: ["checkUserRole", "checkOwner"]
		}
	},

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
			cache: false, // Must be present only in dev
			rest: {
				method: "GET",
				path: "/list"
			},
			role: "admin",
			async handler(ctx) {
				return await this.models.user.findAll({
					include: {
						model: this.models.order, as: "user_orders",
					},
					attributes: {
						exclude: ["password"]
					}
				});
			}
		},
	},

	/**
	 * Methods
	 */
	methods: {

	},

	/**
	 * Events
	 */
	events: {

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
