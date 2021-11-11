"use strict";

const Authorize = require("../mixins/authorize.mixin");

/**
 * order service
 */
module.exports = {
	name: "cart",

	mixins: [Authorize],

	hooks: {
		before: {
			"*": ["checkIsAuthenticated"],
			view: ["checkIsAuthenticated"],
		},
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
			cache: false,
			rest: {
				method: "GET",
				path: "/view",
			},
			role: "user",
			async handler(ctx) {
				return {};
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
