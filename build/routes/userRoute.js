"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = require("express");

var _userController = require("../controllers/userController");

const router = (0, _express.Router)();
router.get("/", _userController.getAllUsers);
router.get("/:id", _userController.getUserByPk);
router.put("/:id", _userController.updateUser);
var _default = router;
exports.default = _default;