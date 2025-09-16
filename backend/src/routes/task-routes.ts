import { type Request, type Response, Router } from "express";
import db from "../db/index.js";
import { tasks as tasksTable } from "../db/schema/task-schema.js";
import { and, eq, gte, ilike, lt, or } from "drizzle-orm";
import { authCheck } from "../utils/auth-check.js";
import {
  createTaskSchema,
  deleteTaskSchema,
  getTaskSchema,
  taskQuerySchema,
  updateTaskBodySchema,
  updateTaskParamSchema,
} from "../schema/task.schema.js";
import {
  validateBody,
  validateParams,
  validateQuery,
} from "../utils/validation.js";
import { getNextDate } from "../utils/get-next-date.js";

const taskRouter = Router();

// GET all tasks of a user (with filters) [/api/tasks/]
taskRouter.get(
  "/",
  authCheck,
  validateQuery(taskQuerySchema),
  async function (req: Request, res: Response) {
    const { userId: currentUserId, validatedQuery } = req;

    // Add filters based on query params
    const filters = [];
    filters.push(eq(tasksTable.userId, currentUserId));

    // Add date filters
    if (validatedQuery.dueDate) {
      const dueDate = new Date(validatedQuery.dueDate);
      filters.push(
        and(
          gte(tasksTable.startDate, dueDate),
          lt(tasksTable.startDate, getNextDate(dueDate))
        )
      );
    }

    // Add search filters
    if (validatedQuery.searchQuery) {
      filters.push(
        or(
          ilike(tasksTable.name, `%${validatedQuery.searchQuery}%`),
          ilike(tasksTable.description, `%${validatedQuery.searchQuery}%`)
        )
      );
    }

    // Fetch data from db
    try {
      const tasks = await db
        .select()
        .from(tasksTable)
        .where(and(...filters));

      console.log("Getting tasks from the database: ", tasks.length);

      res.json({ tasks });
    } catch (error) {
      console.error("Database error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
);

// GET all tasks due on or before today (due before tomorrow) [/api/tasks/today]
taskRouter.get(
  "/today",
  authCheck,
  async function (req: Request, res: Response) {
    const { userId: currentUserId } = req;
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    try {
      const tasks = await db
        .select()
        .from(tasksTable)
        .where(
          and(
            eq(tasksTable.userId, currentUserId),
            lt(tasksTable.startDate, tomorrow)
          )
        );
      res.json(tasks);
    } catch (error) {
      console.error("Database error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
);

// GET a specific task [/api/tasks/:id]
taskRouter.get(
  "/:id",
  authCheck,
  validateParams(getTaskSchema),
  async function (req: Request, res: Response) {
    try {
      const currentUserId = req.userId;
      const task = await db
        .select()
        .from(tasksTable)
        .where(
          and(
            eq(tasksTable.id, req.params.id),
            eq(tasksTable.userId, currentUserId)
          )
        )
        .limit(1);

      if (task.length === 0) {
        return res.status(404).json({
          error: "Task not found or you don't have permission to access it",
        });
      }

      res.json(task[0]);
    } catch (error) {
      console.error("Database error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
);

// UPDATE a specific task [/api/tasks/:id]
taskRouter.put(
  "/:id",
  authCheck,
  validateParams(updateTaskParamSchema),
  validateBody(updateTaskBodySchema),
  async function (req: Request, res: Response) {
    try {
      const { userId: currentUserId, validatedBody } = req;

      if (validatedBody.startDate) {
        validatedBody.startDate = new Date(validatedBody.startDate);
      }
      if (validatedBody.endDate) {
        validatedBody.endDate = new Date(validatedBody.endDate);
      }

      if (validatedBody) {
        const task = await db
          .update(tasksTable)
          .set(validatedBody)
          .where(
            and(
              eq(tasksTable.id, req.params.id),
              eq(tasksTable.userId, currentUserId)
            )
          )
          .returning();

        if (task.length === 0) {
          return res.status(404).json({
            error: "Task not found or you don't have permission to update it",
          });
        }

        res.json(task[0]);
      }
    } catch (error) {
      console.error("Database error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
);

// DELETE a specific task [/api/tasks/:id]
taskRouter.delete(
  "/:id",
  authCheck,
  validateParams(deleteTaskSchema),
  async function (req: Request, res: Response) {
    try {
      const currentUserId = req.userId;

      const task = await db
        .delete(tasksTable)
        .where(
          and(
            eq(tasksTable.id, req.params.id),
            eq(tasksTable.userId, currentUserId)
          )
        )
        .returning();

      if (task.length === 0) {
        return res.status(404).json({
          error: "Task not found or you don't have permission to delete it",
        });
      }

      res.json({ message: "success", task: task });
    } catch (error) {
      console.error("Database error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
);

// CREATE a new task [/api/tasks/]
taskRouter.post(
  "/",
  authCheck,
  validateBody(createTaskSchema),
  async function (req: Request, res: Response) {
    try {
      const { userId: currentUserId, validatedBody } = req;

      const [task] = await db
        .insert(tasksTable)
        .values({ ...validatedBody, userId: currentUserId })
        .returning();

      res.json({ message: "success", task: task });
    } catch (error) {
      console.error("Database error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
);

export default taskRouter;
