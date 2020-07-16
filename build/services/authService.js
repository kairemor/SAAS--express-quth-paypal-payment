"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.signupService = void 0;

var _models = _interopRequireDefault(require("../models"));

var _lodash = _interopRequireDefault(require("lodash"));

var _index = require("./index");

var _passwordOp = require("../lib/passwordOp");

var _catchAsync = _interopRequireDefault(require("../lib/catchAsync"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const {
  Account
} = _models.default;
const signupService = (0, _catchAsync.default)(async (req, res, next) => {
  const password = await (0, _passwordOp.hashPassword)(req.body.password);
  const email = req.body.email.toLowerCase();
  const [account, created] = await (0, _index.findOrCreate)(Account, { ...req.body,
    password,
    email
  });

  if (!created) {
    return res.status(400).json({
      status: "fail",
      message: "user already exist"
    });
  }

  return res.status(201).json({
    status: "success",
    message: "user successfully created",
    payload: _lodash.default.omit(account.toJSON(), ["password"])
  });
});
exports.signupService = signupService;