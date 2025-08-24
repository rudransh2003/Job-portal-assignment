import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorizeRole } from "../middlewares/role.middleware.js";
import * as adminController from "../controllers/admin.controllers.js";

const router = Router();

router.use(authenticate);
router.use(authorizeRole("admin"));
router.use(adminController.requireSuperAdmin); // This should be imported from your controller

// --- Users ---
router.get(
  "/getAllUsers",
  adminController.getAllUsers
);

router.patch(
  "/banUser/:userId",
  adminController.banUser
);

// --- Jobs ---
router.get(
  "/getAllJobs",
  adminController.getAllJobs
);

router.delete(
  "/removeJob/:jobId",
  adminController.removeJob
);

// --- Statistics ---
router.get(
  "/statistics",
  adminController.getStatistics
);

export default router;