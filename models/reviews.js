"use strict";

module.exports = (sequelize, DataTypes) => {

	const Review = sequelize.define("reviews", {
        uuid: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true
		},
        product_uuid: {
			type: DataTypes.UUID,
            allowNull: false,
        },
        order_uuid: {
			type: DataTypes.UUID,
            allowNull: false,
        },
        comment: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        rating: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
	}, {

	});

	return Review;
};