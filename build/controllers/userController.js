"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateUser = exports.getUserByPk = exports.getAllUsers = void 0;

var _catchAsync = _interopRequireDefault(require("../lib/catchAsync"));

var userService = _interopRequireWildcard(require("../services/userService"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
  Controller to handle users recuperation 
  it allow to get all users in the system 
*/
const getAllUsers = (0, _catchAsync.default)(async (req, res, next) => {
  await userService.getAllUserService(req, res, next);
});
exports.getAllUsers = getAllUsers;
const getUserByPk = (0, _catchAsync.default)(async (req, res, next) => {
  await userService.getUserByPkService(req, res, next);
});
exports.getUserByPk = getUserByPk;
const updateUser = (0, _catchAsync.default)(async (req, res, next) => {
  await userService.updateUserService(req, res, next);
});
exports.updateUser = updateUser;