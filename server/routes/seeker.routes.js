import { Router } from 'express';
import * as seekerController from "../controllers/seeker.controller.js";
import { authenticate } from '../middlewares/auth.middleware.js';
import { authorizeRole } from '../middlewares/role.middleware.js';

const router = Router()
router.use(authenticate)
router.use(authorizeRole("seeker"));

router.post('/profile', seekerController.createProfile)

router.get('/profile', seekerController.getProfile)

router.put('/profile', seekerController.updateProfile)

router.get('/view-jobs', seekerController.viewJobs)

router.post('/apply/:jobId', seekerController.applyToJob)

router.get('/applied-jobs', seekerController.getAppliedJobs)

router.post('/save/:jobId', seekerController.saveJob)

router.get('/saved-jobs', seekerController.getSavedJobs)

router.delete('/unsave/:jobId', seekerController.unsaveJob)

export default router