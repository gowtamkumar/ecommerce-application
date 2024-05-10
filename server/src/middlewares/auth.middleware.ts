import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

// Define the type for the middleware function
type MiddlewareFunction = (
  req: Request,
  res: Response,
  next: NextFunction
) => void;

// Define the type for the token payload
interface TokenPayload {
  name: string;
  username: string;
  id: string;
  role: string;
}

// AuthGuard middleware
const AuthGuard: MiddlewareFunction = (req: any, res, next) => {
  const { authorization } = req.headers;
  // let token = authorization?.split(" ")[1] || req.cookies.accessToken;
  let token = req.cookies.accessToken;
  console.log("🚀 ~ token:", token);

  if (!token) {
    return next({ message: "Authentication Failed" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as TokenPayload;
    const { name, username, id, role } = decoded;
    req.name = name;
    req.username = username;
    req.role = role;
    req.id = id;
    next();
  } catch (err) {
    next({ message: "authorized faild!" });
  }
};

// isAuthorize middleware
const isAuthorize: MiddlewareFunction = async (req: any, res, next) => {
  try {
    if (req.role === "Admin") {
      return next();
    } else {
      return next({ statusCode: 401, message: "Authorize Failed!" });
    }
  } catch (err) {
    return next({ statusCode: 401, message: "Authorize Failed!" });
  }
};

// Function to send cookies response

const sendCookiesResponse = (token: string, res: Response) => {
  const maxAge = Number(process.env.JWT_EXPIRES) * 60 * 60 * 1000; // would expire in 1 day
  let options = {
    maxAge,
    httpOnly: true, // The cookie is only accessible by the web server
    secure: false, // Set to true if you're using HTTPS
  };
  // Set the cookie
  return res.cookie(process.env.COOKIE_NAME!, token, options);
};

// Function to generate signed JWT token
const getSignJwtToken = (user: any): string => {
  return jwt.sign(
    { id: user.id, name: user.name, username: user.username, role: user.role },
    process.env.JWT_SECRET!,
    {
      expiresIn: process.env.JWT_EXPIRES + "h",
    }
  );
};

const getResetSignJwtToken = (email: string) => {
  return jwt.sign({ user: email }, process.env.RESET_SECRET!, {
    expiresIn: process.env.REST_EXPIRESIN,
  });
};

const getResetVerifyJwtToken = (token: string, res: any) => {
  try {
    jwt.verify(
      token,
      process.env.RESET_SECRET!,
      (error: any, decodedToken: any) => {
        if (error) {
          throw new Error("Invalid or expired reset token new");
        }
      }
    );
  } catch (error) {
    throw new Error("Invalid or expired reset token try catch");
  }
};

// Function to hash password
const hashedPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, 10);
};

// Function to compare passwords
const matchPassword = async (
  enterPassword: string,
  user: any
): Promise<boolean> => {
  return bcrypt.compare(enterPassword, user.password);
};

export {
  AuthGuard,
  isAuthorize,
  sendCookiesResponse,
  hashedPassword,
  getSignJwtToken,
  matchPassword,
  getResetSignJwtToken,
  getResetVerifyJwtToken,
};
