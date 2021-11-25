"use strict";

const bcrypt = require("bcrypt");

module.exports = (sequelize, DataTypes) => {

	const User = sequelize.define("user", {
		uuid: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true
		},
		first_name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		last_name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		email: {
			type: DataTypes.STRING,
			unique: true,
			allowNull: false,
		},
		password: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		role: {
			type: DataTypes.ENUM,
			values: ["user", "admin"],
			defaultValue: "user",
		},
		birth: {
			type: DataTypes.DATEONLY,
			allowNull: true,
		},
		active: {
			type: DataTypes.BOOLEAN,
			defaultValue: false,
		},
	}, {
		hooks: {
			beforeCreate: (user) => {
				const salt = bcrypt.genSaltSync(8);
				user.password = bcrypt.hashSync(user.password, salt);
			}
		},
	});

	User.associate = function (models) {
		User.hasMany(models.order, {foreignKey: "user_uuid", sourceKey: "uuid", as: "user_orders"});
		User.hasMany(models.cart, {foreignKey: "user_uuid", sourceKey: "uuid", as: "user_cart"});
		User.hasMany(models.address, {foreignKey: "user_uuid", sourceKey: "uuid", as: "user_addresses"});
	};

	return User;
};