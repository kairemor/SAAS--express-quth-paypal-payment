"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.signinAuth = void 0;

var _lodash = _interopRequireDefault(require("lodash"));

var _models = _interopRequireDefault(require("../models"));

var _globalError = _interopRequireDefault(require("../lib/globalError"));

var _index = require("../services/index");

var _passwordOp = require("../lib/passwordOp");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// eslint-disable-next-line no-unused-vars
const {
  Account
} = _models.default;

const signinAuth = async (req, res, next) => {
  const {
    email,
    password
  } = req.body;
  const user = await (0, _index.findUser)(Account, email);

  if (!user) {
    return next(new _globalError.default("Invalid credential", 400));
  }

  if (!(await (0, _passwordOp.comparePassord)(password, user.password))) {
    return next(new _globalError.default("Invalid credential", 400));
  }

  if (user && user.toJSON().blocked) {
    return next(new _globalError.default("Account is blocked, please contact the system administrator", 401));
  }

  req.user = user.toJSON();
  next();
};

exports.signinAuth = signinAuth;