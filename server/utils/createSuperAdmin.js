import User from '../models/user.model.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export const createInitialSuperAdmin = async () => {
    try {
        // Check if super admin already exists
        const existingSuperAdmin = await User.getSuperAdmin();
        if (existingSuperAdmin) {
            console.log('Super admin already exists:', existingSuperAdmin.email);
            return existingSuperAdmin;
        }

        // Create super admin with credentials from environment variables
        const superAdminData = {
            name: process.env.SUPER_ADMIN_NAME || 'Super Admin',
            email: process.env.SUPER_ADMIN_EMAIL || 'admin@yourwebsite.com',
            password: process.env.SUPER_ADMIN_PASSWORD || 'SuperAdmin@123',
            phone: process.env.SUPER_ADMIN_PHONE || ''
        };

        const superAdmin = await User.createSuperAdmin(superAdminData);
        console.log('Super admin created successfully:', superAdmin.email);
        return superAdmin;

    } catch (error) {
        console.error('Error creating super admin:', error.message);
        throw error;
    }
};