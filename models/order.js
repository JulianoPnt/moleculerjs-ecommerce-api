"use strict";

module.exports = (sequelize, DataTypes) => {
	const Order = sequelize.define("order", {
		uuid: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true,
		},
		user_uuid: {
			type: DataTypes.UUID,
			allowNull: false,
		},
		address_uuid: {
			type: DataTypes.UUID,
			allowNull: false,
		},
		total: {
			type: DataTypes.DECIMAL(10, 2),
			allowNull: false,
		},
		status: {
			type: DataTypes.ENUM,
			values: ["pending", "processed", "approved", "denied"],
			allowNull: false,
		},
	});

	Order.associate = function (models) {
		Order.hasOne(models.reviews, {
			foreignKey: "order_uuid",
			sourceKey: "uuid",
			as: "order_review",
		});
		Order.hasOne(models.address, {
			foreignKey: "address_uuid",
			sourceKey: "uuid",
			as: "order_address",
		});
		Order.belongsToMany(models.product_details, {
			through: models.order_products,
		});
	};

	return Order;
};
