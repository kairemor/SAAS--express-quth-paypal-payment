"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.jwtProtect = void 0;

var _globalError = _interopRequireDefault(require("../lib/globalError"));

var _generateToken = require("../lib/generateToken");

var _passwordOp = require("../lib/passwordOp");

var _catchAsync = _interopRequireDefault(require("../lib/catchAsync"));

var _models = _interopRequireDefault(require("../models"));

var _index = require("../services/index");

var _createCookie = require("../lib/createCookie");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const {
  Account
} = _models.default;
const jwtProtect = (0, _catchAsync.default)(async (req, res, next) => {
  const token = req.cookies.__act;

  if (!token) {
    return next(new _globalError.default("You are not logged in", 401));
  }

  try {
    const decoded = await (0, _generateToken.jwtVerifyToken)(token);

    if (decoded.blocked) {
      return next(new _globalError.default("Your account has been blocked, contact system administrator ", 401));
    }

    const freshUser = await (0, _index.findByPk)(Account, decoded.id);

    if (!freshUser) {
      return next(new _globalError.default("user from does not exist", 401));
    }

    const passwordChangeAt = Math.round(new Date(`${freshUser.toJSON().changedPassword}`).getTime() / 1000);

    if ((0, _passwordOp.isPasswordChanged)(decoded.iat, passwordChangeAt)) {
      return next(new _globalError.default("You are not logged in, please login with correct details", 401));
    }

    req.user = freshUser.toJSON();
    next();
  } catch (err) {
    console.log(err.stack);
    const {
      __rt
    } = req.cookies;
    const {
      accessToken,
      newRefreshToken
    } = await (0, _generateToken.refreshToken)(__rt, next);

    if (accessToken && newRefreshToken) {
      (0, _createCookie.createCookie)(res, accessToken, "__act", process.env.ACCESS_TOKEN_COOKIE_EXPIRES);
      (0, _createCookie.createCookie)(res, newRefreshToken, "__rt", process.env.REFRESH_TOKEN_COOKIE_EXPIRES);
      next();
    }
  }
});
exports.jwtProtect = jwtProtect;