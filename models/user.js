"use strict";

module.exports = (sequelize, DataTypes) => {

	const User = sequelize.define("user", {
        uuid: {
			type: DataTypes.UUID,
			primaryKey: true
		},
		email: {
			type: DataTypes.STRING,
			unique: true
		},
        username: {
			type: DataTypes.STRING,
			unique: true
		},
		password: DataTypes.STRING,
		role: {
			type: DataTypes.ENUM,
			values: ["user", "admin"]
		},
		settings: DataTypes.JSONB,
		status: DataTypes.INTEGER,
		activation_code: DataTypes.STRING,
		passwordRecoveryToken: DataTypes.STRING,
		secret2fa: DataTypes.STRING,
		referer: DataTypes.UUID,
		registration_date: DataTypes.DATE,
		last_login_date:  DataTypes.DATE
	}, {

	});

	// User.associate = function (models) {
	// 	User.hasMany(models.worker, {foreignKey: "username", sourceKey: "username"});
	// };

	return User;
};