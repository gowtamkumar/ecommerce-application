import { Request, Response, NextFunction } from "express";
import { exec } from "child_process";
import fs from "fs";
import { asyncHandler } from "../../../../middlewares/async.middleware";

// @desc Get all Address
// @route GET /api/v1/Address
// @access Public
export const dbBackup = asyncHandler(async (req: Request, res: Response) => {
  const date = new Date();
  const currentDate = `${date.getFullYear()}.${
    date.getMonth() + 1
  }.${date.getDate()}.${date.getHours()}.${date.getMinutes()}`;

  const backupFile = `database-backup-${currentDate}.sql.gz`; // Compressed file
  const backupCommand = `PGPASSWORD="101" pg_dump -U postgres -p 5432 -h localhost express_ts_posgresq_typeorm | gzip > ${backupFile}`;
  // const backupCommand = `PGPASSWORD="${process.env.DB_PASSWORD}" pg_dump -U ${process.env.DB_USERNAME} -p ${process.env.DB_PORT} -h ${process.env.DB_HOST} ${process.env.DB_DATABASE} | gzip > ${backupFile}`;

  exec(backupCommand, (error, stdout, stderr) => {
    if (error) {
      console.error(`Backup process failed: ${error.message}`);
      return res.status(500).json({ error: "Backup failed" });
    }

    if (fs.existsSync(backupFile)) {
      // Set content type and attachment header to force download
      res.setHeader("Content-Type", "application/gzip");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=${backupFile}`
      );

      // Stream the file to the response
      const fileStream = fs.createReadStream(backupFile);
      fileStream.pipe(res);
      fileStream.on("end", () => {
        console.log("Finished database backup download");
        // Delete the file after the response is finished
        fs.unlink(backupFile, (err) => {
          if (err) {
            console.error("Error deleting backup file:", err);
          } else {
            console.log("Backup file deleted");
          }
        });
      });
    } else {
      // If file doesn't exist, return 404
      res.status(404).send("File not found");
    }
  });
});
