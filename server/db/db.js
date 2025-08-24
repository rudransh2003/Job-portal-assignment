import mongoose from "mongoose";
import {createInitialSuperAdmin} from '../utils/createSuperAdmin.js'
import dotenv from 'dotenv';
dotenv.config();

function connect() {
    mongoose.connect(process.env.MONGODB_URI)
        .then(async() => {
            console.log("Connected to MongoDB");
            try {
                await createInitialSuperAdmin();
            } catch (error) {
                console.error('Failed to initialize super admin:', error.message);
            }
        })
        .catch(err => {
            console.log(err);
        })
}

export default connect;