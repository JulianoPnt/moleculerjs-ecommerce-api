"use strict";

const bcrypt = require("bcrypt");

module.exports = (sequelize, DataTypes) => {

	const User = sequelize.define("user", {
        uuid: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true
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
			allowNull: false,
		},
		status: {
			type: DataTypes.ENUM,
			values: ["active", "disabled"],
			allowNull: false,
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
		User.hasMany(models.order, {foreignKey: "user_uuid", sourceKey: "uuid", as: 'user_orders'});
	};

	return User;
};