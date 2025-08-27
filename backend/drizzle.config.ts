import "dotenv/config";
import { defineConfig } from "drizzle-kit";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set in environment variables.");
}

export default defineConfig({
  out: "./drizzle",
  schema: "src/db/schema/*",
  dialect: "postgresql",
  tablesFilter: `${process.env.TABLES_PREFIX || ""}_*`,
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
});
