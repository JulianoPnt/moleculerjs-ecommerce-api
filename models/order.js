"use strict";

module.exports = (sequelize, DataTypes) => {

	const Order = sequelize.define("order", {
        uuid: {
			type: DataTypes.UUID,
			primaryKey: true,
			default: sequelize.UUIDV4,
		},
        user_uuid: {
			type: DataTypes.UUID,
        },
		status: {
			type: DataTypes.ENUM,
			values: ["pending", "processed"]
		},
	}, {

	});

	return Order;
};