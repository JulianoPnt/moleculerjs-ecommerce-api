"use strict";

const Authorize = require("../mixins/authorize.mixin");
const ProductsCalculation = require("../mixins/calculation.mixin");

/**
 * order service
 */
module.exports = {
	name: "orders",

	mixins: [Authorize, ProductsCalculation],

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
			async handler(ctx) {
				return await this.models.order.findAll({
					include: [
						{
							model: this.models.product_details,
							include: [
								{
									model: this.models.products,
									as: "detail_product",
								},
							],
						},
					],
					where: { user_uuid: ctx.meta.user.uuid },
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
				const productsDetailsIds = ctx.params.product_details.map(
					(prodDet) => prodDet.product_detail_uuid
				);

				const total = this.getTotalFromDetails(ctx, productsDetailsIds);
				const order = await this.models.order
					.create({
						address_uuid: ctx.params.address,
						user_uuid: ctx.meta.user.uuid,
						status: "pending",
						total,
					})
					.then(async (createdOrder) => {
						const association = ctx.params.product_details.map(
							(prodDetail) => {
								return {
									...prodDetail,
									order_uuid: createdOrder.uuid,
								};
							}
						);

						await this.models.order_products.bulkCreate(
							association
						);
					});

				const payment = await this.broker.call(
					"payments.makePayment",
					ctx.params.payment
				);

				return payment;
				// await this.broker.cacher.clean("orders.**");

				// return {
				// 	message: "Sucessfully added",
				// 	order,
				// };
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
