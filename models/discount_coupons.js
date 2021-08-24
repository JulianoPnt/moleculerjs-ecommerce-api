"use strict";

module.exports = (sequelize, DataTypes) => {
	const DiscountCoupon = sequelize.define(
		"discount_coupon",
		{
			uuid: {
				type: DataTypes.UUID,
				defaultValue: DataTypes.UUIDV4,
				primaryKey: true,
			},
			identifier: {
				type: DataTypes.STRING,
				allowNull: false,
				unique: true,
			},
			quantity: {
				type: DataTypes.DOUBLE,
				allowNull: false,
			},
			valid_until: {
				type: DataTypes.DATE,
				allowNull: false,
			},
		},
		{}
	);

	return DiscountCoupon;
};
