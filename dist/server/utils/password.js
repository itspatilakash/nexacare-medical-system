import bcrypt from "bcryptjs";
export const hashPassword = async (password) => {
    return bcrypt.hash(password, 10);
};
export const comparePassword = async (input, hash) => {
    return bcrypt.compare(input, hash);
};
