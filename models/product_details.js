"use strict";

module.exports = (sequelize, DataTypes) => {

	const ProductDetail = sequelize.define("product_details", {
		uuid: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true
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
		}
	}, {

	});

	return ProductDetail;
};