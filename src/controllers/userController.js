import _ from "lodash";
import { findAll } from "../services";
import Model from "../models";
import catchAsync from "../lib/catchAsync";

const { User } = Model;

export const getAllUsers = catchAsync(async (req, res, next) => {
  const users = await findAll(User);
  const body = users.map(user => _.omit(user.toJSON(), ["password"]));

  return res.status(200).json({
    status: "success",
    payload: body
  });
});
