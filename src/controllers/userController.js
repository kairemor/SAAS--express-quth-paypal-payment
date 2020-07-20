import catchAsync from "../lib/catchAsync";
import * as userService from "../services/userService";

/*
  Controller to handle users recuperation 
  it allow to get all users in the system 
*/
export const getAllUsers = catchAsync(async (req, res, next) => {
  await userService.getAllUserService(req, res, next)
});

export const getUserByPk = catchAsync(async(req, res, next) => {
  await userService.getUserByPkService(req, res, next)
})

export const updateUser =  catchAsync(async(req, res, next) => {
  await userService.updateUserService(req, res, next)
})

