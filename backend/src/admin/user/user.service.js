import User from "./user.model.js";

export const getAllUsers = async () => {
    return await User.find();
};

export const createUser = async (userData) => {
    const user = new User(userData);
    return await user.save();
};