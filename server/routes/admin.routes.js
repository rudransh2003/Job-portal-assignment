import { Router } from "express";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorizeRole } from "../middlewares/role.middleware.js";
import * as adminController from "../controllers/admin.controllers.js";

const router = Router();

router.use(authenticate);
router.use(authorizeRole("admin"));
router.use(adminController.requireSuperAdmin); 

router.get(
  "/getAllUsers",
  adminController.getAllUsers
);

router.patch(
  "/banUser/:userId",
  adminController.banUser
);

router.get(
  "/getAllJobs",
  adminController.getAllJobs
);

router.delete(
  "/removeJob/:jobId",
  adminController.removeJob
);

router.get(
  "/statistics",
  adminController.getStatistics
);

export default router;