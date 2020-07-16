"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _fs = _interopRequireDefault(require("fs"));

var _path = _interopRequireDefault(require("path"));

var _sequelize = _interopRequireDefault(require("sequelize"));

var _config = _interopRequireDefault(require("../database/config"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const basename = _path.default.basename(__filename);

const env = process.env.NODE_ENV || "development";
const config = _config.default[env];
const db = {};
const sequelize = config.use_env_variable ? new _sequelize.default(config.url, config) : new _sequelize.default(config.database, config.username, config.password, config);

_fs.default.readdirSync(__dirname).filter(file => // eslint-disable-next-line implicit-arrow-linebreak
file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js").forEach(file => {
  const model = sequelize.import(_path.default.join(__dirname, file));
  db[model.name] = model;
});

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});
db.sequelize = sequelize;
db.Sequelize = _sequelize.default;
db.Op = _sequelize.default.Op;
var _default = db;
exports.default = _default;