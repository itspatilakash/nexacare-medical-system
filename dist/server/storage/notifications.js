// server/storage/notifications.ts
import { db } from './db';
import { notifications } from '../../shared/schema';
import { eq } from 'drizzle-orm';
export const createNotification = (notif) => {
    return db.insert(notifications).values({ ...notif, isRead: false }).returning();
};
export const getNotificationsForUser = (userId) => {
    return db.select().from(notifications).where(eq(notifications.userId, userId));
};
export const markNotificationAsRead = (id) => {
    return db.update(notifications).set({ isRead: true }).where(eq(notifications.id, id)).returning();
};
export const markAllNotificationsAsRead = (userId) => {
    return db.update(notifications).set({ isRead: true }).where(eq(notifications.userId, userId));
};
