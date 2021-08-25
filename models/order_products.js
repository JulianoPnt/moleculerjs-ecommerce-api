"use strict";

module.exports = (sequelize, DataTypes) => {
	const Order_Products = sequelize.define(
		"order_products",
		{
			uuid: {
				type: DataTypes.UUID,
				defaultValue: DataTypes.UUIDV4,
				primaryKey: true,
			},
			order_uuid: {
				type: DataTypes.UUID,
				allowNull: false,
			},
			product_detail_uuid: {
				type: DataTypes.UUID,
				allowNull: false,
			},
			quantity: {
				type: DataTypes.INTEGER,
				allowNull: false,
			},
		},
		{ timestamps: false }
	);

	return Order_Products;
};
