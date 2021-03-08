"use strict";

module.exports = (sequelize, DataTypes) => {

	const Order = sequelize.define("order", {
        uuid: {
			type: DataTypes.UUID,
			primaryKey: true
		},
        user_uuid: {
			type: DataTypes.UUID,
        },
		status: {
			type: DataTypes.ENUM,
			values: ["pending", "processed"]
		},
		created_at: DataTypes.DATE,
	}, {

	});

	return Order;
};