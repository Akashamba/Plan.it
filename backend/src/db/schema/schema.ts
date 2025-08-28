import {
  pgTableCreator,
  text,
  uuid,
  timestamp,
  pgEnum,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { user } from "./auth-schema";

// custom create table function for table prefix (similar to t3-app)
export const createTable = pgTableCreator(
  (name) => `${process.env.TABLES_PREFIX}_${name}`
);

// Enums
export const statusEnum = pgEnum("status", ["completed", "not completed"]);
export const priorityEnum = pgEnum("priority", ["low", "medium", "high"]);

// Lists table
export const lists = createTable("lists", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  userId: text("user_id").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

// Tasks table
export const tasks = createTable("tasks", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  userId: text("user_id").notNull(),
  status: statusEnum("status").notNull().default("not completed"),
  description: text("description"),
  priority: priorityEnum("priority"),
  listId: uuid("list_id").notNull(),
  startDate: timestamp("start_date", { withTimezone: true }),
  endDate: timestamp("end_date", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

// Relations
export const listsRelations = relations(lists, ({ one, many }) => ({
  user: one(user, {
    fields: [lists.userId],
    references: [user.id],
  }),
  tasks: many(tasks),
}));

export const tasksRelations = relations(tasks, ({ one }) => ({
  user: one(user, {
    fields: [tasks.userId],
    references: [user.id],
  }),
  list: one(lists, {
    fields: [tasks.listId],
    references: [lists.id],
  }),
}));
