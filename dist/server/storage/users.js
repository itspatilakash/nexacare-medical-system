import { db } from "./db";
import { users } from "../../shared/schema";
import { eq } from "drizzle-orm";
export const createUser = async (user) => {
    return await db.insert(users).values(user).returning();
};
export const findUserByEmail = async (email) => {
    return await db.select().from(users).where(eq(users.email, email)).limit(1);
};
export const findUserById = async (id) => {
    return await db.select().from(users).where(eq(users.id, id)).limit(1);
};
export const deleteUserById = async (id) => {
    return await db.delete(users).where(eq(users.id, id));
};
