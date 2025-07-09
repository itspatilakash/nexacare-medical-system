// server/storage/users.ts
import { db } from './db';
import { users } from '../../shared/schema';
import { eq } from 'drizzle-orm';
export const createUser = async (data) => {
    return await db.insert(users).values(data).returning();
};
export const getUserById = async (id) => {
    return await db.select().from(users).where(eq(users.id, id));
};
export const getUserByMobile = async (mobileNumber) => {
    return await db.select().from(users).where(eq(users.mobileNumber, mobileNumber));
};
export const getUserByEmail = async (email) => {
    return await db.select().from(users).where(eq(users.email, email));
};
