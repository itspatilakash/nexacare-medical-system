// server/services/notifications.service.ts
import { db } from '../storage/db';
import { notifications } from '../storage/db';
export const createNotification = async (data) => {
    return db.insert(notifications).values(data).returning();
};
export const getUserNotifications = async (userId) => {
    return db.select().from(notifications).where(notifications.userId === userId);
};
