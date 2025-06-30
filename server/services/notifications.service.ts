// server/services/notifications.service.ts
import { db } from '../storage/db';
import { notifications } from '../storage/db';

export const createNotification = async (data: {
  userId: number;
  type: string;
  message: string;
}) => {
  return db.insert(notifications).values(data).returning();
};

export const getUserNotifications = async (userId: number) => {
  return db.select().from(notifications).where(notifications.userId === userId);
};
