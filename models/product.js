"use strict";

module.exports = (sequelize, DataTypes) => {
	const Product = sequelize.define(
		"products",
		{
			uuid: {
				type: DataTypes.UUID,
				defaultValue: DataTypes.UUIDV4,
				primaryKey: true,
			},
			category_uuid: {
				type: DataTypes.UUID,
				allowNull: false,
			},
			name: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			description: {
				type: DataTypes.STRING,
				allowNull: true,
			},
			image_url: {
				// Uploaded to s3 by front-end
				type: DataTypes.STRING,
				allowNull: true,
			},
			price: {
				type: DataTypes.DECIMAL(10, 2),
				allowNull: false,
			},
			active: {
				type: DataTypes.BOOLEAN,
				defaultValue: false,
			},
		},
		{}
	);

	Product.associate = function (models) {
		Product.hasMany(models.product_details, {
			foreignKey: "product_uuid",
			sourceKey: "uuid",
			as: "product_details",
		});
		Product.hasMany(models.tag, {
			foreignKey: "product_uuid",
			sourceKey: "uuid",
			as: "product_tags",
		});
		Product.hasOne(models.brand, {
			foreignKey: "product_uuid",
			sourceKey: "uuid",
			as: "product_brand",
		});
		Product.hasMany(models.reviews, {
			foreignKey: "product_uuid",
			sourceKey: "uuid",
			as: "product_reviews",
		});
		Product.belongsTo(models.product_categories, {
			foreignKey: "category_uuid",
			sourceKey: "uuid",
			as: "product_category",
		});
	};

	return Product;
};
