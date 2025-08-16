import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./drizzle",
  schema: "./db/*schema.ts",
  dialect: "postgresql",
  tablesFilter: `${process.env.TABLES_PREFIX}_*`,
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
