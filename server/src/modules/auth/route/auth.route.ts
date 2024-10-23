import express, { Router } from "express";
import passport from "passport";
import {
  register,
  login,
  getUsers,
  getMe,
  getUser,
  updateUser,
  deleteUser,
  logout,
  forgotPassword,
  resetPassword,
  updatePassword,
  googleAuth,
  googleAuthCallBack,
} from "../controller/auth.controller";
import { AuthGuard, isAuthorize } from "../../../middlewares/auth.middleware";

const router: Router = express.Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/me").get(AuthGuard, getMe);
router.route("/update-password").patch(AuthGuard, updatePassword);
router.route("/forgot-password").post(forgotPassword);
router.route("/reset-password/:token").post(resetPassword);
router.route("/users").get(getUsers);

// google auth Routes
router
  .route("/auth/google")
  .get(passport.authenticate("google", { scope: ["profile"] }));
router
  .route("/auth/google/callback")
  .get(
    passport.authenticate("google", { failureRedirect: "http://localhost:3000/login" }),
    googleAuthCallBack
  );

router
  .route("/users/:id")
  .get(AuthGuard, getUser)
  .patch(updateUser)
  .delete(AuthGuard, deleteUser);

router.route("/logout").delete(AuthGuard, logout);

export default router;
