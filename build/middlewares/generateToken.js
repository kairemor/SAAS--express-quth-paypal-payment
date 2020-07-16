"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.refreshToken = exports.createTokens = exports.createToken = void 0;

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _lodash = _interopRequireDefault(require("lodash"));

var _globalError = _interopRequireDefault(require("../lib/globalError"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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

const refreshToken = async (__rt, next) => {
  const decoded = _jsonwebtoken.default.decode(__rt);

  if (!decoded.id) {
    return next(new _globalError.default("unAuthorize, please login", 401));
  }

  const freshUser = await findByPk(Account, decoded.id);
  console.log(freshUser);

  if (!freshUser) {
    return next(new _globalError.default("user does not exist", 401));
  } // eslint-disable-next-line operator-linebreak


  const refreshSecret = process.env.JWT_REFRESH_KEY + freshUser.toJSON().password;

  try {
    await promisify(_jsonwebtoken.default.verify)(__crt, refreshSecret);
  } catch (err) {
    return next(new _globalError.default("you are not logged in from refreshtoken", 401));
  }

  const [accessToken, newRefreshToken] = createTokens(_lodash.default.pick(freshUser.toJSON(), ["id", "verified", "blocked", "role"]), refreshSecret);

  if (accessToken && newRefreshToken) {
    return {
      accessToken,
      newRefreshToken
    };
  }
};

exports.refreshToken = refreshToken;