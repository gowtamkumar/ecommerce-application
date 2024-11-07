import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errStatus = err.statusCode || 500;
  const errMsg = err.message || "Internal Server Error";

  if (!res.headersSent) {
    // Check if the error is a Zod validation error
    if (err instanceof ZodError) {
      const formattedErrors = err.errors.map((issue) => ({
        path: issue.path.join("."),
        message: issue.message,
      }));

      res.status(400).json({
        success: false,
        error: {
          type: "Validation Error",
          issues: formattedErrors,
        },
      });
    } else {
      res.status(errStatus).json({
        success: false,
        status: errStatus,
        message: errMsg,
        stack: process.env.NODE_ENV === "development" ? err.stack : {},
      });
    }
  } else {
    next(err);
  }
};
