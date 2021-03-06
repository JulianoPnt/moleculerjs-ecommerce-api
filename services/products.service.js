"use strict";

const Authorize = require("../mixins/authorize.mixin");

/**
 * products service
 */
module.exports = {
	name: "products",

	mixins: [Authorize],

	hooks: {
		before: {
			"*": ["checkIsAuthenticated"],
			list: ["checkUserRole"],
			add: ["checkUserRole"],
			update: ["checkUserRole"],
			remove: ["checkUserRole"],
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
				return await this.models.products.findAll({
					include: [
						{
							model: this.models.product_details,
						},
						{
							model: this.models.product_categories,
						},
						{ model: this.models.reviews },
						{ model: this.models.tag },
						{ model: this.models.brand },
					],
					attributes: {
						exclude: [],
					},
				});
			},
		},
		add: {
			cache: false,
			rest: {
				method: "POST",
				path: "/add",
			},
			role: "admin",
			params: {
				name: { type: "string" },
				description: { type: "string", optional: true },
				image_url: { type: "string", optional: true },
				price: { type: "number", positive: true, integer: false },
				product_category: {
					$$type: "object",
					name: { type: "string" },
					image_url: { type: "string", optional: true },
				},
				product_details: {
					$$type: "array",
					color: { type: "string" },
					size: { type: "string" },
					image_url: { type: "string", optional: true },
				},
				brand: {
					$$type: "object|optional",
					name: { type: "string" },
					image_url: { type: "string", optional: true },
				},
				tags: {
					$$type: "array|optional",
					name: { type: "string" },
				},
				$$strict: true,
			},
			async handler(ctx) {
				const product = await this.models.products.create(ctx.params, {
					include: [
						this.models.product_categories,
						this.models.product_details,
						this.models.brand,
						this.models.tag,
					],
				});
				await this.broker.cacher.clean("products.**");

				return {
					message: "Sucessfully added",
					product,
				};
			},
		},
		edit: {
			cache: false,
			rest: {
				method: "PUT",
				path: "/edit",
			},
			role: "admin",
			params: {
				uuid: { type: "string" },
				name: { type: "string", optional: true },
				description: { type: "string", optional: true },
				image_url: { type: "string", optional: true },
				active: { type: "boolean", optional: true },
				price: {
					type: "number",
					optional: true,
					positive: true,
					integer: false,
				},
				$$strict: true, // Prevent additional data than defined params
			},
			async handler(ctx) {
				const product = await this.models.products.update(ctx.params, {
					where: { uuid: ctx.params.uuid },
				});
				await this.broker.cacher.clean("products.**");

				return {
					message: "Successfully edited",
					product,
				};
			},
		},
		delete: {
			cache: false,
			rest: {
				method: "DELETE",
				path: "/delete",
			},
			role: "admin",
			params: {
				uuid: { type: "string" },
				$$strict: true, // Prevent additional data than defined params
			},
			async handler(ctx) {
				const product = await this.models.products.destroy({
					where: { uuid: ctx.params.uuid },
				});
				await this.broker.cacher.clean("products.**");

				return {
					message: "Removed successfully",
					product,
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
