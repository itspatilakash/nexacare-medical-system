import { db } from "./db";
import { notifications } from "../../shared/schema";
import { InsertNotification } from "../../shared/schema-types";
import { eq } from "drizzle-orm";

export const createNotification = async (notif: InsertNotification) => {
  return await db.insert(notifications).values(notif).returning();
};

export const getNotificationsForUser = async (userId: string) => {
  return await db.select().from(notifications).where(eq(notifications.userId, userId));
};
