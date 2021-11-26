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
		editItem: {
			cache: false,
			rest: {
				method: "PUT",
				path: "/edit",
			},
			role: "user",
			params: {
				uuid: "uuid",
				quantity: {
					type: "number",
					positive: true,
					integer: true,
				},
			},
			async handler(ctx) {
				if (ctx.params.quantity < 1) {
					throw new Error("Invalid method use DELETE");
				}

				return this.models.cart.update(
					{ quantity: ctx.params.quantity },
					{
						where: { uuid: ctx.params.uuid }
					}
				);
			},
		},
		removeItem: {
			cache: false,
			rest: {
				method: "DELETE",
				path: "/remove",
			},
			role: "user",
			params: {
				uuids: {
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
				}
			},
			async handler(ctx) {
				return this.models.cart.destroy({ where: { uuid: ctx.params.uuids }});
			},
		},
		createOrder: {
			cache: false,
			rest: {
				method: "POST",
				path: "/createOrder"
			},
			role: "user",
			params: {
				address: "uuid",
				payment: {
					$$type: "object",
					type: { type: "string" },
					card_info: {
						$$type: "object|optional",
						card_number: "string",
						user_identity: "string", // CPF
						validation_number: "string",
						installments: {
							type: "number",
							positive: true,
							integer: true,
							min: 1,
							max: 12,
						},
					},
				},
			},
			async handler(ctx) {
				const cart = await this.models.cart.findAll({
					where: {
						user_uuid: ctx.meta.user.uuid
					}
				});

				const productDetails = cart.map(c => {
					return {
						product_detail_uuid: c.product_detail_uuid,
						quantity: c.quantity,
					};
				});

				return await this.broker.call(
					"orders.add",
					{ ...ctx.params, product_details: productDetails },
					{ meta: ctx.meta }
				);
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
