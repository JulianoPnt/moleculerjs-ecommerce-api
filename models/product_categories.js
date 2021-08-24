"use strict";

module.exports = (sequelize, DataTypes) => {

	const ProductCategories = sequelize.define("product_categories", {
		uuid: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		image_url: {
			type: DataTypes.STRING,
			allowNull: true,
		},
	}, {

	});

	return ProductCategories;
};