import fs from "fs";

import { Request, Response, NextFunction } from "express";
import { DivisionEntity } from "../model/division.entity";
import { asyncHandler } from "../../../../middlewares/async.middleware";
import { getDBConnection } from "../../../../config/db";
import { DistrictEntity } from "../../districts/model/district.entity";
import { UpazilaEntity } from "../../upazilas/model/upazila.entity";
import { UnionEntity } from "../../unions/model/union.entity";

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

    // const qb = repository.createQueryBuilder("division");
    // qb.select([
    //   "division",
    //   "division.name",
    //   "division.bnName",
    //   "districts.id",
    //   "districts.name",
    //   "districts.bnName",
    //   "upazilas.id",
    //   "upazilas.name",
    //   "upazilas.bnName",
    //   "unions.id",
    //   "unions.name",
    //   "unions.bnName",
    // ]);

    // qb.leftJoin("division.districts", "districts");
    // qb.leftJoin("districts.upazilas", "upazilas");
    // qb.leftJoin("upazilas.unions", "unions");

    // qb.where({ id });
    // const result = await qb.getOne();

    const result = await repository.findOneBy({ id });

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
export const syncGeoLocation = asyncHandler(
  async (req: any, res: Response, next: NextFunction) => {
    const dbconnection = await getDBConnection();

    const queryRunner = dbconnection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Divisions start
      const fileDivisions = fs.readFileSync(
        process.cwd() + "/database/fack-data/divisions.json",
        "utf8"
      );
      const jsonDataDivisions = JSON.parse(fileDivisions);

      const repositoryDivisions = dbconnection.getRepository(DivisionEntity);

      const newDivision = repositoryDivisions.create(
        jsonDataDivisions[2].data.map((item: any) => ({
          name: item.name.trim(),
          url: item.url.trim(),
          bnName: item.bn_name.trim(),
        }))
      );
      await queryRunner.manager.save(newDivision);
      // Divisions end
      // ...................................................................
      // district start

      const fileDistrict = fs.readFileSync(
        process.cwd() + "/database/fack-data/districts.json",
        "utf8"
      );
      const jsonDataDistrict = JSON.parse(fileDistrict);

      const repositoryDistrict = dbconnection.getRepository(DistrictEntity);

      const newDistrict = repositoryDistrict.create(
        jsonDataDistrict[2].data.map((item: any) => ({
          name: item.name.trim(),
          divisionId: item.division_id,
          bnName: item.bn_name.trim(),
          lat: item.lat.trim(),
          lon: item.lon.trim(),
        }))
      );

      await queryRunner.manager.save(newDistrict);
      // district end
      // ...................................................................
      // upazila start
      const fileupazilas = fs.readFileSync(
        process.cwd() + "/database/fack-data/upazilas.json",
        "utf8"
      );
      const jsonDataUpazilas = JSON.parse(fileupazilas);

      const repositoryUpazila = dbconnection.getRepository(UpazilaEntity);

      const newUpazila = repositoryUpazila.create(
        jsonDataUpazilas[2].data.map((item: any) => ({
          name: item.name.trim(),
          districtId: item.district_id,
          bnName: item.bn_name.trim(),
          url: item.url.trim(),
        }))
      );
      await queryRunner.manager.save(newUpazila);
      // upazila end
      // ...................................................................
      // union start
      const fileUnions = fs.readFileSync(
        process.cwd() + "/database/fack-data/unions.json",
        "utf8"
      );
      const jsonDataUnions = JSON.parse(fileUnions);
      const repositoryUnion = dbconnection.getRepository(UnionEntity);

      const newUnion = repositoryUnion.create(
        jsonDataUnions[2].data.map((item: any) => ({
          name: item.name.trim(),
          upazillaId: item.upazilla_id,
          bnName: item.bn_name.trim(),
          url: item.url.trim(),
        }))
      );
      // union end

      await queryRunner.manager.save(newUnion);

      await queryRunner.commitTransaction();

      // Send success response
      return res.status(201).json({
        success: true,
        msg: "Division, Upazila and Union created",
      });
    } catch (error) {
      console.error("Transaction failed:", error);
      await queryRunner.rollbackTransaction();
      // Send error response
      return res
        .status(500)
        .json({ success: false, msg: "Could not sync geolocation data" });
    } finally {
      await queryRunner.release();
    }
  }
);

// @desc Create a single Division
// @route POST /api/v1/Division
// @access Public
// export const syncGeoLocation = asyncHandler(async (req: any, res: Response) => {
//   const dbconnection = await getDBConnection();

//   const fileDivisions = fs.readFileSync(
//     process.cwd() + "/database/fack-data/divisions.json",
//     "utf8"
//   );
//   const jsonDataDivisions = JSON.parse(fileDivisions);

//   const repositoryDivisions = dbconnection.getRepository(DivisionEntity);

//   const newDivision = repositoryDivisions.create(
//     jsonDataDivisions[2].data.map((item: any) => ({
//       ...item,
//       bnName: item.bn_name,
//     }))
//   );

//   const saveDivisions = await repositoryDivisions.save(newDivision);

//   console.log("saveDivisions", saveDivisions);

//     if (!saveDivisions) {
//     throw new Error(`Resource not found of id #${req.params.id}`);
//   }

//   const fileFistrict = fs.readFileSync(
//     process.cwd() + "/database/fack-data/districts.json",
//     "utf8"
//   );
//   const jsonDataDistrict = JSON.parse(fileFistrict);

//   const repositoryDistrict = dbconnection.getRepository(DistrictEntity);

//   const newDistrict = repositoryDistrict.create(
//     jsonDataDistrict[2].data.map((item: any) => ({
//       ...item,
//       divisionId: item.division_id,
//       bnName: item.bn_name,
//     }))
//   );
//   const saveDistrict = await repositoryDistrict.save(newDistrict);

//   const fileupazilas = fs.readFileSync(
//     process.cwd() + "/database/fack-data/upazilas.json",
//     "utf8"
//   );
//   const jsonDataUpazilas = JSON.parse(fileupazilas);

//   const repositoryUpazila = dbconnection.getRepository(UpazilaEntity);

//   const newUpazila = repositoryUpazila.create(
//     jsonDataUpazilas[2].data.map((item: any) => ({
//       ...item,
//       districtId: item.district_id,
//       bnName: item.bn_name,
//     }))
//   );

//   console.log("🚀 ~ newUpazila:", newUpazila);

//   const saveUpazila = await repositoryUpazila.save(newUpazila);

//   const fileUnions = fs.readFileSync(
//     process.cwd() + "/database/fack-data/unions.json",
//     "utf8"
//   );
//   const jsonDataUnions = JSON.parse(fileUnions);

//   const repositoryUnion = dbconnection.getRepository(UnionEntity);

//   const newUnion = repositoryUnion.create(
//     jsonDataUnions[2].data.map((item: any) => ({
//       ...item,
//       upazillaId: item.upazilla_id,
//       bnName: item.bn_name,
//     }))
//   );
//   const saveUnion = await repositoryUnion.save(newUnion);

//   return res.status(200).json({
//     success: true,
//     msg: "Sync all geolocation data",
//     data: {
//       divisions: saveDivisions,
//       district: saveDistrict,
//       upazila: saveUpazila,
//       union: saveUnion,
//     },
//   });
// });

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
