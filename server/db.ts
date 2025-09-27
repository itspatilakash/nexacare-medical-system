// server/db.ts - Real database connection
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "../shared/schema";

// Create database connection with fallback
const connectionString = process.env.DATABASE_URL || "postgresql://neondb_owner:npg_NQrYiJCf3kG0@ep-floral-fire-a1368kxn-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

const sql = postgres(connectionString);
export const db = drizzle(sql, { schema });

console.log('🗄️  Connected to real PostgreSQL database');
console.log('📝 Using Neon database for production data');