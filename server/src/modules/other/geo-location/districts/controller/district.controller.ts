import fs from 'fs';

import { Request, Response, NextFunction } from 'express';
import { DistrictEntity } from '../model/district.entity';
import { asyncHandler } from '../../../../../middlewares/async.middleware';
import { getDBConnection } from '../../../../../config/db';
import { CustomRequest } from '../../../../../enums/custom-request-type';

// @desc Get all District
// @route GET /api/v1/District
// @access Public
export const getDistricts = asyncHandler(async (req: Request, res: Response) => {
  const connection = await getDBConnection();
  const repository = connection.getRepository(DistrictEntity);

  const { divisionId } = req.query;

  const customQuery = {} as any;

  if (divisionId) {
    customQuery.divisionId = divisionId;
  }
  const result = await repository.find({
    where: { divisionId: customQuery.divisionId },
  });

  return res.status(200).json({
    success: true,
    message: 'Get all District',
    data: result,
  });
});

// @desc Get a single District
// @route GET /api/v1/District/:id
// @access Public
export const getDistrict = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;
  const connection = await getDBConnection();
  const repository = await connection.getRepository(DistrictEntity);
  const result = await repository.findOneBy({ id });

  if (!result) {
    throw new Error(`Resource not found of id #${req.params.id}`);
  }

  return res.status(200).json({
    success: true,
    message: `Get a single District of id ${req.params.id}`,
    data: result,
  });
});

// @desc Create a single District
// @route POST /api/v1/District
// @access Public
export const createDistrict = asyncHandler(async (req: CustomRequest, res: Response) => {
  const connection = await getDBConnection();

  const file = fs.readFileSync(process.cwd() + '/database/fack-data/districts.json', 'utf8');
  const jsonData = JSON.parse(file);

  const repository = connection.getRepository(DistrictEntity);

  const newDistrict = repository.create(
    jsonData[2].data.map((item: any) => ({
      ...item,
      divisionId: item.division_id,
      bnName: item.bn_name,
    })),
  );
  const save = await repository.save(newDistrict);

  return res.status(200).json({
    success: true,
    message: 'Create a new District',
    data: save,
  });
});

// // @desc Update a single District
// // @route PUT /api/v1/District/:id
// // @access Public
// export const updateDistrict = asyncHandler(
//   async (req: Request, res: Response) => {
//     const { id } = req.params;
//     const connection = await getDBConnection();

//     const repository = await connection.getRepository(DistrictEntity);

//     const result = await repository.findOneBy({ id });

//     const updateData = await repository.merge(result, req.body);

//     await repository.save(updateData);

//     return res.status(200).json({
//       success: true,
//       message: `Update a single District of id ${req.params.id}`,
//       data: updateData,
//     });
//   }
// );

// // @desc Delete a single District
// // @route DELETE /api/v1/District/:id
// // @access Public
// export const deleteDistrict = asyncHandler(
//   async (req: Request, res: Response) => {
//     const { id } = req.params;
//     const connection = await getDBConnection();
//     const repository = await connection.getRepository(DistrictEntity);

//     const result = await repository.findOneBy({ id });
//     if (!result) {
//       throw new Error(`Resource not found of id #${req.params.id}`);
//     }

//     await repository.delete({ id });

//     return res.status(200).json({
//       success: true,
//       message: `Delete a single District of id ${req.params.id}`,
//       data: result,
//     });
//   }
// );
