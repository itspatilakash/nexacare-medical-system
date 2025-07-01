// shared/schema-types.ts
import { InferInsertModel } from "drizzle-orm";
import { users } from "./schema";

export type InsertUser = InferInsertModel<typeof users>;
