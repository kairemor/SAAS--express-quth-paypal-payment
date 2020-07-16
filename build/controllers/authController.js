"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.signinController = exports.signupController = void 0;

var _lodash = _interopRequireDefault(require("lodash"));

var _authService = require("../services/authService");

var _generateToken = require("../lib/generateToken");

var _catchAsync = _interopRequireDefault(require("../lib/catchAsync"));

var _createCookie = require("../lib/createCookie");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const signupController = (0, _catchAsync.default)(async (req, res, next) => {
  await (0, _authService.signupService)(req, res, next);
});
exports.signupController = signupController;

const signinController = async (req, res) => {
  const refreshSecret = process.env.JWT_REFRESH_KEY + req.user.password; // 1

  const [token, refreshToken] = (0, _generateToken.createTokens)( //2
  {
    id: req.user.id,
    verified: req.user.verified,
    blocked: req.user.blocked,
    role: req.user.role
  }, refreshSecret);
  const payload = { ...req.user,
    token,
    refreshToken
  };
  (0, _createCookie.createCookie)(res, token, "__act", process.env.JWT_ACCESS_TOKEN_EXPIRES);
  (0, _createCookie.createCookie)( // 3
  res, refreshToken, "__rt", process.env.JWT_REFRESH_TOKEN_EXPIRES);
  return res.status(200).json({
    status: "success",
    message: "Login successfully",
    payload: _lodash.default.omit(payload, ["password"])
  });
};

exports.signinController = signinController;