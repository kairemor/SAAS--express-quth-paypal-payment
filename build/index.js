"use strict";

var _express = _interopRequireDefault(require("express"));

var _morgan = _interopRequireDefault(require("morgan"));

var _dotenv = _interopRequireDefault(require("dotenv"));

var _cookieParser = _interopRequireDefault(require("cookie-parser"));

var _swaggerUiExpress = _interopRequireDefault(require("swagger-ui-express"));

var _openApiDocumentation = _interopRequireDefault(require("../openApiDocumentation.json"));

var _routes = _interopRequireDefault(require("./routes"));

var _globalErrorHandler = _interopRequireDefault(require("./lib/globalErrorHandler"));

var _globalError = _interopRequireDefault(require("./lib/globalError"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const app = (0, _express.default)();

_dotenv.default.config();

app.use((0, _morgan.default)("dev"));
app.use(_express.default.json());
app.use((0, _cookieParser.default)());
app.use('/api-docs', _swaggerUiExpress.default.serve, _swaggerUiExpress.default.setup(_openApiDocumentation.default));
app.use(_routes.default);
app.all("*", async (req, res, next) => {
  const err = new _globalError.default(`${req.originalUrl} does not exist on the server`, 404);
  next(err);
});
app.use(_globalErrorHandler.default);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`server listen at port ${PORT}`);
});