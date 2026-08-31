import { Router } from "express";

import {
  createReelController,
  getPublishedReelsController,
  getAllReelsController,
  getReelByIdController,
  getSharedReelController,
  updateReelController,
  deleteReelController,
  publishReelController,
  toggleLikeController,
  createCommentController,
  getCommentsController,
  deleteCommentController,
  getCategoriesController,
  getCategoryReelsController,
  createCategoryController,
  updateCategoryController,
  deleteCategoryController,
} from "../controllers/reel.controller.js";

import {
  authMiddleware,
} from "../middlewares/auth.middleware.js";

import {
  authorize,
} from "../middlewares/authorize.middleware.js";

import {
  upload,
  uploadCategoryImage,
} from "../middlewares/upload.middleware.js";

const router = Router();

/*
|--------------------------------------------------------------------------
| Categories
|--------------------------------------------------------------------------
|
| MUHIM:
| /categories route'lari /:id dan OLDIN turishi kerak.
| Aks holda Express "categories" ni :id deb qabul qiladi.
|
*/

router.get(
  "/categories",
  authMiddleware,
  getCategoriesController
);

router.get(
  "/categories/:slug",
  authMiddleware,
  getCategoryReelsController
);

/*
|--------------------------------------------------------------------------
| Admin Categories
|--------------------------------------------------------------------------
*/

router.post(
  "/categories",
  authMiddleware,
  authorize("ADMIN", "SUPER_ADMIN"),
  upload.single("image"),
  createCategoryController
);

router.put(
  "/categories/:id",
  authMiddleware,
  authorize("ADMIN", "SUPER_ADMIN"),
  upload.single("image"),
  updateCategoryController
);

router.delete(
  "/categories/:id",
  authMiddleware,
  authorize("SUPER_ADMIN"),
  deleteCategoryController
);

/*
|--------------------------------------------------------------------------
| Admin Reels
|--------------------------------------------------------------------------
*/

router.get(
  "/admin/all",
  authMiddleware,
  authorize("ADMIN", "SUPER_ADMIN"),
  getAllReelsController
);

router.post(
  "/",
  authMiddleware,
  authorize("ADMIN", "SUPER_ADMIN"),
  upload.single("video"),
  createReelController
);

router.put(
  "/:id",
  authMiddleware,
  authorize("ADMIN", "SUPER_ADMIN"),
  upload.single("video"),
  updateReelController
);

router.patch(
  "/:id/publish",
  authMiddleware,
  authorize("ADMIN", "SUPER_ADMIN"),
  publishReelController
);

router.delete(
  "/:id",
  authMiddleware,
  authorize("SUPER_ADMIN"),
  deleteReelController
);

/*
|--------------------------------------------------------------------------
| Student / Authenticated User
|--------------------------------------------------------------------------
*/

router.get(
  "/",
  authMiddleware,
  getPublishedReelsController
);

router.get(
  "/share/:id",
  authMiddleware,
  getSharedReelController
);

router.get(
  "/:id",
  authMiddleware,
  getReelByIdController
);

router.post(
  "/:id/like",
  authMiddleware,
  toggleLikeController
);

router.get(
  "/:id/comments",
  authMiddleware,
  getCommentsController
);

router.post(
  "/:id/comments",
  authMiddleware,
  createCommentController
);

router.delete(
  "/:id/comments/:commentId",
  authMiddleware,
  deleteCommentController
);

export default router;