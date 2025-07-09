// server/services/user.service.ts
import { createUser, getUserByEmail, getUserById, getUserByMobile, } from '../storage/users';
export const registerUser = async (data) => {
    return await createUser(data);
};
export const findUserByMobile = async (mobileNumber) => {
    const [user] = await getUserByMobile(mobileNumber);
    return user;
};
export const findUserByEmail = async (email) => {
    const [user] = await getUserByEmail(email);
    return user;
};
export const findUserById = async (id) => {
    const [user] = await getUserById(id);
    return user;
};
