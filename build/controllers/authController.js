"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.passwordResetConfirmationController = exports.passwordResetController = exports.signinController = exports.signUpValidationController = exports.signupController = void 0;

var _lodash = _interopRequireDefault(require("lodash"));

var _authService = require("../services/authService");

var _catchAsync = _interopRequireDefault(require("../lib/catchAsync"));

var _authenticate = require("../lib/authenticate");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* 
  controller for registration 
  this handle user account creation 
*/
const signupController = (0, _catchAsync.default)(async (req, res, next) => {
  await (0, _authService.signupService)(req, res, next);
});
/*
  controller to validate user account creation 
  after user receive link with mail from  registration 
*/

exports.signupController = signupController;

const signUpValidationController = async (req, res, next) => {
  await (0, _authService.signUpValidation)(req, res, next);
};
/*
  controller to log in the system with credential 
    username and password 
*/


exports.signUpValidationController = signUpValidationController;

const signinController = async (req, res) => {
  if (!req.user.verified) {
    return res.status(400).json({
      status: "error",
      message: "User not verified please check you mail"
    });
  }

  const token = (0, _authenticate.getToken)({
    id: req.user.id
  });
  const payload = { ...req.user,
    token
  };
  return res.status(200).json({
    status: "success",
    message: "Login successfully",
    payload: _lodash.default.omit(payload, ["password"])
  });
};
/*
  Controller to ask for password reset 
*/


exports.signinController = signinController;

const passwordResetController = async (req, res, next) => {
  await (0, _authService.passwordReset)(req, res, next);
};
/*
  Password reset confirmation after click user link in  email
  and send new password 
*/


exports.passwordResetController = passwordResetController;

const passwordResetConfirmationController = async (req, res, next) => {
  await (0, _authService.passwordResetConfirmation)(req, res, next);
};

exports.passwordResetConfirmationController = passwordResetConfirmationController;