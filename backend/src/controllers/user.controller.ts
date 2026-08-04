import { asyncHandler } from "../utils/asyncHandler.js";
import * as userService from "../services/user.service.js";
import {
  updateRoleSchema,
  updateStatusSchema,
} from "../validators/user.validator.js";

export const getUsersController =
  asyncHandler(async (req, res) => {

    const query =
  userQuerySchema.parse(
    req.query
  );

const data =
  await userService.getUsers(
    query
  );

    res.json({
      success: true,
      data,
    });

  });

export const getUserController =
  asyncHandler(async (req, res) => {

    const data =
      await userService.getUserById(
        req.params.id
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
        req.params.id,
        body
      );

    res.json({
      success: true,
      message: "Foydalanuvchi roli yangilandi.",
      data,
    });

  });

export const updateUserStatusController =
  asyncHandler(async (req, res) => {

    const body =
      updateStatusSchema.parse(req.body);

    const data =
      await userService.updateStatus(
        req.params.id,
        body
      );

    res.json({
      success: true,
      message: "Foydalanuvchi holati yangilandi.",
      data,
    });

  });