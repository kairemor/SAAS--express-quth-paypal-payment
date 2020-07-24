"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.passwordResetConfirmation = exports.passwordReset = exports.signUpValidation = exports.signupService = exports.createUser = void 0;

var _models = _interopRequireDefault(require("../models"));

var _lodash = _interopRequireDefault(require("lodash"));

var _index = require("./index");

var _passwordOp = require("../lib/passwordOp");

var _utils = require("../lib/utils");

var _authenticate = require("../lib/authenticate");

var _catchAsync = _interopRequireDefault(require("../lib/catchAsync"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const {
  User
} = _models.default;

const createUser = async (req, res) => {};

exports.createUser = createUser;
const signupService = (0, _catchAsync.default)(async (req, res, next) => {
  if (!(0, _utils.validatePassword)(req.body.password)) {
    return res.status(400).json({
      status: "error",
      message: "Password length should be more than 8 characters"
    });
  }

  if (req.body.password != req.body.confirmPassword) {
    return res.status(400).json({
      status: "error",
      message: "password and passwordConfirm are not the same"
    });
  }

  if (!(0, _utils.validateFieldLength)(req.body.firstName, req.body.lastName)) {
    return res.status(400).json({
      status: "error",
      message: "firstName and lastName length should be less than 50 characters and more than 1 character"
    });
  }

  const password = await (0, _passwordOp.hashPassword)(req.body.password);
  const email = req.body.email.toLowerCase();

  if (!(0, _utils.validateEmail)(email)) {
    return res.status(400).json({
      status: "error",
      message: "email is not correct"
    });
  }

  const [account, created] = await (0, _index.findOrCreate)(User, { ...req.body,
    password,
    email
  });

  if (!created) {
    return res.status(400).json({
      status: "fail",
      message: "user already exist"
    });
  }

  try {
    const host = req.get('host');
    const protocole = req.protocol;
    const token = (0, _authenticate.getToken)(account.toJSON());
    const link = `${protocole}://${host}/api/v1/auth/validate/?key=${token}`;
    await (0, _utils.sendMailConfirmation)(account.toJSON().email, account.toJSON().firstName, link);
  } catch (error) {}

  return res.status(201).json({
    status: "success",
    message: "user successfully created go and check you email to validate your account",
    payload: _lodash.default.omit(account.toJSON(), ["password"])
  });
});
exports.signupService = signupService;

const signUpValidation = async (req, res, next) => {
  if (req.err) {
    const user = await (0, _index.findUser)(User, req.payload.email);
    const userData = user.toJSON();
    const link = (0, _utils.getValidationLink)(req, userData);
    await (0, _utils.sendMailConfirmation)(userData.email, userData.firstName, link);
    return res.status(400).json({
      status: "error",
      message: "url expired we sent you a link back"
    });
  }

  (0, _index.update)(User, req.decoded.id, {
    verified: true
  });
  return res.status(200).json({
    status: "success",
    message: "user successfully validate"
  });
};

exports.signUpValidation = signUpValidation;

const passwordReset = async (req, res, next) => {
  const email = req.body.email;
  const user = await (0, _index.findUser)(User, email);

  if (!user) {
    return res.status(400).json({
      status: "error",
      message: "No account found with this email please register"
    });
  }

  const link = (0, _utils.resetPasswordLink)(req, user.toJSON());
  await (0, _utils.sendResetPassword)(email, user.toJSON().firstName, link);
  return res.status(200).json({
    status: "success",
    message: "Check your email to reset your password"
  });
};

exports.passwordReset = passwordReset;

const passwordResetConfirmation = async (req, res, next) => {
  console.log("body", req.body);

  if (!(0, _utils.validatePassword)(req.body.password)) {
    return res.status(400).json({
      status: "error",
      message: "Password length should be more than 8 characters"
    });
  }

  if (req.body.password != req.body.confirmPassword) {
    return res.status(400).json({
      status: "error",
      message: "password and passwordConfirm are not the same"
    });
  }

  if (req.err) {
    const user = await (0, _index.findUser)(User, req.payload.email);
    const userData = user.toJSON();
    const link = (0, _utils.resetPasswordLink)(req, userData);
    await (0, _utils.sendResetPassword)(userData.email, userData.firstName, link);
    return res.status(400).json({
      status: "error",
      message: "url expired we sent you a link back"
    });
  }

  const user = await User.update({
    password: await (0, _passwordOp.hashPassword)(req.body.password)
  }, {
    where: {
      id: req.decoded.id
    }
  });
  await (0, _utils.sendMail)(req.decoded.email, 'Reset Password', "Your Password is reset with success");
  return res.status(200).json({
    status: "success",
    payload: user,
    message: "Your password is changed with success"
  });
};

exports.passwordResetConfirmation = passwordResetConfirmation;