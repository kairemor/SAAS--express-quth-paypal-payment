import Model from "../models";
import _ from "lodash";
import { findOrCreate, findUser } from "./index";
import { hashPassword } from "../lib/passwordOp";
import { validateEmail, sendMailConfirmation, validatePassword, validateFieldLength, verifyToken } from "../lib/utils";
import { getToken } from '../lib/authenticate';
import catchAsync from "../lib/catchAsync";

const { User } = Model;

export const signupService = catchAsync(async (req, res, next) => {
  if ( !validatePassword(req.body.password)) {
    return res.status(400).json({
      status: "error",
      message: "Password length should be more than 8 characters"
    });
  }

  if (req.body.password != req.body.confirmPassword) {
    return res.status(400).json({
      status: "error",
      message: "password and passwordConfirm are not the same"
    });
  }

  if (!validateFieldLength(req.body.firstName, req.body.lastName)) {
    return res.status(400).json({
      status: "error",
      message: "firstName and lastName length should be less than 50 characters"
    });
    
  }

  const password = await hashPassword(req.body.password);

  const email = req.body.email.toLowerCase();

  if (!validateEmail(email)) {
    return res.status(400).json({
      status: "error",
      message: "email is not correct"
    });
  }

  const [account, created] = await findOrCreate(User, {
    ...req.body,
    password,
    email
  });
  
  if (!created) {
    return res.status(400).json({
      status: "fail",
      message: "user already exist"
    });
  }

  try {
    const host = req.get('host')
    const protocole = req.protocol
    const token = getToken(account.toJSON())
    const link = `${protocole}://${host}/api/v1/auth/validate/?key=${token}`
    await sendMailConfirmation(account.toJSON().email, account.toJSON().firstName, link)
  } catch (error) {
    
  }
  return res.status(201).json({
    status: "success",
    message: "user successfully created go and check you email to validate your account",
    payload: _.omit(account.toJSON(), ["password"])
  }); 
});


export const signUpValidation = async(req, res, next) => {
  
  if(req.err) {
    const protocole = req.protocol
    const host = req.get('host')
    const user = await findUser(User, req.payload.email) 
    const newToken = getToken(user.toJSON())
    const link = `${protocole}://${host}/api/v1/auth/validate/?key=${newToken}`
    await sendMailConfirmation(user.toJSON().email, user.toJSON().firstName, link)
    return res.status(400).json({
      status: "error",
      message: "url expired we sent you a link back"
    })
  }
  User.update({verified: true}, {where: {id: req.decoded.id}})
  return res.status(200).json({
    status: "success",
    message: "user successfully validate",
  })
}