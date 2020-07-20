import _ from "lodash";
import { signupService, signUpValidation, passwordReset, passwordResetConfirmation } from "../services/authService";
import catchAsync from "../lib/catchAsync";
import {getToken} from '../lib/authenticate';


/* 
  controller for registration 
  this handle user account creation 
*/
export const signupController = catchAsync(async (req, res, next) => {
  await signupService(req, res, next);
});

/*
  controller to validate user account creation 
  after user receive link with mail from  registration 
*/
export const signUpValidationController = async(req, res, next) => {
  await signUpValidation(req, res, next)    
};

/*
  controller to log in the system with credential 
    username and password 
*/
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

/*
  Controller to ask for password reset 
*/

export const passwordResetController = async (req, res, next) => {
  await passwordReset(req, res, next)
} 

/*
  Password reset confirmation after click user link in  email
  and send new password 
*/

export const passwordResetConfirmationController = async (req, res ,next) => {
  await passwordResetConfirmation(req, res, next)
}