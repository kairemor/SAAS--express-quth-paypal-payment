"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getAllUsers = void 0;

var _lodash = _interopRequireDefault(require("lodash"));

var _services = require("../services");

var _models = _interopRequireDefault(require("../models"));

var _catchAsync = _interopRequireDefault(require("../lib/catchAsync"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const {
  Account
} = _models.default;
const getAllUsers = (0, _catchAsync.default)(async (req, res, next) => {
  const users = await (0, _services.findAll)(Account);
  const body = users.map(user => _lodash.default.omit(user, ["password"]));
  return res.status(200).json({
    status: "success",
    payload: users
  });
});
exports.getAllUsers = getAllUsers;