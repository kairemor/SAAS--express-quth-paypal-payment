"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.verifyToken = exports.signinAuth = void 0;

var _lodash = _interopRequireDefault(require("lodash"));

var _models = _interopRequireDefault(require("../models"));

var _globalError = _interopRequireDefault(require("../lib/globalError"));

var _index = require("../services/index");

var _passwordOp = require("../lib/passwordOp");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// eslint-disable-next-line no-unused-vars
const jwt = require('jsonwebtoken');

const {
  User
} = _models.default;

const signinAuth = async (req, res, next) => {
  const {
    email,
    password
  } = req.body;
  const user = await (0, _index.findUser)(User, email);

  if (!user) {
    return next(new _globalError.default("Invalid credential", 400));
  }

  if (!(await (0, _passwordOp.comparePassword)(password, user.password))) {
    return next(new _globalError.default("Invalid credential", 400));
  }

  if (user && user.toJSON().blocked) {
    return next(new _globalError.default("Account is blocked, please contact the system administrator", 401));
  }

  req.user = user.toJSON();
  next();
};

exports.signinAuth = signinAuth;

const verifyToken = (req, res, next) => {
  const token = req.query.key;
  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
    if (err && err.name === 'TokenExpiredError') {
      const payload = jwt.verify(token, process.env.JWT_SECRET_KEY, {
        ignoreExpiration: true
      });
      req.err = err;
      req.payload = payload;
      next();
    } else {
      req.decoded = decoded;
      req.token = token;
      next();
    }
  });
};

exports.verifyToken = verifyToken;