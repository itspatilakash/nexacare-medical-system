// server/services/auth.service.ts
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { eq } from 'drizzle-orm';
import { db } from '../storage/db';
import { users, otpVerifications } from '../../shared/schema';
import { generateOTP, isOtpExpired } from '../utils/otp';
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = '7d';
export const hashPassword = (password) => bcrypt.hash(password, 10);
export const comparePasswords = (password, hash) => bcrypt.compare(password, hash);
export const generateToken = (user) => jwt.sign(user, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
/**
 * Send OTP for mobile registration/login.
 */
export const sendOtp = async (mobileNumber, role) => {
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
    await db.insert(otpVerifications).values({
        mobileNumber,
        otp,
        expiresAt,
    });
    // Integrate SMS service here (e.g., Twilio)
    console.log(`Sending OTP ${otp} to ${mobileNumber}`);
    return { success: true, otp }; // Return OTP only in dev
};
/**
 * Verify OTP and register the user with password.
 */
export const verifyOtp = async ({ mobileNumber, otp, password, }) => {
    const [record] = await db
        .select()
        .from(otpVerifications)
        .where(eq(otpVerifications.mobileNumber, mobileNumber))
        .orderBy(otpVerifications.createdAt)
        .limit(1);
    if (!record || record.otp !== otp || isOtpExpired(record.expiresAt)) {
        throw new Error('Invalid or expired OTP');
    }
    await db.update(otpVerifications)
        .set({ isUsed: true })
        .where(eq(otpVerifications.id, record.id));
    return { success: true };
};
/**
 * Register user after OTP is verified.
 */
export const registerUser = async (user) => {
    const hashedPassword = await hashPassword(user.password);
    const [createdUser] = await db.insert(users).values({
        ...user,
        password: hashedPassword,
        isVerified: true,
    }).returning();
    const token = generateToken({
        id: createdUser.id,
        mobileNumber: createdUser.mobileNumber,
        role: createdUser.role,
        fullName: createdUser.fullName,
    });
    return { user: createdUser, token };
};
/**
 * Login user by verifying password and returning a token.
 */
export const loginUser = async ({ mobileNumber, password, }) => {
    const [user] = await db.select().from(users).where(eq(users.mobileNumber, mobileNumber)).limit(1);
    if (!user)
        throw new Error('User not found');
    const valid = await comparePasswords(password, user.password);
    if (!valid)
        throw new Error('Invalid password');
    const token = generateToken({
        id: user.id,
        mobileNumber: user.mobileNumber,
        role: user.role,
        fullName: user.fullName,
    });
    return { user, token };
};
