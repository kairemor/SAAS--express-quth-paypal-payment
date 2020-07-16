"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.findAll = exports.findByPk = exports.findUser = exports.findOrCreate = void 0;

const findOrCreate = (model, payload) => model.findOrCreate({
  where: {
    email: payload.email
  },
  defaults: { ...payload
  }
});

exports.findOrCreate = findOrCreate;

const findUser = (model, payload) => model.findOne({
  where: {
    email: payload
  },
  logging: false
});

exports.findUser = findUser;

const findByPk = (model, id) => model.findByPk(id);

exports.findByPk = findByPk;

const findAll = model => model.findAll();

exports.findAll = findAll;