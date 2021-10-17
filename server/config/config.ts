require('dotenv').config() // TODO remove
module.exports = {
  DB_URL: process.env.DATABASE_URL,
  dialect: "postgres",
};
