"use strict";

const Sequelize = require("sequelize");
const fs = require("fs");
const path = require("path");

module.exports = function SequelizeDbMiddleware(options = {}) {

	options = {
		dialect: "postgres",
		define: {
			timestamps: true
		},
		logging: process.env.LOGLEVEL === "debug",
		pool: {
			max: 5,
			min: 0,
			acquire: 60000,
			idle: 30000
		},
		...options
	};
	const databaseString = `postgres://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@${process.env.POSTGRES_HOST}:${process.env.POSTGRES_PORT}/${process.env.POSTGRES_DB}`
	const connection = new Sequelize(databaseString, options);
	const models = {};

	return {
		name: "Sequelize",

		created() {
			connection.sync().then(() => {
				this.logger.info("Sequelize middleware ready");
			})
			.catch(err => {
				this.logger.error('Unable to connect to the database:', err);
			});

			const dir = __dirname + "/../models";
			fs
				.readdirSync(dir)
				.filter(file => file.endsWith(".js"))
				.map(file => {
					const model = require(path.join(dir, file))(connection, Sequelize.DataTypes);
					models[model.name] = model;
					return model;
				}).forEach(model => {
					if ("associate" in model) model.associate(models);
				});
			this.logger.info("Sequelize all models loaded!");
		},

		async stopping () {
			if(connection) await connection.close();
		},

		serviceCreating(service, schema) {
			if(!schema.name.startsWith("$")) {
				service.Sequelize = connection;
				service.Sequelize.Op = Sequelize.Op;
				service.models = models;
			}
		}
	};
};