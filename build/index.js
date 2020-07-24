"use strict";

var _express = _interopRequireDefault(require("express"));

var _morgan = _interopRequireDefault(require("morgan"));

var _dotenv = _interopRequireDefault(require("dotenv"));

var _passport = _interopRequireDefault(require("passport"));

var _swaggerUiExpress = _interopRequireDefault(require("swagger-ui-express"));

var _cors = _interopRequireDefault(require("cors"));

var _path = _interopRequireDefault(require("path"));

var _connectFlash = _interopRequireDefault(require("connect-flash"));

var _ejsMate = _interopRequireDefault(require("ejs-mate"));

var _expressSession = _interopRequireDefault(require("express-session"));

var _passportLocal = _interopRequireDefault(require("./lib/passportLocal"));

var _openApiDocumentation = _interopRequireDefault(require("../openApiDocumentation.json"));

var _routes = _interopRequireDefault(require("./routes"));

var _globalErrorHandler = _interopRequireDefault(require("./lib/globalErrorHandler"));

var _globalError = _interopRequireDefault(require("./lib/globalError"));

var _models = _interopRequireDefault(require("./models"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_dotenv.default.config(); // require('./services/paypalService')


require('./services/paymentService');

(0, _passportLocal.default)(_passport.default);
const app = (0, _express.default)(); // template engine 

app.engine('ejs', _ejsMate.default);
app.set('view engine', 'ejs'); // static files 

app.use(_express.default.static(_path.default.resolve(__dirname, '../public/dist'))); // body parser and logger 

app.use((0, _morgan.default)("dev"));
app.use(_express.default.json());
app.use(_express.default.urlencoded({
  extended: false
})); // Express session

app.use((0, _expressSession.default)({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
})); // Passport middleware

app.use(_passport.default.initialize());
app.use(_passport.default.session()); // app.use(cookieParser());

app.use((0, _cors.default)()); // Connect flash

app.use((0, _connectFlash.default)()); // Global variables

app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});
app.use('/api-docs', _swaggerUiExpress.default.serve, _swaggerUiExpress.default.setup(_openApiDocumentation.default));
app.use(_routes.default);
app.all("*", async (req, res, next) => {
  const err = new _globalError.default(`${req.originalUrl} does not exist on the server`, 404);
  next(err);
});
app.use(_globalErrorHandler.default);
const PORT = process.env.PORT || 3000; // sync() will create all table if they doesn't exist in database

_models.default.sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`server listen at port ${PORT}`);
  });
});