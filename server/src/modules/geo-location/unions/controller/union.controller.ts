import fs from "fs";
import { getDBConnection } from "../../../../config/db";
import { asyncHandler } from "../../../../middlewares/async.middleware";
import { Request, Response, NextFunction } from "express";
import { UnionEntity } from "../model/union.entity";

// @desc Get all Union
// @route GET /api/v1/Union
// @access Public
export const getUnions = asyncHandler(async (req: Request, res: Response) => {
  const connection = await getDBConnection();
  const repository = connection.getRepository(UnionEntity);

  const { upazilaId } = req.query;

  let customQuery = {} as any;

  if (upazilaId) {
    customQuery.upazilaId = upazilaId;
  }
  const result = await repository.find({
    where: { upazilaId: customQuery.upazilaId },
  });

  return res.status(200).json({
    success: true,
    msg: "Get all Union",
    data: result,
  });
});

// @desc Get a single Union
// @route GET /api/v1/Union/:id
// @access Public
export const getUnion = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const connection = await getDBConnection();
    const repository = await connection.getRepository(UnionEntity);
    const result = await repository.findOneBy({ id });

    if (!result) {
      throw new Error(`Resource not found of id #${req.params.id}`);
    }

    return res.status(200).json({
      success: true,
      msg: `Get a single Union of id ${req.params.id}`,
      data: result,
    });
  }
);

// @desc Create a single Union
// @route POST /api/v1/Union
// @access Public
export const createUnion = asyncHandler(async (req: any, res: Response) => {
  const connection = await getDBConnection();
  // const validation = UnionValidationSchema.safeParse({
  //   ...req.body,
  //   userId: req.id,
  // });

  // if (!validation.success) {
  //   return res.status(401).json({
  //     message: validation.error.formErrors,
  //   });
  // }

  const file = fs.readFileSync(
    process.cwd() + "/database/fack-data/unions.json",
    "utf8"
  );
  const jsonData = JSON.parse(file);

  const repository = connection.getRepository(UnionEntity);

  const newUnion = repository.create(
    jsonData[2].data.map((item: any) => ({
      ...item,
      upazillaId: item.upazilla_id,
      bnName: item.bn_name,
    }))
  );
  const save = await repository.save(newUnion);

  return res.status(200).json({
    success: true,
    msg: "Create a new Union",
    data: save,
  });
});

// @desc Update a single Union
// @route PUT /api/v1/Union/:id
// @access Public
// export const updateUnion = asyncHandler(async (req: Request, res: Response) => {
//   const { id } = req.params;
//   const connection = await getDBConnection();

//   const repository = await connection.getRepository(UnionEntity);

//   const result = await repository.findOneBy({ id });

//   const updateData = await repository.merge(result, req.body);

//   await repository.save(updateData);

//   return res.status(200).json({
//     success: true,
//     msg: `Update a single Union of id ${req.params.id}`,
//     data: updateData,
//   });
// });

// @desc Delete a single Union
// @route DELETE /api/v1/Union/:id
// @access Public
// export const deleteUnion = asyncHandler(async (req: Request, res: Response) => {
//   const { id } = req.params;
//   const connection = await getDBConnection();
//   const repository = await connection.getRepository(UnionEntity);

//   const result = await repository.findOneBy({ id });
//   if (!result) {
//     throw new Error(`Resource not found of id #${req.params.id}`);
//   }

//   await repository.delete({ id });

//   return res.status(200).json({
//     success: true,
//     msg: `Delete a single Union of id ${req.params.id}`,
//     data: result,
//   });
// });
