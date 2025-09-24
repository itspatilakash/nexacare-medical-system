import bcrypt from "bcryptjs";

export const hashPassword = async (password: string) => {
  return bcrypt.hash(password, 10);
};

export const comparePassword = async (input: string, hash: string) => {
  return bcrypt.compare(input, hash);
};
