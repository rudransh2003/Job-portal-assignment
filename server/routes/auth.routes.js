import { Router } from 'express';
import * as authController from '../controllers/auth.controller.js';
import { body } from 'express-validator';
const router = Router()

router.post("/register",
    body('email').isEmail().withMessage('Email must be a valid email address'),
    body('password').isLength({ min: 3 }).withMessage('Password must be at least 3 characters long'),
    body('phone').isMobilePhone().withMessage('Phone must be valid'),
    authController.createUserController);

router.post("/login",
    body('email').isEmail().withMessage('Email must be a valid email address'),
    body('password').isLength({ min: 3 }).withMessage('Password must be at least 3 characters long'),
    body('role').notEmpty().withMessage("Please enter a role"),
    authController.loginUserController);

export default router