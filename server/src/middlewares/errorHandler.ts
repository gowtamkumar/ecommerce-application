import { NextFunction, Request, Response } from "express";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("🚀 ~ err:", err);
  const errStatus = err.statusCode || 500;
  const errMsg = err.message || "Server Error";
  // if (!res.headersSent) {
  //   res.status(500).json({ error: "Internal Server Error" });
  // }
  res.status(errStatus).json({
    success: false,
    status: errStatus,
    message: errMsg,
    stack: process.env.NODE_ENV === "development" ? err.stack : {},
  });
};
