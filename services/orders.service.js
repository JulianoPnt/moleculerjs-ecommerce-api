"use strict";

const Authorize = require("../mixins/authorize.mixin");

/**
 * order service
 */
module.exports = {
	name: "orders",

	mixins: [Authorize],

	hooks: {
		before: {
			"*": ["checkIsAuthenticated"],
			list: ["checkUserRole"],
			add: ["checkUserRole"],
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
				path: "/list",
			},
			role: "user",
			async handler() {
				return await this.models.order.findAll();
			},
		},
		// add: {
		// 	cache: false,
		// 	rest: {
		// 		method: "POST",
		// 		path: "/add",
		// 	},
		// 	role: "user",
		// 	params: {
		// 		address: "uuid",
		// 		product_details: { $$type: "array", items: "uuid" },
		// 	},
		// 	async handler(ctx) {
		// 		const order = await this.models.order.create(
		// 			{
		// 				...ctx.params,
		// 				address_uuid: ctx.params.address,
		// 				user_uuid: ctx.meta.user.uuid,
		// 				status: "pending",
		// 			},
		// 			{
		// 				include: [this.models.product_details],
		// 			}
		// 		);
		// 		await this.broker.cacher.clean("orders.**");

		// 		return {
		// 			message: "Sucessfully added",
		// 			order,
		// 		};
		// 	},
		// },
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
