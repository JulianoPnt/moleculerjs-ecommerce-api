"use strict";

module.exports = (sequelize, DataTypes) => {
	const Address = sequelize.define("address", {
		uuid: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true,
		},
		user_uuid: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
		},
		district: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		street: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		post_code: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		number: {
			type: DataTypes.INTEGER,
			allowNull: false,
		},
	});

	Address.associate = function (models) {
		Address.belongsTo(models.user, {
			foreignKey: "uuid",
			sourceKey: "user_uuid",
			as: "address_user",
		});
		Address.belongsTo(models.order, {
			foreignKey: "address_uuid",
			sourceKey: "uuid",
			as: "address_order",
		});
	};

	return Address;
};
