import passport from 'passport';
import jwt from 'jsonwebtoken';
import passportJwt from 'passport-jwt';
import Model from "../models";
import { findByPk } from "../services/index";

const { User } = Model;

const jwtStrategy = passportJwt.Strategy;
const extractJwt = passportJwt.ExtractJwt;


export const getToken = (user) => {
  return jwt.sign(user, process.env.JWT_SECRET_KEY,  { expiresIn: '1h' });
};

const options = {
  jwtFromRequest: extractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET_KEY
};

export const jwtPassport = passport.use(new jwtStrategy(options, async (payload, done) => {
  try {
    const user = await findByPk(User, payload.id)
    if(user) return done(null, user);
    else return done(null, false);
  } catch (error) {
    return done(error, false);
  }
})); 

export const verifyUser = passport.authenticate('jwt', {
  session: false
});

export const verifyAdmin = (req, res, next) => {
  if (req.user.admin) {
    next();
  } else {
    const err = new Error('admin needed');
    next(err);
  }
};
