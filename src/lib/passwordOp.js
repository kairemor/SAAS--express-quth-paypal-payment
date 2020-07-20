import bcrypt from "bcryptjs";

const SALT_HASH_KEY = 11;

/*
  hash password with bcrypt and salt before 
  saving it the database 
*/
export const hashPassword = password => bcrypt.hash(password, SALT_HASH_KEY);

/*
  compare password when login between 
  the user given password and the already 
  saved password 
*/
export const comparePassword = (password, dbPassword) =>
  bcrypt.compare(password, dbPassword);

export const isPasswordChanged = (jwtExpiresTime, passwordChangedAt) =>
  passwordChangedAt > jwtExpiresTime;
