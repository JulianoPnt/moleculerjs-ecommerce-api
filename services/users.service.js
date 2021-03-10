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
            // update: ["checkUserRole", "checkOwner"],
            // remove: ["checkUserRole", "checkOwner"]
        }
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
				path: "/list"
			},
			role: 'user',
			async handler(ctx) {
				return await this.models.user.findAll({
					include: {
						model: this.models.order, as: 'user_orders',
					},
					attributes: {
						exclude: ['password']
					}
				});
			}
		},
	},

	/**
	 * Methods
	 */
	methods: {
		checkIsAuthenticated(ctx) {
            if (!ctx.meta.user)
                throw new Error("Unauthenticated");
        },
		checkUserRole(ctx) {
            if (ctx.action.role && ctx.meta.user.role != ctx.action.role)
                throw new Error("Forbidden");
        },
	},

	/**
	 * Events
	 */
	events: {

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
