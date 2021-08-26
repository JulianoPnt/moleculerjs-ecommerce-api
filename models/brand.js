"use strict";

module.exports = (sequelize, DataTypes) => {
	const Brand = sequelize.define(
		"brand",
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
			name: {
				type: DataTypes.STRING,
				allowNull: false,
			},
			image_url: {
				// sent by front-end
				type: DataTypes.STRING,
				allowNull: true,
			},
		},
		{}
	);

	return Brand;
};
