"use strict";

const Authorize = require("../mixins/authorize.mixin");

/**
 * products service
 */
module.exports = {

	name: "products",

	mixins: [Authorize],

	// hooks: {
	//     before: {
	//     },
	// },
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
				path: "/list"
			},
			async handler(ctx) {
				return await this.models.products.findAll({
					include: [
						{ model: this.models.product_details, as: "product_details" },
						{ model: this.models.product_categories, as: "product_category" },
						{ model: this.models.reviews, as: "product_reviews" },
					],
					attributes: {
						exclude: []
					}
				});
			}
		},
	},

	/**
	 * Events
	 */
	events: {

	},

	/**
	 * Methods
	 */
	methods: {

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
