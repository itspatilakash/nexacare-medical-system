import { db } from "./db";
import { notifications } from "../../shared/schema";
import { eq } from "drizzle-orm";
export const createNotification = async (notif) => {
    return await db.insert(notifications).values(notif).returning();
};
export const getNotificationsForUser = async (userId) => {
    return await db.select().from(notifications).where(eq(notifications.userId, userId));
};
