import { Router } from 'express';
import { authenticate } from '../middlewares/auth.middleware.js';
import { authorizeRole } from '../middlewares/role.middleware.js';
import * as employerController from '../controllers/employer.controllers.js'
import * as jobController from '../controllers/job.controller.js'
const router = Router()

router.post('/profile',
    authenticate,
    authorizeRole("employer"),
    employerController.createProfile)

router.get("/profile", authenticate, authorizeRole("employer"), employerController.getProfile);
router.put("/profile", authenticate, authorizeRole("employer"), employerController.updateProfile);
router.put("/profile", authenticate, authorizeRole("employer"), employerController.updateProfile);

router.post("/create-job", authenticate, authorizeRole("employer"), jobController.createJob);
router.get("/my-jobs", authenticate, authorizeRole("employer"), jobController.getEmployerJobs);
router.put("/update-job/:jobId", authenticate, authorizeRole("employer"), jobController.updateJob);
router.delete("/delete-job/:jobId", authenticate, authorizeRole("employer"), jobController.deleteJob)

export default router