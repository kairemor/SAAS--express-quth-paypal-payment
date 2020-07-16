"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createCookie = void 0;

const createCookie = (res, token, name, expires) => {
  const cookieOption = {
    httpOnly: true,
    expires: new Date(Date.now() + expires * 24 * 60 * 60 * 1000),
    secure: process.env.NODE_ENV === "production" ? true : false
  };
  return res.cookie(name, token, cookieOption);
};

exports.createCookie = createCookie;