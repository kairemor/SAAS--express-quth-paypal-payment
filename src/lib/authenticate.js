import passport from 'passport';
import jwt from 'jsonwebtoken';
import passportJwt from 'passport-jwt';
import Model from "../models";
import { findByPk } from "../services/index";
import passportLocal from 'passport-local';

const { User } = Model;

const jwtStrategy = passportJwt.Strategy;
const extractJwt = passportJwt.ExtractJwt;
const LocalStrategy = passportLocal.Strategy;


/*
  Get token from payload which is the user data
*/

export const getToken = (user) => {
  return jwt.sign(user, process.env.JWT_SECRET_KEY,  { expiresIn: '1h' });
};

const options = {
  jwtFromRequest: extractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET_KEY
};

/*
  jwt password middleware to authenticate user 
  with jwt strategy 
*/
export const jwtPassport = passport.use(new jwtStrategy(options, async (payload, done) => {
  try {
    const user = await findByPk(User, payload.id)
    if(user) return done(null, user);
    else return done(null, false);
  } catch (error) {
    return done(error, false);
  }
})); 

/*
  verify if user is authenticate before getting 
  protected data that require user to log in the system  
*/
export const verifyUser = passport.authenticate('jwt', {
  session: false
});

/*
  Verify is user is a admin to access to dashboard
  that require admin privilege
*/
export const verifyAdmin = (req, res, next) => {
  if (req.user.isAdmin) {
    next();
  } else {
    const err = new Error('admin needed');
    next(err);
  }
};

/*
  unsure user is authenticated before accessing to admin dashboard
*/
export const ensureAuthenticated = (req, res, next) => {

  if (req.isAuthenticated()) {
    return next();
  }
  req.flash('error_msg', 'Please log in to view that resource');
  res.redirect('/admin/auth/login');
};

export const forwardAuthenticated = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return next();
  }
  res.redirect('/admin/dashboard');      
}

// 