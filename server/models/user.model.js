import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email:{
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        minLength: [6, 'Email must be at least 6 characters long'],
        maxLength: [50, 'Email must not be longer than 50 characters']
    },
    password: {
        type: String,
        select: false,
     },
    phone: {
        type: String,
        trim: true,
    },
    role: {
        type: String,
        enum: ["seeker", "employer", "admin"],
        required: true,
    },
    isSuperAdmin: {
        type: Boolean,
        default: false
    }
},
{ timestamps: true }
)

userSchema.pre('save', async function(next) {
    if (this.isSuperAdmin && this.role === 'admin') {
        const existingSuperAdmin = await mongoose.model('user').findOne({ 
            isSuperAdmin: true, 
            _id: { $ne: this._id } 
        });
        
        if (existingSuperAdmin) {
            const error = new Error('Only one super admin is allowed in the system');
            error.status = 400;
            return next(error);
        }
    }
    next();
});

userSchema.statics.hashPassword = async function (password) {
    if(!password) return null;
    return await bcrypt.hash(password, 10)
}

userSchema.methods.isValidPassword = async function (password) {
    return await bcrypt.compare(password, this.password);
}

userSchema.methods.generateJWT = function() {
    return jwt.sign(
        { 
            email: this.email, 
            id: this._id,
            role: this.role,
            isSuperAdmin: this.isSuperAdmin 
        },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
    )
}

userSchema.statics.createSuperAdmin = async function(adminData) {
    try {
        const existingSuperAdmin = await this.findOne({ isSuperAdmin: true });
        if (existingSuperAdmin) {
            throw new Error('Super admin already exists in the system');
        }

        const hashedPassword = await this.hashPassword(adminData.password);

        const superAdmin = new this({
            name: adminData.name,
            email: adminData.email,
            password: hashedPassword,
            phone: adminData.phone || '',
            role: 'admin',
            isSuperAdmin: true
        });

        return await superAdmin.save();
    } catch (error) {
        throw error;
    }
};

userSchema.statics.getSuperAdmin = async function() {
    return await this.findOne({ isSuperAdmin: true });
};

const User = mongoose.model('user', userSchema);
export default User;