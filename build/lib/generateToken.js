"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.refreshToken = exports.jwtVerifyToken = exports.createTokens = exports.createToken = void 0;

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _util = require("util");

var _lodash = _interopRequireDefault(require("lodash"));

var _services = require("../services");

var _models = _interopRequireDefault(require("../models"));

var _catchAsync = _interopRequireDefault(require("../lib/catchAsync"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const {
  Account
} = _models.default;

const createToken = (payload, secretKey, expiresIn) => _jsonwebtoken.default.sign(payload, secretKey, {
  expiresIn,
  audience: process.env.JWT_AUDIENCE,
  issuer: process.env.JWT_ISSUER
});

exports.createToken = createToken;

const createTokens = (payload, refreshSecret) => {
  const token = createToken(payload, process.env.JWT_SECRET_KEY, `${process.env.JWT_ACCESS_TOKEN_EXPIRES}`);
  const refreshToken = createToken(payload, refreshSecret, `${process.env.JWT_REFRESH_TOKEN_EXPIRES}`);
  return [token, refreshToken];
};

exports.createTokens = createTokens;

const jwtVerifyToken = token => _jsonwebtoken.default.verify(token, process.env.JWT_SECRET_KEY);

exports.jwtVerifyToken = jwtVerifyToken;

const refreshToken = async (__rt, next) => {
  const decoded = _jsonwebtoken.default.decode(__rt);

  if (!decoded.id) {
    return next(new _catchAsync.default("unAuthorize, please login", 401));
  }

  const freshUser = await (0, _services.findByPk)(Account, decoded.id);

  if (!freshUser) {
    return next(new _catchAsync.default("user does not exist", 401));
  }

  const refreshSecret = process.env.JWT_REFRESH_KEY + freshUser.toJSON().password;

  try {
    await (0, _util.promisify)(_jsonwebtoken.default.verify)(__rt, refreshSecret);
  } catch (err) {
    return next(new _catchAsync.default("you are not logged in from refreshtoken", 401));
  }

  const [token, refreshToken] = createTokens(_lodash.default.pick(freshUser.toJSON(), ["id", "verified", "blocked", "role"]), refreshSecret);

  if (token && refreshToken) {
    return {
      accessToken: token,
      newRefreshToken: refreshToken
    };
  }
};

exports.refreshToken = refreshToken;