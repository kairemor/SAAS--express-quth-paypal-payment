"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

/*
  high order function to catch error
  for a function  
*/
const catchAsync = fn => (req, res, next) => {
  fn(req, res, next).catch(next);
};

var _default = catchAsync;
exports.default = _default;