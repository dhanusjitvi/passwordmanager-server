import userSchema from "../../models/userSchema/userSchema";
import Password from "../../models/passwordSchema/passwordSchema";
import passwordSchema from "../../models/passwordSchema/passwordSchema";
export const findOne = async (email) => {
    try {
        const user = await userSchema.findOne({ email });
        return user;
    }
    catch (error) {
        console.log(error);
        throw new Error('Failed to find user by Email');
    }
    ;
};
export const create = async (userData) => {
    try {
        const newUser = new userSchema(userData);
        const savedUser = await newUser.save();
        return savedUser;
    }
    catch (error) {
        throw new Error("Failed to create user");
    }
};
export const UserFindById = async (userId) => {
    try {
        const user = await userSchema.findById(userId);
        return user;
    }
    catch (error) {
        throw new Error('Failed to find user by ID');
    }
};
export const findPasswordsByUserId = async (userId) => {
    try {
        const passwords = await Password.findOne({ userId });
        return passwords;
    }
    catch (error) {
        console.log(error);
        return null;
    }
};
export const savePassword = async (userId, savedPasswordData) => {
    try {
        let password = await passwordSchema.findOne({ userId: userId });
        if (!password) {
            password = await passwordSchema.create({
                userId,
                savedPassword: [savedPasswordData],
            });
        }
        else {
            password.savedPassword.push(savedPasswordData);
            await password.save();
        }
    }
    catch (error) {
        console.log(error);
        throw new Error('Failed to save password');
    }
};
export const deletePassword = async (saveData, password) => {
    try {
        const indexToDelete = saveData.savedPassword.findIndex((item) => item.password == password);
        saveData.savedPassword.splice(indexToDelete, 1);
        await saveData.save();
        return saveData;
    }
    catch (error) {
        console.log(error);
        throw new Error('Failed to delete password');
    }
};
