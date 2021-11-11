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
				return await this.models.order.findAll({
					include: this.models.product_details,
				});
			},
		},
		add: {
			cache: false,
			rest: {
				method: "POST",
				path: "/add",
			},
			role: "user",
			params: {
				address: "uuid",
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
				const order = await this.models.order
					.create({
						address_uuid: ctx.params.address,
						user_uuid: ctx.meta.user.uuid,
						status: "processed",
					})
					.then(async (createdOrder) => {
						const association = ctx.params.product_details.map(
							(prodDetail) => {
								return {
									...prodDetail,
									uuid: undefined,
									order_uuid: createdOrder.uuid,
								};
							}
						);

						await this.models.order_products.bulkCreate(
							association
						);
					});
				await this.broker.cacher.clean("orders.**");

				return {
					message: "Sucessfully added",
					order,
				};
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
