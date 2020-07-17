import _ from "lodash";
import { signupService, signUpValidation } from "../services/authService";
import catchAsync from "../lib/catchAsync";
import {getToken} from '../lib/authenticate';


export const signupController = catchAsync(async (req, res, next) => {
  await signupService(req, res, next);
});

export const signUpValidationController = async(req, res, next) => {
  await signUpValidation(req, res, next)    
};

export const signinController = async (req, res) => {
  
  if(!req.user.verified) {
    return res.status(400).json({
      status: "error",
      message: "User not verified please check you mail"
    });  
  }
  const token = getToken({
    id: req.user.id
  });

  const payload = {...req.user, token}

  return res.status(200).json({
    status: "success",
    message: "Login successfully",
    payload: _.omit(payload, ["password"])
  });
};
