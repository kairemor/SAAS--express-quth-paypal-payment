"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = require("express");

var _authRoute = _interopRequireDefault(require("./authRoute"));

var _userRoute = _interopRequireDefault(require("./userRoute"));

var _groupRoute = _interopRequireDefault(require("./groupRoute"));

var _adminRoute = _interopRequireDefault(require("./adminRoute"));

var _paymentRoute = _interopRequireDefault(require("./paymentRoute"));

var _adminAuthRoute = _interopRequireDefault(require("./adminAuthRoute"));

var _paypalController = require("../controllers/paypalController");

var _authenticate = require("../lib/authenticate");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const apiRouter = (0, _express.Router)();
apiRouter.use("/api/v1/auth", _authRoute.default);
apiRouter.use("/api/v1/user", _authenticate.verifyUser, _userRoute.default);
apiRouter.use("/api/v1/group", _authenticate.verifyUser, _groupRoute.default);
apiRouter.use("/api/v1/payment", _authenticate.verifyUser, _paymentRoute.default);
apiRouter.use("/admin/auth", _adminAuthRoute.default);
apiRouter.use("/admin", _adminRoute.default);
apiRouter.get("/", _paypalController.createAgreementController);
apiRouter.get("/processagreement", _paypalController.processAgreement);
var _default = apiRouter;
exports.default = _default;