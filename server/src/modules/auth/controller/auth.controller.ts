import "reflect-metadata";
import { Request, Response, NextFunction } from "express";
import { v4 as uuidv4 } from "uuid";
import {
  sendCookiesResponse,
  hashedPassword,
  getSignJwtToken,
  matchPassword,
  getResetSignJwtToken,
  getResetVerifyJwtToken,
} from "../../../middlewares/auth.middleware";
import { asyncHandler } from "../../../middlewares/async.middleware";
import { sendEmail } from "../../../middlewares/sendMail.middleware";
import { UserEntity } from "../model/user.entity";
import { getDBConnection } from "../../../config/db";
import { UpdateUserDto } from "../model/dtos";
import {
  updateUserValidationSchema,
  userValidationSchema,
} from "../../../validation";
import { UserActivityEntity } from "../model/user-activity.entity";
import { join } from "path";
import { FileEntity } from "../../other/file/model/file.entity";
import fs from "fs";

// @desc Register User
// @route POST /api/v1/auth/register
// @access Public
export const register = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const connection = await getDBConnection();
    const { password, username } = req.body;
    const validation = userValidationSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(401).json({
        message: validation.error.formErrors,
      });
    }
    const userRepository = connection.getRepository(UserEntity);
    const findUser = await userRepository.findOne({
      where: { username },
    });

    if (findUser) {
      throw new Error("User already registered");
    }

    const createUser = await userRepository.create({
      ...req.body,
      password: await hashedPassword(password),
    });

    if (!createUser) {
      throw new Error("User Create not successful");
    }

    const user = await userRepository.save(createUser);

    const token = getSignJwtToken(user);
    const cookies = sendCookiesResponse(token, res);

    if (!cookies) {
      throw new Error("Token not set in cookies");
    }

    delete user.password;
    return res.status(200).json({
      success: true,
      msg: "Create a new Register",
      data: user,
      accessToken: token,
    });
  }
);

// @desc Get Users
// @route GET /api/v1/auth/users
// @access Public
export const getUsers = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const connection = await getDBConnection();

    const userRepository = connection.getRepository(UserEntity);

    const results = await userRepository.find({
      relations: {
        products: true,
      },
      select: {
        id: true,
        name: true,
        username: true,
        email: true,
        phone: true,
        type: true,
        point: true,
        image: true,
        role: true,
        status: true,
        lastLogin: true,
        lastLogout: true,
        ipAddress: true,
        diviceId: true,
        dob: true,
        // products: true,
      },
    }); // populate is relation array data

    return res.status(200).json({
      success: true,
      msg: "Get all users",
      data: results,
    });
  }
);

// // @desc Get a single user
// // @route GET /api/v1/auth/users/:id
// // @access Private
export const getUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const connection = await getDBConnection();

    const userRepository = connection.getRepository(UserEntity);

    const user = await userRepository.findOne({ where: { id: req.params.id } });

    if (!user) {
      throw new Error("User is not found");
    }

    return res.status(200).json({
      success: true,
      msg: "Get a user",
      data: user,
    });
  }
);

// // @desc Login User
// // @route POST /api/v1/auth/login
// // @access Public
export const login = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const connection = await getDBConnection();
      const { username, password } = req.body;

      const ip =
        (req.headers["x-forwarded-for"] as string) ||
        req.socket.remoteAddress ||
        null;

      const userRepository = connection.getRepository(UserEntity);
      const userActivityRepository =
        connection.getRepository(UserActivityEntity);

      const oldUser = await userRepository.findOne({ where: { username } });

      if (!oldUser) {
        res.status(404);
        throw new Error(`Username ${username} not found`);
      }

      const isMatch = await matchPassword(password, oldUser);

      if (!isMatch) {
        res.status(401);
        throw new Error("Authorization is not valid!");
      }

      const token = getSignJwtToken(oldUser);
      const cookies = sendCookiesResponse(token, res);

      if (!cookies) {
        res.status(500);
        throw new Error("Token not set in cookies");
      }

      oldUser.lastLogin = new Date();
      oldUser.ipAddress = ip;

      await userRepository.save(oldUser);

      // user activity start
      const userActivity = userActivityRepository.create({
        timestamp: new Date(),
        userId: oldUser.id,
      });
      await userActivityRepository.save(userActivity);
      // user activity end

      delete oldUser.password;

      return res.status(200).json({
        success: true,
        msg: "Login Successful",
        data: oldUser,
        accessToken: token,
      });
    } catch (err) {
      next(err);
    }
  }
);
// // @desc Logout User
// // @route GET /api/v1/auth/logout
// // @access Private
export const logout = asyncHandler(
  async (req: any, res: Response, next: NextFunction) => {
    const connection = await getDBConnection();
    const userRepository = await connection.getRepository(UserEntity);

    Object.entries(req.cookies).forEach(([key, value]) => res.clearCookie(key));

    const user = await userRepository.findOne({ where: { id: req.id } });

    if (!user) {
      throw new Error("User is not found");
    }

    await userRepository.save({ id: user.id, lastLogout: new Date() });

    return res.status(200).json({
      success: true,
      msg: "Logout Successful",
      data: null,
    });
  }
);

// // @desc Get me
// // @route GET /api/v1/auth/me
// // @access Private
export const getMe = asyncHandler(
  async (req: any, res: Response, next: NextFunction) => {
    const connection = await getDBConnection();

    const userRepository = connection.getRepository(UserEntity);

    const qb = userRepository.createQueryBuilder("user");
    qb.select([
      "user.id",
      "user.name",
      "user.username",
      "user.email",
      "user.phone",
      "user.type",
      "user.point",
      "user.role",
      "user.image",
      "user.dob",
      "user.gender",
      "user.status",
      "user.lastLogin",
      "user.lastLogout",
      "user.lastLogout",

      "orders.discountAmount",
      "orders.netAmount",
      "orders.note",
      "orders.orderDate",
      "orders.orderTax",
      "orders.orderTotalAmount",
      "orders.paymentMethod",
      "orders.paymentStatus",
      "orders.shippingAmount",
      "orders.status",
      "orders.trackingNo",

      "products.name",
      "products.type",
      "products.createdAt",
      "products.description",
      "products.enableReview",
      "products.images",
      "products.limitPurchaseQty",
      "products.alertQty",
      "products.shortDescription",
      "products.status",
      "products.tags",
      "products.urlSlug",

      "product",
      "productVariants.price",

      "discount.discountType",
      "discount.value",
      "tax.value",
      "reviews",

      "orderShippingAddress.name",
      "orderShippingAddress.type",
      "orderShippingAddress.phoneNo",
      "orderShippingAddress.email",
      "orderShippingAddress.country",
      "orderShippingAddress.alternativePhoneNo",
      "orderShippingAddress.address",
      "orderShippingAddress.phoneNo",

      "shippingAddress.id",
      "shippingAddress.name",
      "shippingAddress.phoneNo",
      "shippingAddress.email",
      "shippingAddress.country",
      "shippingAddress.alternativePhoneNo",
      "shippingAddress.address",
      "shippingAddress.phoneNo",
      "shippingAddress.type",
      "shippingAddress.status",
      "shippingAddress.divisionId",

      "orderDeliveries",
      "wishlists",

      "orderItems.purchasePrice",
      "orderItems.discountA",
      "orderItems.price",
      "orderItems.qty",
      "orderItems.tax",
      "orderItems.productId",

      "orderProduct.name",
      "orderTrackings.location",
      "orderTrackings.createdAt",
      "orderTrackings.status",
      "deliveryMan.name",
      // "payments",
      "size.name",
      "color.name",
    ]);

    qb.leftJoin("user.orders", "orders");

    qb.leftJoin("orders.orderItems", "orderItems");
    qb.leftJoin("orderItems.product", "orderProduct");
    qb.leftJoin("orders.orderTrackings", "orderTrackings");
    qb.leftJoin("orders.deliveryMan", "deliveryMan");
    qb.leftJoin("orders.shippingAddress", "orderShippingAddress");

    qb.leftJoin("orderItems.size", "size");
    qb.leftJoin("orderItems.color", "color");

    qb.leftJoin("user.products", "products");
    qb.leftJoin("user.shippingAddress", "shippingAddress");
    qb.leftJoin("user.orderDeliveries", "orderDeliveries");
    qb.leftJoin("user.wishlists", "wishlists");
    qb.leftJoin("wishlists.product", "product");
    qb.leftJoin("product.productVariants", "productVariants");
    qb.leftJoin("product.discount", "discount");
    qb.leftJoin("product.tax", "tax");
    qb.leftJoin("product.reviews", "reviews");
    qb.where({ id: req.id });

    const user = await qb.getOne();

    if (!user) {
      throw new Error("Authorization is not Valid!");
    }

    return res.status(200).json({
      success: true,
      msg: "I am Here",
      data: user,
    });
  }
);

// // @desc Forget password
// // @route POST /api/v1/auth/forgot-password
// // @access Private
export const forgotPassword = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;

    const connection = await getDBConnection();
    const userRepository = connection.getRepository(UserEntity);
    const findMail = await userRepository.findOne({ where: { email } });

    if (!findMail) {
      throw new Error("User with this email does not exist");
    }

    const resetToken = getResetSignJwtToken(findMail.email);

    if (!resetToken) {
      throw new Error("Reset token not Generated");
    }

    const updateData = await userRepository.merge(findMail, {
      ...req.body,
      resetToken: resetToken,
    });

    await userRepository.save(updateData);
    // console.log("req.hostname", req);
    // console.log("req.psot", req.get("host"));

    const resetUrl = `${req.protocol}://${req.headers.origin}/reset-password/${resetToken}`;

    let mailOptions = {
      to: findMail.email,
      from: `${process.env.MAIL_FROM_NAME} <${process.env.MAIL_FROM_ADDRESS}>`,
      subject: "Password Reset",
      text: `You are receiving this email because you (or someone else) have requested the reset of the password for your account. Please click on the following link, or paste it into your browser to complete the process within one hour of receiving it: ${resetUrl}`,
    };

    await sendEmail(mailOptions);

    return res.status(200).json({
      success: true,
      msg: "Forget password successful. Please check your email address",
      data: {},
    });
  }
);

// // @desc Reset password
// // @route POST /api/v1/auth/reset-password/:token
// // @access Private
export const resetPassword = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { password } = req.body;
    const { token } = req.params;
    const connection = await getDBConnection();
    const userRepository = connection.getRepository(UserEntity);

    if (token) {
      getResetVerifyJwtToken(token, res);
    }

    const newPassword = await hashedPassword(password);
    const user = await userRepository.findOne({
      where: { resetToken: token },
    });

    if (!user) {
      throw new Error("Invalid or expired reset token");
    }

    const updateData = await userRepository.merge(user, {
      password: newPassword,
      resetToken: null,
    });

    await userRepository.save(updateData);

    return res.status(200).json({
      success: true,
      msg: "Reset password",
      data: {},
    });
  }
);

// // @desc Update password
// // @route PUT /api/v1/auth/update-password
// // @access Private
export const updatePassword = asyncHandler(
  async (req: any, res: Response, next: NextFunction) => {
    const { newPassword, currentPassword } = req.body;

    // const validation = userValidationSchema.safeParse(req.body);

    // if (!validation.success) {
    //   return res.status(401).json({
    //     message: validation.error.formErrors,
    //   });
    // }

    const connection = await getDBConnection();
    const userRepository = connection.getRepository(UserEntity);

    const user = await userRepository.findOne({ where: { id: req.id } });

    if (!user) {
      throw new Error("User not found");
    }

    if (!newPassword || !(await matchPassword(currentPassword, user))) {
      throw new Error("Current password is incorrect");
    }

    const password = await hashedPassword(newPassword);

    const updateData = await userRepository.merge(user, {
      password: password,
    });

    await userRepository.save(updateData);

    return res.status(200).json({
      success: true,
      msg: "Update password",
    });
  }
);

// // @desc Update a single user
// // @route PUT /api/v1/auth/users/:id
// // @access Public
export const updateUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const connection = await getDBConnection();
    const { id } = req.params;

    const validation = updateUserValidationSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(401).json({
        message: validation.error.formErrors,
      });
    }

    const userRepository = await connection.getRepository(UserEntity);

    const user = await userRepository.findOneBy({ id });

    if (!user) {
      throw new Error("User is not found");
    }
    const updateData = await userRepository.merge(user, validation.data);

    await userRepository.save(updateData);

    return res.status(200).json({
      success: true,
      msg: `Update a User of id ${req.params.id}`,
      data: updateData,
    });
  }
);

// @desc Delete a single user
// @route DELETE /api/v1/auth/users/:id
// @access Public
export const deleteUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const connection = await getDBConnection();
    const { id } = req.params;

    const userRepository = await connection.getRepository(UserEntity);

    const user = await userRepository.findOne({ where: { id } });

    if (!user) {
      throw new Error(`Resource not found of id #${req.params.id}`);
    }

    if (user.image) {
      const repository = connection.getRepository(FileEntity);
      const directory = join(process.cwd(), "/public/uploads");
      const filePath = `${directory}/${user.image}`;
      const [deleteFile] = await Promise.all([
        repository.findOne({ where: { filename: user.image } }),
        fs.promises.unlink(filePath),
      ]);
      await repository.remove(deleteFile);
    }

    await userRepository.delete({ id });

    return res.status(200).json({
      success: true,
      msg: `Delete a user of id ${req.params.id}`,
      data: user,
    });
  }
);
