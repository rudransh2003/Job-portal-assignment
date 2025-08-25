import { Router } from 'express';
import { authenticate } from '../middlewares/auth.middleware.js';
import { authorizeRole } from '../middlewares/role.middleware.js';
import * as employerController from '../controllers/employer.controllers.js'
import * as jobController from '../controllers/job.controller.js'
const router = Router()
router.use(authenticate)
router.use(authorizeRole("employer"));

router.post('/profile',employerController.createProfile)
router.get("/profile", employerController.getProfile);
router.put("/profile", employerController.updateProfile);

router.post("/create-job", jobController.createJob);
router.get("/my-jobs", jobController.getEmployerJobs);
router.put("/update-job/:jobId", jobController.updateJob);
router.delete("/delete-job/:jobId", jobController.deleteJob)

router.get("/:jobId/applicants", jobController.getApplicantsForJob)
router.put("/:jobId/applicants/:seekerId/status", jobController.updateApplicationStatus)

export default router