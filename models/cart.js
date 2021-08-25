"use strict";

module.exports = (sequelize, DataTypes) => {
	const Cart = sequelize.define("cart", {
		uuid: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true,
		},
		user_uuid: {
			type: DataTypes.UUID,
			allowNull: false,
		},
		product_uuid: {
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
	});

	Cart.associate = function (models) {
		Cart.belongsTo(models.user, {
			foreignKey: "uuid",
			sourceKey: "user_uuid",
			as: "cart_user",
		});
		Cart.belongsTo(models.products, {
			foreignKey: "uuid",
			sourceKey: "product_uuid",
			as: "cart_product",
		});
		Cart.belongsTo(models.product_details, {
			foreignKey: "uuid",
			sourceKey: "product_detail_uuid",
			as: "cart_product_detail",
		});
	};
	return Cart;
};
