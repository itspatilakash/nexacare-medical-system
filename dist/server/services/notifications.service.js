// server/services/notifications.service.ts
import { db } from '../storage/db';
import { notifications } from '../../shared/schema';
import { eq } from 'drizzle-orm';
/**
 * Create a new notification for a user.
 */
export const createNotification = async (data) => {
    return db.insert(notifications).values({
        ...data,
        isRead: false,
    }).returning();
};
/**
 * Get all notifications for a user.
 */
export const getUserNotifications = async (userId) => {
    return db
        .select()
        .from(notifications)
        .where(eq(notifications.userId, userId));
};
/**
 * Mark a single notification as read.
 */
export const markNotificationAsRead = async (notificationId) => {
    return db
        .update(notifications)
        .set({ isRead: true })
        .where(eq(notifications.id, notificationId))
        .returning();
};
/**
 * Mark all notifications as read for a user.
 */
export const markAllNotificationsAsRead = async (userId) => {
    return db
        .update(notifications)
        .set({ isRead: true })
        .where(eq(notifications.userId, userId));
};
