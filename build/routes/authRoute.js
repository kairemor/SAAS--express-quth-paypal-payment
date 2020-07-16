"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = require("express");

var _authController = require("../controllers/authController");

var _authMiddleware = require("../middlewares/authMiddleware");

const authRouter = (0, _express.Router)();
authRouter.post("/signup", _authController.signupController);
authRouter.post("/signin", _authMiddleware.signinAuth, _authController.signinController);
var _default = authRouter;
exports.default = _default;