import userModel from '../models/user.model.js'
import { validationResult } from 'express-validator'
import * as authService from '../services/auth.service.js'

export const createUserController = async (req, res) => {
    console.log(req.body)
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const existingUser = await userModel.findOne({ email: req.body.email });
        if (existingUser) throw new Error("Email already registered");
        const user = await authService.createUser(req.body)
        const token = await user.generateJWT();
        const userObj = user.toObject();
        delete userObj.password;
        res.status(201).json({ user: userObj, token })
    } catch (e) {
        res.status(400).send(e.message);
    }
}

export const loginUserController = async (req, res) => {
    const allowedFields = ["email", "password", "role"];
    const extraFields = Object.keys(req.body).filter(
        (key) => !allowedFields.includes(key)
    );
    if (extraFields.length > 0) {
        return res.status(400).json({
            error: `Unexpected fields: ${extraFields.join(", ")}`
        });
    }
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const { email, password, role } = req.body
        const user = await userModel.findOne({ email }).select('+password')
        if (!user) {
            return res.status(401).json({
                errors: 'Invalid credentials'
            })
        }
        const isMatch = await user.isValidPassword(password)
        if (!isMatch) {
            return res.status(401).json({
                errors: 'Invalid credentials'
            })
        }
        if (user.role !== role) {
            return res.status(401).json({ errors: "Invalid role for this account" });
        }
        const token = await user.generateJWT()
        const userObj = user.toObject();
        delete userObj.password;
        res.status(200).json({ user: userObj, token });
    } catch (e) {
        console.log(e);
        res.status(400).send(e.message);
    }
}

