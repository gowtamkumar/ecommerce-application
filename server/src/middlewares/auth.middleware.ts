import bcrypt from 'bcryptjs';
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { CustomRequest } from '../enums/custom-request-type';

// Define the type for the middleware function
type MiddlewareFunction = (req: Request, res: Response, next: NextFunction) => void;

// Define the type for the token payload
interface TokenPayload {
  name: string;
  username: string;
  id: string;
  role: string;
}

// AuthGuard middleware
const AuthGuard = (req: CustomRequest, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;
  const token = authorization?.split(' ')[1] || req.cookies?.accessToken;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Authentication Failed: Token is missing',
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as TokenPayload;

    // Attach user information to the request object
    req.name = decoded.name;
    req.username = decoded.username;
    req.role = decoded.role;
    req.id = decoded.id;

    next();
  } catch (error) {
    console.error('Authentication Error:', error);

    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({
        success: false,
        message: 'Authentication Failed: Token has expired',
      });
    }

    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({
        success: false,
        message: 'Authentication Failed: Invalid token',
      });
    }

    // General error fallback
    res.status(500).json({
      success: false,
      message: 'Authentication Failed: An unexpected error occurred',
    });
  }
};

// isAuthorize middleware
const isAuthorize = (roles: string[] | string) => {
  if (typeof roles === 'string') {
    roles = [roles];
  }
  return (req: CustomRequest, res: Response, next: NextFunction): void => {
    if (!req.username || !roles.includes(req.role as string)) {
      res.status(403).json({ message: 'Forbidden: insufficient rights' });
      return;
    }
    next();
  };
};
// Function to send cookies response

const sendCookiesResponse = (res: Response, accessToken: string, refreshToken?: string) => {
  const jwtExpires = process.env.JWT_EXPIRES || '1'; // Default to 1 hour if missing
  const refreshExpires = process.env.JWT_REFRESH_EXPIRES || '7d'; // Default to 7 days if missing

  // Calculate maxAge in milliseconds for cookies
  // If numeric, assume hours. If string with unit, let cookie handle it OR parse it.
  // For simplicity, we'll assume JWT_EXPIRES is in hours if it's numeric.
  const isNumeric = (val: string) => /^\d+$/.test(val);
  
  const accessTokenMaxAge = isNumeric(jwtExpires) 
    ? Number(jwtExpires) * 60 * 60 * 1000 
    : 15 * 60 * 1000; // Default access token to 15 mins if not numeric (recommended)
    
  const refreshTokenMaxAge = 7 * 24 * 60 * 60 * 1000; // Default refresh token to 7 days

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
  };

  res.cookie(process.env.COOKIE_NAME || 'accessToken', accessToken, {
    ...cookieOptions,
    maxAge: accessTokenMaxAge,
  });

  if (refreshToken) {
    res.cookie('refreshToken', refreshToken, {
      ...cookieOptions,
      maxAge: refreshTokenMaxAge,
    });
  }

  return res;
};

// Function to generate signed JWT token
const getSignJwtToken = (user: any): string => {
  const expiresIn = process.env.JWT_EXPIRES 
    ? ( /^\d+$/.test(process.env.JWT_EXPIRES) ? process.env.JWT_EXPIRES + 'h' : process.env.JWT_EXPIRES )
    : '1h';

  return jwt.sign(
    {
      id: user.id,
      name: user.name,
      email: user.email,
      username: user.username,
      role: user.role,
    },
    process.env.JWT_SECRET!,
    {
      expiresIn: expiresIn as jwt.SignOptions['expiresIn'],
    },
  );
};

// Function to generate refresh token
const getRefreshToken = (user: any): string => {
  return jwt.sign(
    { id: user.id },
    process.env.JWT_REFRESH_SECRET || (process.env.JWT_SECRET! + '_refresh'),
    {
      expiresIn: process.env.JWT_REFRESH_EXPIRES || '7d',
    } as jwt.SignOptions,
  );
};

const getResetSignJwtToken = (email: string) => {
  return jwt.sign({ user: email }, process.env.RESET_SECRET!, {
    expiresIn: (process.env.REST_EXPIRESIN as jwt.SignOptions['expiresIn']) || '10m',
  });
};

const getResetVerifyJwtToken = (token: string, res: any) => {
  try {
    jwt.verify(token, process.env.RESET_SECRET!, (error: any, decodedToken: any) => {
      if (error) {
        throw new Error('Invalid or expired reset token new');
      }
    });
  } catch (error) {
    throw new Error('Invalid or expired reset token try catch');
  }
};

// Function to hash password
const hashedPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, 10);
};

// Function to compare passwords
const matchPassword = async (enterPassword: string, user: any): Promise<boolean> => {
  return bcrypt.compare(enterPassword, user.password);
};

export {
  AuthGuard,
  getResetSignJwtToken,
  getResetVerifyJwtToken,
  getSignJwtToken,
  getRefreshToken,
  hashedPassword,
  isAuthorize,
  matchPassword,
  sendCookiesResponse,
};
