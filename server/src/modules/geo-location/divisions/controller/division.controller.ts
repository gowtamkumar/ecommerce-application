import fs from "fs";

import { Request, Response, NextFunction } from "express";
import { DivisionEntity } from "../model/division.entity";
// import { DivisionValidationSchema } from "../../../validation";
import { asyncHandler } from "../../../../middlewares/async.middleware";
import { getDBConnection } from "../../../../config/db";

// @desc Get all Division
// @route GET /api/v1/Division
// @access Public
export const getDivisions = asyncHandler(
  async (req: Request, res: Response) => {
    const connection = await getDBConnection();
    const repository = connection.getRepository(DivisionEntity);

    const result = await repository.find();

    return res.status(200).json({
      success: true,
      msg: "Get all Division",
      data: result,
    });
  }
);

// @desc Get a single Division
// @route GET /api/v1/Division/:id
// @access Public
export const getDivision = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const connection = await getDBConnection();
    const repository = await connection.getRepository(DivisionEntity);

    const qb = repository.createQueryBuilder("division");
    qb.select([
      "division.id",
      "division.name",
      "division.bnName",
      "districts.id",
      "districts.name",
      "districts.bnName",
      "upazilas.id",
      "upazilas.name",
      "upazilas.bnName",
      "unions.id",
      "unions.name",
      "unions.bnName",
    ]);

    qb.leftJoin("division.districts", "districts");
    qb.leftJoin("districts.upazilas", "upazilas");
    qb.leftJoin("upazilas.unions", "unions");

    qb.where({ id });
    const result = await qb.getOne();

    // const result = await repository.findOneBy({ id });

    if (!result) {
      throw new Error(`Resource not found of id #${req.params.id}`);
    }

    return res.status(200).json({
      success: true,
      msg: `Get a single Division of id ${req.params.id}`,
      data: result,
    });
  }
);

// @desc Create a single Division
// @route POST /api/v1/Division
// @access Public
export const createDivision = asyncHandler(async (req: any, res: Response) => {
  const connection = await getDBConnection();

  const file = fs.readFileSync(
    process.cwd() + "/database/fack-data/divisions.json",
    "utf8"
  );
  const jsonData = JSON.parse(file);

  // const validation = DivisionValidationSchema.safeParse({
  //   ...req.body,
  //   userId: req.id,
  // });

  // if (!validation.success) {
  //   return res.status(401).json({
  //     message: validation.error.formErrors,
  //   });
  // }

  const repository = connection.getRepository(DivisionEntity);

  const newDivision = repository.create(
    jsonData[2].data.map((item: any) => ({ ...item, bnName: item.bn_name }))
  );
  const save = await repository.save(newDivision);

  return res.status(200).json({
    success: true,
    msg: "Create a new Division",
    data: save,
  });
});

// @desc Update a single Division
// @route PUT /api/v1/Division/:id
// @access Public
// export const updateDivision = asyncHandler(
//   async (req: Request, res: Response) => {
//     const { id } = req.params;
//     const connection = await getDBConnection();

//     const repository = await connection.getRepository(DivisionEntity);

//     const result = await repository.findOneBy({ id });

//     const updateData = await repository.merge(result, req.body);

//     await repository.save(updateData);

//     return res.status(200).json({
//       success: true,
//       msg: `Update a single Division of id ${req.params.id}`,
//       data: updateData,
//     });
//   }
// );

// @desc Delete a single Division
// @route DELETE /api/v1/Division/:id
// @access Public
// export const deleteDivision = asyncHandler(
//   async (req: Request, res: Response) => {
//     const { id } = req.params;
//     const connection = await getDBConnection();
//     const repository = await connection.getRepository(DivisionEntity);

//     const result = await repository.findOneBy({ id });
//     if (!result) {
//       throw new Error(`Resource not found of id #${req.params.id}`);
//     }

//     await repository.delete({ id });

//     return res.status(200).json({
//       success: true,
//       msg: `Delete a single Division of id ${req.params.id}`,
//       data: result,
//     });
//   }
// );
