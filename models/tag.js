"use strict";

module.exports = (sequelize, DataTypes) => {
	const Tag = sequelize.define(
		"tag",
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
		},
		{}
	);

	return Tag;
};
