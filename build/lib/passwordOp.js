"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isPasswordChanged = exports.comparePassword = exports.hashPassword = void 0;

var _bcryptjs = _interopRequireDefault(require("bcryptjs"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const SALT_HASH_KEY = 11;
/*
  hash password with bcrypt and salt before 
  saving it the database 
*/

const hashPassword = password => _bcryptjs.default.hash(password, SALT_HASH_KEY);
/*
  compare password when login between 
  the user given password and the already 
  saved password 
*/


exports.hashPassword = hashPassword;

const comparePassword = (password, dbPassword) => _bcryptjs.default.compare(password, dbPassword);

exports.comparePassword = comparePassword;

const isPasswordChanged = (jwtExpiresTime, passwordChangedAt) => passwordChangedAt > jwtExpiresTime;

exports.isPasswordChanged = isPasswordChanged;