"use strict";

module.exports = (sequelize, DataTypes) => {

	const Order = sequelize.define("order", {
        uuid: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true
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