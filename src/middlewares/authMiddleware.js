// eslint-disable-next-line no-unused-vars
import _ from "lodash";
import Model from "../models";
const jwt = require('jsonwebtoken');
import GlobalError from "../lib/globalError";
import {
  findUser
} from "../services/index";
import {
  comparePassword
} from "../lib/passwordOp";

import {
  validateEmail
} from "../lib/utils";

const {
  User
} = Model;

/*
  The middleware the handle user login 
  check if given information are right and forward the user infomration 
  in the request object 
*/
export const signinAuth = async (req, res, next) => {
  const {
    email,
    password
  } = req.body;
  if (!validateEmail(email) || password.length < 8) {
    return res.status(400).json({
      status: "error",
      message: "Invalid credential email or password not good format"
    })
  }
  const user = await findUser(User, email);

  if (!user) {
    return res.status(400).json({
      status: "error",
      message: "Invalid credential email not good"
    })
  }

  if (!(await comparePassword(password, user.password))) {
    return res.status(400).json({
      status: "error",
      message: "Invalid credential password not good"
    })
  }

  if (user && user.toJSON().blocked) {
    return next(
      new GlobalError(
        "Account is blocked, please contact the system administrator",
        401
      )
    );
  }

  req.user = user.toJSON();
  next();
};


/*
  Middleware to verify is the token for user validation link 
  and user reset password link  
*/
export const verifyToken = (req, res, next) => {
  const token = req.query.key;
  jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
    if (err && err.name === 'TokenExpiredError') {
      const payload = jwt.verify(token, process.env.JWT_SECRET_KEY, {
        ignoreExpiration: true
      });
      req.err = err
      req.payload = payload
      next()
    } else {
      req.decoded = decoded;
      req.token = token;
      next();
    }
  });
}