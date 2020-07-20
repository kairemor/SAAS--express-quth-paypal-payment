"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.update = exports.findAll = exports.findByPk = exports.findUser = exports.create = exports.findOrCreate = void 0;

const findOrCreate = (model, payload) => model.findOrCreate({
  where: {
    email: payload.email
  },
  defaults: { ...payload
  }
});
/*
  Create a new for a given mode
*/


exports.findOrCreate = findOrCreate;

const create = (model, payload) => model.create(payload);
/*
  Find user by email;
*/


exports.create = create;

const findUser = (model, payload) => model.findOne({
  where: {
    email: payload
  },
  logging: false
});

exports.findUser = findUser;

const findByPk = (model, id) => model.findByPk(id);
/*
  Get all record of a models
*/


exports.findByPk = findByPk;

const findAll = (model, condition = {}) => model.findAll(condition);
/*
  Update an model entity
*/


exports.findAll = findAll;

const update = (model, id, payload) => model.update({ ...payload
}, {
  where: {
    id
  }
});

exports.update = update;