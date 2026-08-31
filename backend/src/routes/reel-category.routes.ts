import { Router } from "express";

import {
  createCategoryController,
  getCategoriesController,
  getCategoryBySlugController,
  getCategoryReelsController,
  updateCategoryController,
  deleteCategoryController,
} from "../controllers/reel-category.controller.js";

import {
  authMiddleware,
} from "../middlewares/auth.middleware.js";

import {
  authorize,
} from "../middlewares/authorize.middleware.js";

const router = Router();

/*
|--------------------------------------------------------------------------
| Authenticated users
|--------------------------------------------------------------------------
*/

router.get(
  "/",
  authMiddleware,
  getCategoriesController
);

router.get(
  "/:slug/reels",
  authMiddleware,
  getCategoryReelsController
);

router.get(
  "/:slug",
  authMiddleware,
  getCategoryBySlugController
);


/*
|--------------------------------------------------------------------------
| Admin
|--------------------------------------------------------------------------
*/

router.post(
  "/",
  authMiddleware,
  authorize(
    "ADMIN",
    "SUPER_ADMIN"
  ),
  createCategoryController
);

router.put(
  "/:id",
  authMiddleware,
  authorize(
    "ADMIN",
    "SUPER_ADMIN"
  ),
  updateCategoryController
);

/*
|--------------------------------------------------------------------------
| SUPER ADMIN ONLY
|--------------------------------------------------------------------------
*/

router.delete(
  "/:id",
  authMiddleware,
  authorize("SUPER_ADMIN"),
  deleteCategoryController
);

export default router;