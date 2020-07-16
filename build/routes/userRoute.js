"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = require("express");

var _jwtAuthMiddleware = require("../middlewares/jwtAuthMiddleware");

var _userController = require("../controllers/userController");

const router = (0, _express.Router)();
router.get("/", _jwtAuthMiddleware.jwtProtect, _userController.getAllUsers);
var _default = router;
exports.default = _default;