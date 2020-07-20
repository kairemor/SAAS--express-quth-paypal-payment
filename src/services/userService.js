import _ from "lodash";
import { findAll, update, findByPk } from "../services";
import Model from "../models";

const { User } = Model;

export const getAllUserService = async(req, res, next) => {
  const users = await findAll(User);
  const body = users.map(user => _.omit(user.toJSON(), ["password"]));

  return res.status(200).json({
    status: "success",
    payload: body
  });
}

export const getUserByPkService = async(req, res, next) => {
  const user = await findByPk(User, req.params.id)

  return res.status(200).json({
    status: "success",
    payload: _.omit(user, ["password"])
  });
}
  
export const updateUserService = async(req, res, next) => {
  const newUser = await update(User, req.params.id, req.body)

  return res.status(200).json({
    status: "success",
    payload: newUser
  });
}