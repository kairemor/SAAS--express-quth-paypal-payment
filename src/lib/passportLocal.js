import Model from "../models";
import { findByPk, findUser } from "../services/index";
import passportLocal from 'passport-local';
import { comparePassword } from "../lib/passwordOp";

const { User } = Model;

const LocalStrategy = passportLocal.Strategy;


export default (passport) => {
  passport.use(
    new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
      
      // Match user
      const user = await findUser(User, email);
      if (!user) {
        return done(null, false, { message: 'That email is not registered' });
      }        

      // Match password
      if (!(await comparePassword(password, user.password))) {
        return done(null, false, { message: 'Password incorrect' });
      }
      if( !user.isAdmin ) {
        return done(null, false, { message: 'Should be admin' });
      }
      return done(null, user);
    })
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async(id, done) => {
    try {
      const user = await findByPk(User, id)
      done(null, user)
    } catch (err) {
      done(err, null);
    } 
  });
};