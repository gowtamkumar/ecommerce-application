import { Request } from 'express';

export interface CustomRequest extends Request {
  id?: string | number; // Use `?` if the property is optional
  name?: string;
  username?: string;
  role?: string;
  files?: any;
}
