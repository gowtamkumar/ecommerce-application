import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import path from "path";
import { cookies } from "next/headers";

// set cookies data
const sendCookiesResponse = (token: any, res: any) => {
  let options = {
    maxAge: 20 * 60 * 1000, // would expire in 20minutes
    httpOnly: true, // The cookie is only accessible by the web server
    secure: true,
  };
  cookies().set("Bearer", token, options);
  // res.status(200).cookie(process.env.COOKIE_NAME, token, options);
  // .json({ success: true, token }); // set the token to response header, so that the client sends it back on each subsequent request
};

const getSignJwtToken = (user: any) => {
  return jwt.sign(
    { id: user.id, name: user.name, username: user.username },
    "process.env.JWT_SECRET",
    {
      expiresIn: process.env.JWT_EXPIRES,
    }
  );
};

const hashedPassword = (password: any) => {
  return bcrypt.hash(password, 10);
};

const matchPassword = function (enterPassword: any, user: any) {
  return bcrypt.compare(enterPassword, user.password);
};

export { hashedPassword, matchPassword, getSignJwtToken, sendCookiesResponse };
