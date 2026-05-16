import { NextFunction, Request, Response } from 'express';
import fs from 'fs';
import { join } from 'path';
import 'reflect-metadata';
import { getDBConnection } from '@/config/db';
import { CustomRequest } from '@/enums/custom-request-type';
import { NotificationType } from '@/enums/notification-type.enum';
import { asyncHandler } from '@/middlewares/async.middleware';
import {
  getResetSignJwtToken,
  getResetVerifyJwtToken,
  getSignJwtToken,
  getRefreshToken,
  hashedPassword,
  matchPassword,
  sendCookiesResponse,
} from '@/middlewares/auth.middleware';
import jwt from 'jsonwebtoken';
import { logger } from '@/middlewares/logger';
import { sendEmail } from '@/utils/sendMail';
import { updateUserValidationSchema, userValidationSchema } from '@/validation';
import { forgotPasswordValidationSchema } from '@/validation/user/forgotPasswordValidation';
import { loginValidationSchema } from '@/validation/user/loginValidation';
import { resetPasswordValidationSchema } from '@/validation/user/resetPasswordValidation';
import { updatePasswordValidationSchema } from '@/validation/user/updatePasswordValidation';
import { FileEntity } from '@/modules/system/other/file/model/file.entity';
import { NotificationEntity } from '@/modules/system/other/notification/model/notification.entity';
import { RoleEnum } from '../enums/role.enum';
import { UserActivityEntity } from '../model/user-activity.entity';
import { UserEntity } from '../model/user.entity';
import { userService } from '../service/user.service';
import { cacheService, CacheService } from '@/utils/cache.service';

// @desc Register User
// @route POST /api/v1/auth/register
// @access Public
export const register = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  logger.info(`Service: register ${req.method} ${req.url}`);

  const connection = await getDBConnection();

  const validation = userValidationSchema.safeParse(req.body);

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

  const userRepository = connection.getRepository(UserEntity);
  const findUser = await userRepository.findOne({
    where: { username: validation.data.username },
  });

  if (findUser) {
    throw new Error('User already registered');
  }

  const verificationToken = getResetSignJwtToken(validation.data.email);

  const createUser = await userRepository.create({
    ...validation.data,
    password: await hashedPassword(validation.data.password),
    verificationToken: verificationToken,
    isVerified: false,
  });

  if (!createUser) {
    throw new Error('User Create not successful');
  }

  const user = await userRepository.save(createUser);

  // Send Verification Email
  const verifyUrl = `${req.protocol}://${req.get('origin')}/verify-email/${verificationToken}`;
  const mailOptions = {
    to: user.email,
    from: `${process.env.MAIL_FROM_NAME} <${process.env.MAIL_FROM_ADDRESS}>`,
    subject: 'Email Verification',
    text: `Please verify your email by clicking the following link: ${verifyUrl}`,
  };

  try {
    await sendEmail(mailOptions);
  } catch (error) {
    logger.error(`Email send failed: ${error}`);
    // Don't block registration on email fail? Or distinct error?
    // Proceeding for now.
  }

  // Create Register Notification
  const notificationRepository = connection.getRepository(NotificationEntity);
  const registerNotification = notificationRepository.create({
    title: 'Welcome!',
    message: 'User Registration Successful. Please verify your email.',
    type: NotificationType.UserRegistration,
    userId: user.id,
    isRead: false,
  });
  await notificationRepository.save(registerNotification);

  // Notify Admins about New User
  const admins = await userRepository.find({ where: { role: RoleEnum.Admin } });
  const adminNotifications = admins.map((admin: UserEntity) => {
    return notificationRepository.create({
      title: 'New User Registered',
      message: `A new user ${user.name} (${user.email}) has registered.`,
      type: NotificationType.AdminNewUser,
      userId: admin.id,
      isRead: false,
    });
  });
  if (adminNotifications.length > 0) {
    await notificationRepository.save(adminNotifications);
  }

  const token = getSignJwtToken(user);
  const refreshToken = getRefreshToken(user);

  // Save refresh token to DB
  user.refreshToken = refreshToken;
  await userRepository.save(user);

  sendCookiesResponse(res, token, refreshToken);

  delete user.password;
  delete user.refreshToken;

  return res.status(200).json({
    success: true,
    message: 'User Registered Successfully. Please check your email for verification.',
    data: user,
    accessToken: token,
    refreshToken: refreshToken,
  });
});

// @desc Get Users
// @route GET /api/v1/auth/users
// @access Public
export const getUsers = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  logger.info(`Service: getUsers ${req.method} ${req.url}`);

  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const role = req.query.role as string;
  const search = req.query.search as string;

  const { users, meta } = await userService.getAllUsers(page, limit, { role, search });

  return res.status(200).json({
    success: true,
    message: 'Get all users',
    data: users,
    meta,
  });
});

// // @desc Get a single user
// // @route GET /api/v1/auth/users/:id
// // @access Private
export const getUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  logger.info(`Service: getUser ${req.method} ${req.url}`);

  const connection = await getDBConnection();

  const userRepository = connection.getRepository(UserEntity);

  const user = await userRepository.findOne({ where: { id: req.params.id } });

  if (!user) {
    throw new Error('User is not found');
  }

  return res.status(200).json({
    success: true,
    message: 'Get a user',
    data: user,
  });
});

// // @desc Get a single user
// // @route GET /api/v1/auth/users/:id
// // @access Private
export const getUserByEmail = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    logger.info(`Service: getUserByEmail ${req.method} ${req.url}`);

    const { email } = req.body;

    const connection = await getDBConnection();

    const userRepository = connection.getRepository(UserEntity);

    let user = await userRepository.findOne({ where: { email } });

    if (!user) {
      const createUser = await userRepository.create({
        ...req.body,
      });

      user = await userRepository.save(createUser);
    }

    const token = getSignJwtToken(user);
    const refreshToken = getRefreshToken(user);

    // Save refresh token to DB
    user.refreshToken = refreshToken;
    await userRepository.save(user);

    sendCookiesResponse(res, token, refreshToken);

    return res.status(200).json({
      success: true,
      message: 'user create by email successfully',
      data: { ...user, accessToken: token, refreshToken: refreshToken },
    });
  },
);

// // @desc Get a single user
// // @route GET /api/v1/auth/users/:id
// // @access Private
// export const createUserByEmail = asyncHandler(
//   async (req: Request, res: Response, next: NextFunction) => {

//     const { email } = req.body;

//     console.log("🚀 ~ email:", email)

//     const connection = await getDBConnection();

//     const userRepository = connection.getRepository(UserEntity);

//     const user = await userRepository.findOne({ where: { email } });
//     console.log("🚀 ~ user:", user)

//     // if (!user) {
//     //   throw new Error("User is not found");
//     // }

//     return res.status(200).json({
//       success: true,
//       message: "Get a user",
//       data: user,
//     });
//   }
// );

// // @desc Login User
// // @route POST /api/v1/auth/login
// // @access Public
export const login = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  logger.info(`Service: login ${req.method} ${req.url}`);

  const connection = await getDBConnection();
  const { username, password } = req.body;

  const validation = loginValidationSchema.safeParse(req.body);

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

  const ip = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || null;

  const userRepository = connection.getRepository(UserEntity);
  const userActivityRepository = connection.getRepository(UserActivityEntity);

  const oldUser = await userRepository.findOne({
    where: { username: validation.data.username },
  });

  if (!oldUser) {
    res.status(404);
    throw new Error(`Username ${username} not found`);
  }

  // Check if account is locked
  if (oldUser.blockUntil && oldUser.blockUntil > new Date()) {
    res.status(403);
    throw new Error(
      'Account is temporarily locked due to multiple failed login attempts. Please try again later.',
    );
  }

  const isMatch = await matchPassword(password, oldUser);

  if (!isMatch) {
    oldUser.failedLoginAttempts = (oldUser.failedLoginAttempts || 0) + 1;

    if (oldUser.failedLoginAttempts >= 5) {
      oldUser.blockUntil = new Date(Date.now() + 15 * 60 * 1000); // Lock for 15 minutes

      // Notify Admins about Security Alert
      const notificationRepository = connection.getRepository(NotificationEntity);
      const admins = await userRepository.find({ where: { role: RoleEnum.Admin } });
      const adminNotifications = admins.map((admin: UserEntity) => {
        return notificationRepository.create({
          title: 'Security Alert: Failed Login Attempts',
          message: `User ${oldUser.email} has failed to login 5 times. Account locked for 15 minutes.`,
          type: NotificationType.AdminSecurityAlert,
          userId: admin.id,
          isRead: false,
        });
      });
      if (adminNotifications.length > 0) {
        await notificationRepository.save(adminNotifications);
      }
    }

    await userRepository.save(oldUser);

    res.status(401);
    throw new Error('Authorization is not valid!');
  }

  // Reset failed attempts on successful login
  oldUser.failedLoginAttempts = 0;
  oldUser.blockUntil = undefined;
  // oldUser.lastLogin updated below...

  const token = getSignJwtToken(oldUser);
  const refreshToken = getRefreshToken(oldUser);

  // Save refresh token to DB
  oldUser.refreshToken = refreshToken;
  await userRepository.save(oldUser);

  sendCookiesResponse(res, token, refreshToken);

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
  delete oldUser.refreshToken;

  return res.status(200).json({
    success: true,
    message: 'Login Successful',
    data: oldUser,
    accessToken: token,
    refreshToken: refreshToken,
  });
});

// // @desc Login by google
// // @route POST /api/v1/auth/auth/google
// // @access Public
// export const googleAuth = asyncHandler(
//   async (req: Request, res: Response, next: NextFunction) => {

//     passport.authenticate("google", { scope: ["profile"] });
//   }
// );

// // @desc Login by google
// // @route POST /api/v1/auth/auth/google
// // @access Public
// export const googleAuthCallBack = asyncHandler(
//   async (req: Request, res: Response, next: NextFunction) => {

//     // Successful authentication, redirect home.
//     res.redirect("/");
//   }
// );

// // @desc Logout User
// // @route GET /api/v1/auth/logout
// // @access Private
export const logout = asyncHandler(
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    logger.info(`Service: logout ${req.method} ${req.url}`);

    const connection = await getDBConnection();
    const userRepository = await connection.getRepository(UserEntity);

    const user = await userRepository.findOne({ where: { id: req.id } });

    if (user) {
      user.refreshToken = null as any;
      await userRepository.save({ id: user.id, lastLogout: new Date(), refreshToken: null });
    }

    Object.entries(req.cookies).forEach(([key, value]) => res.clearCookie(key));
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');

    return res.status(200).json({
      success: true,
      message: 'Logout Successful',
      data: null,
    });
  },
);

// @desc Refresh Token
// @route POST /api/v1/auth/refresh-token
// @access Public
export const refreshAccessToken = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies?.refreshToken || req.body.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({ success: false, message: 'Refresh token is missing' });
    }

    try {
      const decoded = jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET || (process.env.JWT_SECRET! + '_refresh'),
      ) as any;

      const connection = await getDBConnection();
      const userRepository = connection.getRepository(UserEntity);
      const user = await userRepository.findOne({ where: { id: decoded.id } });

      if (!user || user.refreshToken !== refreshToken) {
        return res.status(401).json({ success: false, message: 'Invalid refresh token' });
      }

      const newAccessToken = getSignJwtToken(user);
      const newRefreshToken = getRefreshToken(user);

      // Rotate refresh token
      user.refreshToken = newRefreshToken;
      await userRepository.save(user);

      sendCookiesResponse(res, newAccessToken, newRefreshToken);

      return res.status(200).json({
        success: true,
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      });
    } catch (error) {
      return res.status(401).json({ success: false, message: 'Invalid or expired refresh token' });
    }
  },
);

// // @desc Get me
// // @route GET /api/v1/auth/me
// // @access Private
export const getMe = asyncHandler(async (req: CustomRequest, res: Response, next: NextFunction) => {
  logger.info(`Service: getMe ${req.method} ${req.url}`);

  const cacheKey = CacheService.getUserKey(req.id!);
  const cachedUser = cacheService.get<UserEntity>(cacheKey);

  if (cachedUser) {
    logger.info(`Cache Hit: getMe for user ${req.id}`);
    return res.status(200).json({
      success: true,
      message: 'I am Here (from cache)',
      data: cachedUser,
    });
  }

  const user = await userService.getUserById(req.id!);

  if (!user) {
    throw new Error('Authorization is not Valid!');
  }

  cacheService.set(cacheKey, user);

  return res.status(200).json({
    success: true,
    message: 'I am Here',
    data: user,
  });
});

// // @desc Forget password
// // @route POST /api/v1/auth/forgot-password
// // @access Private
export const forgotPassword = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    logger.info(`Service: forgotPassword ${req.method} ${req.url}`);

    const validation = forgotPasswordValidationSchema.safeParse(req.body);

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
    const userRepository = connection.getRepository(UserEntity);

    const findMail = await userRepository.findOne({
      where: { email: validation.data.email },
    });

    if (!findMail) {
      throw new Error('User with this email does not exist');
    }

    const resetToken = getResetSignJwtToken(findMail.email);

    if (!resetToken) {
      throw new Error('Reset token not Generated');
    }

    const updateData = await userRepository.merge(findMail, {
      ...validation.data,
      resetToken: resetToken,
    });

    await userRepository.save(updateData);
    // console.log("req.hostname", req);
    // console.log("req.psot", req.get("host"));

    const resetUrl = `${req.protocol}://${req.headers.origin}/reset-password/${resetToken}`;

    const mailOptions = {
      to: findMail.email,
      from: `${process.env.MAIL_FROM_NAME} <${process.env.MAIL_FROM_ADDRESS}>`,
      subject: 'Password Reset',
      text: `You are receiving this email because you (or someone else) have requested the reset of the password for your account. Please click on the following link, or paste it into your browser to complete the process within one hour of receiving it: ${resetUrl}`,
    };

    await sendEmail(mailOptions);

    // Create Forgot Password Notification
    const notificationRepository = connection.getRepository(NotificationEntity);
    const forgotPasswordNotification = notificationRepository.create({
      title: 'Password Reset Requested',
      message: 'A password reset link has been sent to your email.',
      type: NotificationType.ForgotPassword,
      userId: findMail.id,
      isRead: false,
    });
    await notificationRepository.save(forgotPasswordNotification);

    return res.status(200).json({
      success: true,
      message: 'Forget password successful. Please check your email address',
      data: {},
    });
  },
);

// // @desc Reset password
// // @route POST /api/v1/auth/reset-password/:token
// // @access Private
export const resetPassword = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    logger.info(`Service: resetPassword ${req.method} ${req.url}`);

    const { token } = req.params;
    const connection = await getDBConnection();

    const validation = resetPasswordValidationSchema.safeParse(req.body);

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

    const userRepository = connection.getRepository(UserEntity);

    if (token) {
      getResetVerifyJwtToken(token as string, res);
    }

    const newPassword = await hashedPassword(validation.data.password);

    const user = await userRepository.findOne({
      where: { resetToken: token },
    });

    if (!user) {
      throw new Error('Invalid or expired reset token');
    }

    const updateData = await userRepository.merge(user, {
      password: newPassword,
      resetToken: null,
    });

    await userRepository.save(updateData);

    // Create Reset Password Notification
    const notificationRepository = connection.getRepository(NotificationEntity);
    const resetPasswordNotification = notificationRepository.create({
      title: 'Password Reset Successful',
      message: 'Your password has been successfully reset.',
      type: NotificationType.PasswordChanged,
      userId: user.id,
      isRead: false,
    });
    await notificationRepository.save(resetPasswordNotification);

    return res.status(200).json({
      success: true,
      message: 'Reset password',
      data: {},
    });
  },
);

// // @desc Update password
// // @route PUT /api/v1/auth/update-password
// // @access Private
export const updatePassword = asyncHandler(
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    logger.info(`Service: updatePassword ${req.method} ${req.url}`);

    const validation = updatePasswordValidationSchema.safeParse(req.body);

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
    const userRepository = connection.getRepository(UserEntity);

    const user = await userRepository.findOne({ where: { id: req.id } });

    if (!user) {
      throw new Error('User not found');
    }

    if (
      !validation.data.newPassword ||
      !(await matchPassword(validation.data.currentPassword, user))
    ) {
      throw new Error('Current password is incorrect');
    }

    const password = await hashedPassword(validation.data.newPassword);

    const updateData = await userRepository.merge(user, {
      password: password,
    });

    await userRepository.save(updateData);

    // Create Update Password Notification
    const notificationRepository = connection.getRepository(NotificationEntity);
    const updatePasswordNotification = notificationRepository.create({
      title: 'Password Changed',
      message: 'Your password has been changed successfully.',
      type: NotificationType.PasswordChanged,
      userId: user.id,
      isRead: false,
    });
    await notificationRepository.save(updatePasswordNotification);

    return res.status(200).json({
      success: true,
      message: 'Update password',
    });
  },
);

// // @desc Update a single user
// // @route PUT /api/v1/auth/users/:id
// // @access Public
export const updateUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  logger.info(`Service: updateUser ${req.method} ${req.url}`);

  const { id } = req.params;
  const validation = updateUserValidationSchema.safeParse(req.body);
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

  const updateData = await userService.updateUser(id, validation.data as any);
  if (!updateData) {
    throw new Error('User is not found');
  }

  // Invalidate cache
  cacheService.delete(CacheService.getUserKey(id));

  delete updateData.password;
  return res.status(200).json({
    success: true,
    message: `Profile updated successfully`,
    data: updateData,
  });
});

// @desc Delete a single user
// @route DELETE /api/v1/auth/users/:id
// @access Public
export const deleteUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  logger.info(`Service: deleteUser ${req.method} ${req.url}`);

  const { id } = req.params;
  const user = await userService.getUserById(id);

  if (!user) {
    throw new Error(`Resource not found of id #${req.params.id}`);
  }

  if (user.image) {
    const connection = await getDBConnection();
    const repository = connection.getRepository(FileEntity);
    const directory = join(process.cwd(), '/public/uploads');
    const filePath = `${directory}/${user.image}`;
    const deleteFile = await repository.findOne({ where: { filename: user.image } });
    
    if (deleteFile) {
        await Promise.all([
            repository.remove(deleteFile),
            fs.promises.unlink(filePath).catch(err => logger.error(`File unlink failed: ${err}`))
        ]);
    }
  }

  await userService.deleteUser(id);

  // Invalidate cache
  cacheService.delete(CacheService.getUserKey(id));

  return res.status(200).json({
    success: true,
    message: `Delete a user of id ${req.params.id}`,
    data: user,
  });
});

// @desc Verify Email
// @route POST /api/v1/auth/verify-email/:token
// @access Public
export const verifyEmail = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  logger.info(`Service: verifyEmail ${req.method} ${req.url}`);

  const { token } = req.params;
  const connection = await getDBConnection();
  const userRepository = await connection.getRepository(UserEntity);

  if (token) {
    getResetVerifyJwtToken(token as string, res);
  }

  const user = await userRepository.findOne({
    where: { verificationToken: token },
  });

  if (!user) {
    throw new Error('Invalid or expired verification token');
  }

  user.isVerified = true;
  user.verificationToken = null as any; // Clear the token

  await userRepository.save(user);

  // Create Verification Notification
  const notificationRepository = connection.getRepository(NotificationEntity);
  const verificationNotification = notificationRepository.create({
    title: 'Email Verified',
    message: 'Your email has been successfully verified.',
    type: NotificationType.Verification,
    userId: user.id,
    isRead: false,
  });
  await notificationRepository.save(verificationNotification);

  return res.status(200).json({
    success: true,
    message: 'Email verified successfully',
  });
});
