import { asyncHandler } from "../utils/asyncHandler.js";

import {
  userQuerySchema,
  updateRoleSchema,
  updateStatusSchema,
  updateProfileSchema,
  changePasswordSchema,
} from "../validators/user.validator.js";

import * as userService from "../services/user.service.js";

import { uploadAvatar } from "../services/upload.service.js";
import { AppError } from "../utils/AppError.js";


export const getUsersController =
  asyncHandler(async (req, res) => {
    const query =
      userQuerySchema.parse(req.query);

    const data =
      await userService.getUsers(query);

    res.json({
      success: true,
      data,
    });
  });


export const getUserController =
  asyncHandler(async (req, res) => {
    const data =
      await userService.getUserById(
        req.params.id as string
      );

    res.json({
      success: true,
      data,
    });
  });


export const updateUserRoleController =
  asyncHandler(async (req, res) => {
    const body =
      updateRoleSchema.parse(req.body);

    const data =
      await userService.updateRole(
        req.params.id as string,
        body
      );

    res.json({
      success: true,
      message:
        "Foydalanuvchi roli yangilandi.",
      data,
    });
  });


export const updateUserStatusController =
  asyncHandler(async (req, res) => {
    const body =
      updateStatusSchema.parse(req.body);

    const data =
      await userService.updateStatus(
        req.params.id as string,
        body
      );

    res.json({
      success: true,
      message:
        "Foydalanuvchi holati yangilandi.",
      data,
    });
  });


export const getMyProfileController =
  asyncHandler(async (req, res) => {
    const data =
      await userService.getMyProfile(
        req.user!.userId
      );

    res.json({
      success: true,
      data,
    });
  });


export const updateMyProfileController =
  asyncHandler(async (req, res) => {
    const body =
      updateProfileSchema.parse(req.body);

    const data =
      await userService.updateMyProfile(
        req.user!.userId,
        body
      );

    res.json({
      success: true,
      message:
        "Profil muvaffaqiyatli yangilandi.",
      data,
    });
  });


export const updateMyAvatarController =
  asyncHandler(async (req, res) => {
    if (!req.file) {
      throw new AppError(
        "Profil rasmi tanlanmagan.",
        400
      );
    }

    const result =
      await uploadAvatar(req.file);

    const avatarUrl =
      (result as {
        secure_url: string;
      }).secure_url;

    const data =
      await userService.updateMyAvatar(
        req.user!.userId,
        avatarUrl
      );

    res.json({
      success: true,
      message:
        "Profil rasmi muvaffaqiyatli yangilandi.",
      data,
    });
  });


export const changePasswordController =
  asyncHandler(async (req, res) => {
    const body =
      changePasswordSchema.parse(
        req.body
      );

    await userService.changePassword(
      req.user!.userId,
      body
    );

    res.json({
      success: true,
      message:
        "Parol muvaffaqiyatli o'zgartirildi.",
      data: null,
    });
  });