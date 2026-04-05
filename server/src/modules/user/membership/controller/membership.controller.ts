import { Request, Response, NextFunction } from 'express';
import { asyncHandler } from '@/middlewares/async.middleware';
import { getDBConnection } from '@/config/db';
import { logger } from '@/middlewares/logger';
import { CustomRequest } from '@/enums/custom-request-type';
import { MembershipEntity } from '../model/membership.entity';
import { createMembershipValidationSchema } from '@/validation/membership/memberShipValidation';

// @desc Get all Membership
// @route GET /api/v1/Membership
// @access Public
export const getMemberships = asyncHandler(async (req: Request, res: Response) => {
  logger.info(`Service: getMemberships ${req.method} ${req.url}`);

  const connection = await getDBConnection();
  const repository = connection.getRepository(MembershipEntity);
  const result = await repository.find();

  return res.status(200).json({
    success: true,
    message: 'Get all Membership',
    data: result,
  });
});

// @desc Get a single Membership
// @route GET /api/v1/Membership/:id
// @access Public
export const getMembership = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    logger.info(`Service: getMembership ${req.method} ${req.url}`);

    const { id } = req.params;
    const connection = await getDBConnection();
    const repository = await connection.getRepository(MembershipEntity);
    const result = await repository.findOneBy({ id });

    if (!result) {
      throw new Error(`Resource not found of id #${req.params.id}`);
    }

    return res.status(200).json({
      success: true,
      message: `Get a single Membership of id ${req.params.id}`,
      data: result,
    });
  },
);

// async applyMembershipBenefits(userId: string, orderAmount: number, basePoints: number) {
//   const userMembership = await this.getUserMembership(userId);

//   if (!userMembership) {
//     return {
//       discount: 0,
//       bonusPoints: basePoints,
//       freeShipping: false,
//       membershipName: null,
//     };
//   }

//   const { membership } = userMembership;

//   const discount = orderAmount * (membership.discountPercentage / 100);
//   const bonusPoints = Math.floor(basePoints * membership.bonusPointsMultiplier);

//   return {
//     discount,
//     bonusPoints,
//     freeShipping: membership.freeShipping,
//     membershipName: membership.name,
//   };
// }

// async assignMembershipToUser(userId: string, membershipId: string): Promise<void> {
//   const membership = await this.membershipRepo.findOne({ where: { id: membershipId } });

//   const start = new Date();
//   const end = new Date();
//   end.setDate(start.getDate() + membership.durationDays);

//   const userMembership = this.userMembershipRepo.create({
//     user: { id: userId },
//     membership,
//     startDate: start,
//     endDate: end,
//   });

//   await this.userMembershipRepo.save(userMembership);
// }

// ## this funtion should be apply ordercreate
// const basePoints = Math.floor(orderAmount); // 1 point per $1
// const membershipBenefits = await this.membershipService.applyMembershipBenefits(
//   userId,
//   orderAmount,
//   basePoints,
// );

// const finalAmount = orderAmount - membershipBenefits.discount;

// // Save discount and points to order
// await this.orderRepo.save({
//   userId,
//   amount: orderAmount,
//   finalAmount,
//   membershipDiscount: membershipBenefits.discount,
//   earnedPoints: membershipBenefits.bonusPoints,
// });

// @Post('/assign')
// async assign(
//   @Body('userId') userId: string,
//   @Body('membershipId') membershipId: string,
// ) {
//   return this.membershipService.assignMembershipToUser(userId, membershipId);
// }

// @desc Create a single Membership
// @route POST /api/v1/Membership
// @access Public
export const createMembership = asyncHandler(async (req: CustomRequest, res: Response) => {
  logger.info(`Service: createMembership ${req.method} ${req.url}`);

  const validation = createMembershipValidationSchema.safeParse(req.body);

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
  const connection = await getDBConnection();
  const repository = connection.getRepository(MembershipEntity);

  const newMembership = repository.create(validation.data);
  const save = await repository.save(newMembership);

  return res.status(200).json({
    success: true,
    message: 'Create a new Membership',
    data: save,
  });
});

// @desc Update a single Membership
// @route PUT /api/v1/Membership/:id
// @access Public
export const updateMembership = asyncHandler(async (req: Request, res: Response) => {
  logger.info(`Service: updateMembership ${req.method} ${req.url}`);

  const { id } = req.params;
  const connection = await getDBConnection();

  const validation = createMembershipValidationSchema.safeParse({
    ...req.body,
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

  const repository = await connection.getRepository(MembershipEntity);
  const result = await repository.findOneBy({ id });

  if (!result) {
    throw new Error(`Resource not found of id #${req.params.id}`);
  }

  const updateData = await repository.merge(result, validation.data);
  await repository.save(updateData);
  return res.status(200).json({
    success: true,
    message: `Update a single Membership of id ${req.params.id}`,
    data: updateData,
  });
});

// @desc Delete a single Membership
// @route DELETE /api/v1/Membership/:id
// @access Public
export const deleteMembership = asyncHandler(async (req: Request, res: Response) => {
  logger.info(`Service: deleteMembership ${req.method} ${req.url}`);

  const { id } = req.params;
  const connection = await getDBConnection();
  const repository = await connection.getRepository(MembershipEntity);

  const result = await repository.findOneBy({ id });

  if (!result) {
    throw new Error(`Resource not found of id #${req.params.id}`);
  }

  await repository.delete({ id });

  return res.status(200).json({
    success: true,
    message: `Delete a single Membership of id ${req.params.id}`,
    data: result,
  });
});
