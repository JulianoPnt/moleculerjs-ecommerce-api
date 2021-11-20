"use strict";

const Authorize = require("../mixins/authorize.mixin");

const APPROVED_PAYMENT = {
	card_number: "123123123123",
	user_identity: "3912849291",
	validation_number: 321,
};

const PENDING_PAYMENT = {
	card_number: "2222222222222",
	user_identity: "3912849291",
	validation_number: 321,
};

const DENIED_PAYMENT = {
	card_number: "3333333333333",
	user_identity: "3912849291",
	validation_number: 321,
};

const APPROVED_INDEX = 0;
const PENDING_INDEX = 1;
const DENIED_INDEX = 2;

/**
 * order service
 */
module.exports = {
	name: "payments",

	mixins: [Authorize],

	hooks: {
		before: {
			"*": ["checkIsAuthenticated"],
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
		makePayment: {
			cache: false,
			rest: {
				method: "POST",
				path: "/add",
			},
			role: "user",
			params: {
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
				total: {
					type: "number",
					positive: true,
					integer: true,
				},
			},
			async handler(ctx) {
				if (ctx.params.payment.type == "card") {
					switch (ctx.params.payment.card_info.card_number) {
						case APPROVED_PAYMENT.card_number:
							return APPROVED_INDEX;
						case PENDING_PAYMENT.card_number:
							return PENDING_INDEX;
						case DENIED_PAYMENT.card_number:
							return DENIED_INDEX;
					}
				}

				throw new Error("Type not implemented");
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
