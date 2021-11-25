"use strict";

module.exports = (sequelize, DataTypes) => {
	const ProductDetail = sequelize.define(
		"product_details",
		{
			uuid: {
				type: DataTypes.UUID,
				defaultValue: DataTypes.UUIDV4,
				primaryKey: true,
			},
			product_uuid: {
				type: DataTypes.UUID,
				allowNull: false,
			},
			size: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			color: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			image_url: {
				type: DataTypes.STRING,
				allowNull: true,
			},
		},
		{}
	);

	ProductDetail.associate = function (models) {
		ProductDetail.belongsTo(models.products, {
			foreignKey: "product_uuid",
			sourceKey: "uuid",
			as: "detail_product",
		});
		ProductDetail.belongsToMany(models.order, {
			through: models.order_products,
		});
		ProductDetail.hasMany(models.cart, {
			foreignKey: "product_detail_uuid",
			sourceKey: "uuid",
			as: "product_detail_cart",
		});
	};

	return ProductDetail;
};
