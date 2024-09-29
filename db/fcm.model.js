const Sequelize = require("sequelize");
const dbConfig = require("./db.config");

const sequelize = new Sequelize(
  dbConfig.DB,
  dbConfig.USERNAME,
  dbConfig.PASSWORD,
  {
    dialect: dbConfig.DIALECT,
    host: dbConfig.HOST,
    port: dbConfig.PORT,
  }
);

const Fcm = sequelize.define(
  "Fcm",
  {
    identifier: Sequelize.STRING,
    deliverAt: Sequelize.STRING,
  },
  { tableName: "fcm_job" }
);

Fcm.sync({ alter: true });

module.exports = Fcm;
