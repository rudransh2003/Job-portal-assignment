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

export default router