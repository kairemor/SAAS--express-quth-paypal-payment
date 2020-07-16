"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = require("express");

var _authRoute = _interopRequireDefault(require("./authRoute"));

var _userRoute = _interopRequireDefault(require("./userRoute"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const apiRouter = (0, _express.Router)();
apiRouter.use("/api/v1/auth", _authRoute.default);
apiRouter.use("/api/v1/user", _userRoute.default);
var _default = apiRouter;
exports.default = _default;