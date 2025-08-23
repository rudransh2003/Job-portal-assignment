import userModel from '../models/user.model.js'

export const createUser = async({
    name, email, password, phone, role
}) => {
    if (!name || !email || !password || !phone || !role) {
        throw new Error('All the fields are required');
    }
    const hashPassword = await userModel.hashPassword(password);
    const user = await userModel.create({
        name,
        email,
        password: hashPassword,
        phone,
        role
    })
    return user;
}