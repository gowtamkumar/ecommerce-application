import fs from "fs";
import { getDBConnection } from "../../../../config/db";
import { asyncHandler } from "../../../../middlewares/async.middleware";
import { Request, Response, NextFunction } from "express";
import { UpazilaEntity } from "../model/upazila.entity";

// @desc Get all Upazila
// @route GET /api/v1/Upazila
// @access Public
export const getUpazilas = asyncHandler(async (req: Request, res: Response) => {
  const connection = await getDBConnection();
  const repository = connection.getRepository(UpazilaEntity);

  const result = await repository.find();

  return res.status(200).json({
    success: true,
    msg: "Get all Upazila",
    data: result,
  });
});

// @desc Get a single Upazila
// @route GET /api/v1/Upazila/:id
// @access Public
export const getUpazila = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const connection = await getDBConnection();
    const repository = await connection.getRepository(UpazilaEntity);
    const result = await repository.findOneBy({ id });

    if (!result) {
      throw new Error(`Resource not found of id #${req.params.id}`);
    }

    return res.status(200).json({
      success: true,
      msg: `Get a single Upazila of id ${req.params.id}`,
      data: result,
    });
  }
);

// @desc Create a single Upazila
// @route POST /api/v1/Upazila
// @access Public
export const createUpazila = asyncHandler(async (req: any, res: Response) => {
  const connection = await getDBConnection();
  // const validation = UpazilaValidationSchema.safeParse({
  //   ...req.body,
  //   userId: req.id,
  // });

  // if (!validation.success) {
  //   return res.status(401).json({
  //     message: validation.error.formErrors,
  //   });
  // }
  const file = fs.readFileSync(
    process.cwd() + "/database/fack-data/upazilas.json",
    "utf8"
  );
  const jsonData = JSON.parse(file);

  const repository = connection.getRepository(UpazilaEntity);

  const newUpazila = repository.create(
    jsonData[2].data.map((item: any) => ({
      ...item,
      districtId: item.district_id,
      bnName: item.bn_name,
    }))
  );
  const save = await repository.save(newUpazila);

  return res.status(200).json({
    success: true,
    msg: "Create a new Upazila",
    data: save,
  });
});

// // @desc Update a single Upazila
// // @route PUT /api/v1/Upazila/:id
// // @access Public
// export const updateUpazila = asyncHandler(
//   async (req: Request, res: Response) => {
//     const { id } = req.params;
//     const connection = await getDBConnection();

//     const repository = await connection.getRepository(UpazilaEntity);

//     const result = await repository.findOneBy({ id });

//     const updateData = await repository.merge(result, req.body);

//     await repository.save(updateData);

//     return res.status(200).json({
//       success: true,
//       msg: `Update a single Upazila of id ${req.params.id}`,
//       data: updateData,
//     });
//   }
// );

// // @desc Delete a single Upazila
// // @route DELETE /api/v1/Upazila/:id
// // @access Public
// export const deleteUpazila = asyncHandler(
//   async (req: Request, res: Response) => {
//     const { id } = req.params;
//     const connection = await getDBConnection();
//     const repository = await connection.getRepository(UpazilaEntity);

//     const result = await repository.findOneBy({ id });
//     if (!result) {
//       throw new Error(`Resource not found of id #${req.params.id}`);
//     }

//     await repository.delete({ id });

//     return res.status(200).json({
//       success: true,
//       msg: `Delete a single Upazila of id ${req.params.id}`,
//       data: result,
//     });
//   }
// );
