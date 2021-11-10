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
			addAddress: ["checkUserRole"],
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
			cache: false, // Must be present only in dev
			rest: {
				method: "GET",
				path: "/list",
			},
			role: "admin",
			async handler(ctx) {
				return await this.models.user.findAll({
					include: [
						{
							model: this.models.order,
							as: "user_orders",
						},
						{ model: this.models.address, as: "user_addresses" },
					],
					attributes: {
						exclude: ["password"],
					},
				});
			},
		},
		addAddress: {
			cache: false, // Must be present only in dev
			rest: {
				method: "GET",
				path: "/addAddress",
			},
			role: "user",
			params: {
				address: {
					$$type: "object",
					district: "string",
					street: "string",
					post_code: "string",
					number: { type: "number", positive: true, integer: true },
				},
				$$strict: true,
			},
			async handler(ctx) {
				return this.models.address.create({
					...ctx.params.address,
					user_uuid: ctx.meta.user.uuid,
				});
			},
		},
	},

	/**
	 * Methods
	 */
	methods: {},

	/**
	 * Events
	 */
	events: {},

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
