import { integer, pgTable, pgTableCreator, varchar } from "drizzle-orm/pg-core";

export const createTable = pgTableCreator(
  (name) => `${process.env.TABLES_PREFIX}_${name}`
);

// temp fake table
export const fakeuserstable = pgTable("fakeuserstable", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  age: integer().notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
});
