import { Request, Response, NextFunction } from 'express';
import { exec } from 'child_process';
import fs from 'fs';
import { asyncHandler } from '../../../../middlewares/async.middleware';
import { getDBConnection } from '../../../../config/db';
import { settingValidationSchema } from '../../../../validation';
import { SettingEntity } from '../model/setting.entity';
import { logger } from '../../../../middlewares/logger';
import { CustomRequest } from '../../../../enums/custom-request-type';

// @desc Get all Setting
// @route GET /api/v1/Setting
// @access Public
export const getSettings = asyncHandler(async (req: Request, res: Response) => {
  logger.info(`Service: getSettings ${req.method} ${req.url}`);

  const connection = await getDBConnection();
  const repository = connection.getRepository(SettingEntity);

  const result = await repository.find();

  return res.status(200).json({
    success: true,
    message: 'Get all Setting',
    data: result[0],
  });
});

// @desc Get a single Setting
// @route GET /api/v1/Setting/:id
// @access Public
export const getSetting = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  logger.info(`Service: getSetting ${req.method} ${req.url}`);

  const { id } = req.params;
  const connection = await getDBConnection();
  const repository = await connection.getRepository(SettingEntity);
  const result = await repository.findOneBy({ id });

  if (!result) {
    throw new Error(`Resource not found of id #${req.params.id}`);
  }

  return res.status(200).json({
    success: true,
    message: `Get a single Setting of id ${req.params.id}`,
    data: result,
  });
});

// @desc Create a single Setting
// @route POST /api/v1/Setting
// @access Public
export const createSetting = asyncHandler(async (req: CustomRequest, res: Response) => {
  logger.info(`Service: createSetting ${req.method} ${req.url}`);

  const connection = await getDBConnection();
  const validation = settingValidationSchema.safeParse({
    ...req.body,
    userId: req.id,
  });

  if (!validation.success) {
    const formattedErrors = validation.error.issues.map((issue) => ({
      path: issue.path.join('.'),
      message: issue.message,
    }));

    return res.status(400).json({
      success: false,
      issues: formattedErrors,
    });
  }

  const repository = connection.getRepository(SettingEntity);
  const newSetting = repository.create(validation.data);
  const save = await repository.save(newSetting);

  return res.status(200).json({
    success: true,
    message: 'Create a new Setting',
    data: save,
  });
});

export const createDashboardSetting = asyncHandler(async (req: CustomRequest, res: Response) => {
  logger.info(`Service: createDashboardSetting ${req.method} ${req.url}`);

  const connection = await getDBConnection();
  const validation = settingValidationSchema.safeParse(req.body);

  if (!validation.success) {
    const formattedErrors = validation.error.issues.map((issue) => ({
      path: issue.path.join('.'),
      message: issue.message,
    }));

    return res.status(400).json({
      success: false,
      issues: formattedErrors,
    });
  }

  const repository = connection.getRepository(SettingEntity);
  const newSetting = repository.create(validation.data);
  const save = await repository.save(newSetting);

  return res.status(200).json({
    success: true,
    message: 'Create a new Setting by dashboard',
    data: save,
  });
});

// @desc Update a single Setting
// @route PUT /api/v1/Setting/:id
// @access Public
export const updateSetting = asyncHandler(async (req: Request, res: Response) => {
  logger.info(`Service: updateSetting ${req.method} ${req.url}`);

  const { id } = req.params;
  const connection = await getDBConnection();
  const repository = await connection.getRepository(SettingEntity);
  const result = await repository.findOneBy({ id });
  const settingRes = await repository.merge(result, req.body);
  await repository.save(settingRes);
  return res.status(200).json({
    success: true,
    message: `Setting updated successfully`,
    data: settingRes,
  });
});

// @desc Delete a single Setting
// @route DELETE /api/v1/Setting/:id
// @access Public
export const deleteSetting = asyncHandler(async (req: Request, res: Response) => {
  logger.info(`Service: deleteSetting ${req.method} ${req.url}`);

  const { id } = req.params;
  const connection = await getDBConnection();
  const repository = await connection.getRepository(SettingEntity);

  const result = await repository.findOneBy({ id });
  if (!result) {
    throw new Error(`Resource not found of id #${req.params.id}`);
  }

  await repository.delete({ id });

  return res.status(200).json({
    success: true,
    message: `Delete a single Setting of id ${req.params.id}`,
    data: result,
  });
});

// @desc Get all Address
// @route GET /api/v1/Address
// @access Public
export const dbBackup = asyncHandler(async (req: Request, res: Response) => {
  logger.info(`Service: dbBackup ${req.method} ${req.url}`);

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
      return res.status(500).json({ error: 'Backup failed' });
    }

    if (fs.existsSync(backupFile)) {
      // Set content type and attachment header to force download
      res.setHeader('Content-Type', 'application/gzip');
      res.setHeader('Content-Disposition', `attachment; filename=${backupFile}`);

      // Stream the file to the response
      const fileStream = fs.createReadStream(backupFile);
      fileStream.pipe(res);
      fileStream.on('end', () => {
        console.log('Finished database backup download');
        // Delete the file after the response is finished
        fs.unlink(backupFile, (err) => {
          if (err) {
            console.error('Error deleting backup file:', err);
          } else {
            console.log('Backup file deleted');
          }
        });
      });
    }
  });
});

export const getRobotsTxt = asyncHandler(async (req: Request, res: Response) => {
  const connection = await getDBConnection();
  const repository = connection.getRepository(SettingEntity);
  const settings = await repository.find();
  const robotsTxt = settings[0]?.seo?.robotsTxt || 'User-agent: *\nAllow: /';

  res.type('text/plain');
  return res.send(robotsTxt);
});
