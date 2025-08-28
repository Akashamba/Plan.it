import { pgTableCreator } from "drizzle-orm/pg-core";

// custom create table function for table prefix (similar to t3-app)
export const createTable = pgTableCreator(
  (name) => `${process.env.TABLES_PREFIX}_${name}`
);
