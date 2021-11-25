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
			"*": ["checkIsAuthenticated", "checkUserRole"],
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
			async handler(ctx) {
				return await this.models.cart.findAll({
					include: [
						{ model: this.models.product_details, as: "cart_product_detail" },
					],
					where: { user_uuid: ctx.meta.user.uuid },
				});
			},
		},
		addItem: {
			cache: false,
			rest: {
				method: "POST",
				path: "/add",
			},
			role: "user",
			params: {
				product_details: {
					$$type: "array",
					items: {
						type: "object",
						product_detail_uuid: "uuid",
						quantity: {
							type: "number",
							positive: true,
							integer: true,
						},
					},
				},
			},
			async handler(ctx) {
				const mappedObject = ctx.params.product_details.map(
					(prodDet) => {
						return {
							...prodDet,
							user_uuid: ctx.meta.user.uuid
						};
					},
				);
				return await this.models.cart.bulkCreate([...mappedObject]);
			},
		},
		// @TODO All below this
		editItem: {
			cache: false,
			rest: {
				method: "PUT",
				path: "/edit",
			},
			role: "user",
			async handler(ctx) {
				return {};
			},
		},
		removeItem: {
			cache: false,
			rest: {
				method: "DELETE",
				path: "/remove",
			},
			role: "user",
			async handler(ctx) {
				return {};
			},
		},
		createOrder: {
			cache: false,
			rest: {
				method: "POST",
				path: "/createOrder"
			},
			role: "user",
			async handler(ctx) {
				return {};
			}
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
