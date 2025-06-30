import { db } from "./db";
import { users } from "../../shared/schema";
import { eq } from "drizzle-orm";
import { InsertUser } from "../../shared/schema-types";

export const createUser = async (user: InsertUser) => {
  return await db.insert(users).values(user).returning();
};

export const findUserByEmail = async (email: string) => {
  return await db.select().from(users).where(eq(users.email, email)).limit(1);
};

export const findUserById = async (id: string) => {
  return await db.select().from(users).where(eq(users.id, id)).limit(1);
};

export const deleteUserById = async (id: string) => {
  return await db.delete(users).where(eq(users.id, id));
};
