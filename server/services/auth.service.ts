// server/services/auth.service.ts
import jwt from "jsonwebtoken";
import bcrypt from 'bcrypt';
import { eq } from "drizzle-orm";
import { db } from "../storage/db";
import { users } from "../../shared/schema"; 

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";
const JWT_EXPIRES_IN = "7d";

export const hashPassword = async (password: string) => {
  return bcrypt.hash(password, 10);
};

export const comparePasswords = async (password: string, hash: string) => {
  return bcrypt.compare(password, hash);
};

export const generateToken = (user: {
  id: string;
  mobileNumber: string;
  role: string;
  fullName: string;
}) => {
  return jwt.sign(user, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

export const authenticateUser = async (
  mobileNumber: string,
  password: string
) => {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.mobileNumber, mobileNumber))
    .limit(1);

  if (!user) return null;

  const isMatch = await comparePasswords(password, user.password);
  if (!isMatch) return null;

  const token = generateToken({
    id: user.id.toString(),
    mobileNumber: user.mobileNumber,
    role: user.role,
    fullName: user.fullName,
  });

  return { user, token };
};
