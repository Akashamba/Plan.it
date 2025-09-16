import { z } from "zod";
import { priorityEnum, statusEnum } from "../db/schema/task-schema.js";

export const createTaskSchema = z.object({
  name: z.string(),
  status: z.enum(statusEnum.enumValues),
  description: z.string().optional(),
  priority: z.enum(priorityEnum.enumValues),
  listId: z.uuid(),
  startDate: z.iso.datetime().optional(),
  endDate: z.iso.datetime().optional(),
});

export const updateTaskBodySchema = createTaskSchema.partial();

export const taskQuerySchema = z.object({
  dueDate: z.iso.datetime().optional(),
  searchQuery: z
    .string()
    .min(3, "Please enter more characters")
    .max(50, "Please enter fewer characters")
    .trim()
    .optional(),
  //   priority: ...,
  //   status: ...
});

export const getTaskSchema = z.object({
  id: z.uuid(),
});

export const updateTaskParamSchema = getTaskSchema.extend({});

export const deleteTaskSchema = getTaskSchema.extend({});

export const getListSchema = getTaskSchema.extend({});
