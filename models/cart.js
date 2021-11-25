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
		Cart.belongsTo(models.product_details, {
			foreignKey: "product_detail_uuid",
			sourceKey: "uuid",
			as: "cart_product_detail"
		});
	};
	return Cart;
};
