import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../../../middlewares/async.middleware";
import { exec } from "child_process";
import fs from "fs";

// @desc Get all Address
// @route GET /api/v1/Address
// @access Public
export const dbBackup = asyncHandler(async (req: Request, res: Response) => {
  const date = new Date();
  const currentDate = `${date.getFullYear()}.${
    date.getMonth() + 1
  }.${date.getDate()}.${date.getHours()}.${date.getMinutes()}`;

  const backupFile = `database-backup-${currentDate}.sql`;

  const backupCommand = `PGPASSWORD="${process.env.DB_PASSWORD}" pg_dump -U ${process.env.DB_USERNAME} -p ${process.env.DB_PORT} -h ${process.env.DB_HOST} ${process.env.DB_DATABASE} > ${backupFile}`;

  console.log("🚀 ~ backupCommand:", backupCommand);
  exec(backupCommand, (error, stdout, stderr) => {
    if (error) {
      console.error(`Backup process failed: ${error.message}`);
      return res.status(500).json({ error: "Backup failed" });
    }

    if (fs.existsSync(backupFile)) {
      // Set content type and attachment header to force download
      res.setHeader("Content-Type", "application/sql");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=${backupFile}`
      );

      // Stream the file to the response
      const fileStream = fs.createReadStream(backupFile);
      fileStream.pipe(res);
      fileStream.on("end", () => {
        fs.unlink(backupFile, (err) => {
          if (err) {
            console.error("Error deleting backup file", err);
          } else {
            console.log("Backup file Deleted");
          }
        });
      });
    } else {
      // If file doesn't exist, return 404
      res.status(404).send("File not found");
    }
  });
});

// @desc Get a single Address
// @route GET /api/v1/Address/:id
// @access Public
// export const getAddress = asyncHandler(
//   async (req: Request, res: Response, next: NextFunction) => {
//     const { id } = req.params;
//     const connection = await getDBConnection();
//     const repository = await connection.getRepository(AddressEntity);
//     const result = await repository.findOneBy({ id });

//     if (!result) {
//       throw new Error(`Resource not found of id #${req.params.id}`);
//     }

//     return res.status(200).json({
//       success: true,
//       msg: `Get a single Address of id ${req.params.id}`,
//       data: result,
//     });
//   }
// );

// @desc Create a single Address
// @route POST /api/v1/Address
// @access Public
// export const createAddress = asyncHandler(async (req: any, res: Response) => {
//   const connection = await getDBConnection();
//   const validation = addressValidationSchema.safeParse(req.body);

//   if (!validation.success) {
//     return res.status(401).json({
//       message: validation.error.formErrors,
//     });
//   }

//   const repository = connection.getRepository(AddressEntity);

//   const newAddress = repository.create(validation.data);

//   const save = await repository.save(newAddress);

//   return res.status(200).json({
//     success: true,
//     msg: "Create a new Address",
//     data: save,
//   });
// });

// @desc Update a single Address
// @route PUT /api/v1/Address/:id
// @access Public
// export const updateAddress = asyncHandler(
//   async (req: Request, res: Response) => {
//     const { id } = req.params;
//     const connection = await getDBConnection();

//     const repository = await connection.getRepository(AddressEntity);

//     const result = await repository.findOneBy({ id });

//     const updateData = await repository.merge(result, req.body);

//     await repository.save(updateData);

//     return res.status(200).json({
//       success: true,
//       msg: `Update a single Address of id ${req.params.id}`,
//       data: updateData,
//     });
//   }
// );

// @desc Delete a single Address
// @route DELETE /api/v1/Address/:id
// @access Public
// export const deleteAddress = asyncHandler(
//   async (req: Request, res: Response) => {
//     const { id } = req.params;
//     const connection = await getDBConnection();
//     const repository = await connection.getRepository(AddressEntity);

//     const result = await repository.findOneBy({ id });
//     if (!result) {
//       throw new Error(`Resource not found of id #${req.params.id}`);
//     }

//     await repository.delete({ id });

//     return res.status(200).json({
//       success: true,
//       msg: `Delete a single Address of id ${req.params.id}`,
//       data: result,
//     });
//   }
// );
