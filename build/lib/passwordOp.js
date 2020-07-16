"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isPasswordChanged = exports.comparePassord = exports.hashPassword = void 0;

var _bcryptjs = _interopRequireDefault(require("bcryptjs"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const SALT_HASH_KEY = 11;

const hashPassword = password => _bcryptjs.default.hash(password, SALT_HASH_KEY);

exports.hashPassword = hashPassword;

const comparePassord = (password, dbPassword) => _bcryptjs.default.compare(password, dbPassword);

exports.comparePassord = comparePassord;

const isPasswordChanged = (jwtExpiresTime, passwordChangedAt) => passwordChangedAt > jwtExpiresTime;

exports.isPasswordChanged = isPasswordChanged;