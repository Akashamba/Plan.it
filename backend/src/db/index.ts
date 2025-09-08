import "dotenv/config";
import { drizzle } from "drizzle-orm/neon-http";
import * as authSchema from "./schema/auth-schema";
import * as taskSchema from "./schema/task-schema";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set in environment variables.");
}

const db = drizzle(process.env.DATABASE_URL, {
  schema: {
    ...authSchema,
    ...taskSchema,
  },
});

export default db;
