"use strict";

const Authorize = require("../mixins/authorize.mixin");
const ProductsCalculation = require("../mixins/calculation.mixin");

const APPROVED_INDEX = 0;
const PENDING_INDEX = 1;
const DENIED_INDEX = 2;

const APPROVED_STATUS = "approved";

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
			addReview: ["checkUserRole"],
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
				let orderId;
				const productsDetailsIds = ctx.params.product_details.map(
					(prodDet) => prodDet.product_detail_uuid
				);

				const total = await this.getTotalFromDetails(ctx, productsDetailsIds).then(total => Number(total[0].totalPrice));
				await this.models.order
					.create({
						address_uuid: ctx.params.address,
						user_uuid: ctx.meta.user.uuid,
						status: "pending",
						total,
					})
					.then(async (createdOrder) => {
						orderId = createdOrder.uuid;
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


				// for testing purposes
				// 123123123123 - approved
				// 3333333333333 - denied
				// all others - pending
				const payment = await this.broker.call(
					"payments.makePayment",
					{ payment: ctx.params.payment, total },
					{ meta: ctx.meta }
				);
				switch (payment) {
					case APPROVED_INDEX:
						await this.models.order.update({status: "approved"}, { where: { uuid: orderId } });
						break;
					case PENDING_INDEX:
						await this.models.order.update({status: "pending"}, { where: { uuid: orderId } });
						break;
					case DENIED_INDEX:
						await this.models.order.update({status: "denied"}, { where: { uuid: orderId } });
						break;
				}

				const order = await this.models.order.findOne({
					where: {
						uuid: orderId,
					},
				});

				await this.broker.cacher.clean("orders.**");
				return {
					message: "Sucessfully added",
					order
				};
			},
		},
		addReview: {
			cache: false,
			rest: {
				method: "GET",
				path: "/addReview",
			},
			role: "user",
			params: {
				order_uuid: "uuid",
				comment: "string|optional",
				rating: {
					type: "number",
					positive: true,
					integer: true,
					min: 1,
					max: 5,
				},
			},
			async handler(ctx) {
				const order = await this.models.order.findOne({
					where: {
						uuid: ctx.params.order_uuid,
					},
				});

				if (!order) {
					throw new Error("Not Found");
				}

				if (order.user_uuid != ctx.meta.user.uuid) {
					throw new Error("Unauthorized");
				}

				if (order.status !== APPROVED_STATUS) {
					throw new Error("Order still in progress");
				}

				return await this.models.reviews.create(ctx.params);
			},
		}
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
