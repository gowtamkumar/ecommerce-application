import winston, { format } from "winston";

export const logger = winston.createLogger({
  level: "info",
  format: format.combine(
    winston.format.colorize(),
    // winston.format.json(),
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.printf(
      ({ timestamp, level, message }) => `${timestamp} [${level}]: [${message}]`
    )
  ),
  // defaultMeta: { service: "user-service" },
  transports: [
    new winston.transports.Console(),
    //
    // - Write all logs with importance level of `error` or higher to `error.log`
    //   (i.e., error, fatal, but not other levels)
    //
    // new winston.transports.File({ filename: "error.log", level: "error" }),  //this use create only error log
    //
    // - Write all logs with importance level of `info` or higher to `combined.log`
    //   (i.e., fatal, error, warn, and info, but not trace)
    //
    new winston.transports.File({ filename: "app.log", level: "info" }), //this use create a app log
  ],
});

// If we're not in production then log to the `console` with the format:
// if (process.env.NODE_ENV !== "production") {
//   logger.add(
//     new winston.transports.Console({
//       format: winston.format.simple(),
//     })
//   );
// }
