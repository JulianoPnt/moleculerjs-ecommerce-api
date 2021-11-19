"use strict";
const Sequelize = require("sequelize");

module.exports = {
	methods: {
		async getTotalFromDetails(ctx, detailsIds) {
			return await this.models.product_details.findAll({
				raw: true,
				attributes: [
					[Sequelize.fn("SUM", Sequelize.col("price")), "totalPrice"],
				],
				include: [
					{ model: this.models.products, as: "detail_product" },
				],
				where: { uuid: { [Sequelize.Op.in]: detailsIds } },
				group: "detail_product.uuid",
			});
		},
	},
};
