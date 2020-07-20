"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

/*
  Global error handler to raise
  error when there is one 
*/
class GlobalError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error"; // *
  }

}

var _default = GlobalError;
exports.default = _default;