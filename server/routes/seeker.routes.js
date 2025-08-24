import { Router } from 'express';
import * as seekerController from "../controllers/seeker.controller.js";
import { authenticate } from '../middlewares/auth.middleware.js';
import { authorizeRole } from '../middlewares/role.middleware.js';

const router = Router()

router.post('/profile',
    authenticate,
    authorizeRole("seeker"),
    seekerController.createProfile)

router.get('/profile',
    authenticate,
    authorizeRole("seeker"),
    seekerController.getProfile)

router.put('/profile',
    authenticate,
    authorizeRole("seeker"),
    seekerController.updateProfile)

router.get('/view-jobs',
    authenticate,
    authorizeRole("seeker"),
    seekerController.viewJobs)

router.post('/apply/:jobId',
    authenticate,
    authorizeRole("seeker"),
    seekerController.applyToJob)

router.get('/applied-jobs',
    authenticate,
    authorizeRole("seeker"),
    seekerController.getAppliedJobs)

router.post('/save/:jobId',
    authenticate,
    authorizeRole("seeker"),
    seekerController.saveJob)

router.get('/saved-jobs',
    authenticate,
    authorizeRole("seeker"),
    seekerController.getSavedJobs
)

router.delete('/unsave/:jobId',
    authenticate,
    authorizeRole("seeker"),
    seekerController.unsaveJob
)

export default router