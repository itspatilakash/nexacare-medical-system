// server/services/users.service.ts
import { db } from '../storage/db';
import { users } from '../storage/db';
import { eq } from 'drizzle-orm';
export const getUserById = async (id) => {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
};
export const updateUserRole = async (id, role) => {
    return db.update(users).set({ role }).where(eq(users.id, id)).returning();
};
