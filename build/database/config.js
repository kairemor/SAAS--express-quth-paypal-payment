"use strict";

var _dotenv = _interopRequireDefault(require("dotenv"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_dotenv.default.config();
/*
  Setting database configuration with 
  the database url for each environment
*/


module.exports = {
  development: {
    use_env_variable: true,
    url: process.env.DEV_DATABASE_URL,
    dialect: "postgres"
  },
  test: {
    use_env_variable: true,
    url: process.env.TEST_DATABASE_URL,
    dialect: "postgres"
  },
  production: {
    use_env_variable: true,
    url: process.env.PROD_DATABASE_URL,
    dialect: "postgres"
  }
};