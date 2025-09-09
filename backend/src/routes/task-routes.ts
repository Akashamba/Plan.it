import { type Request, type Response, Router } from "express";
import db from "../db";
import { tasks as tasksTable } from "../db/schema/task-schema";
import { and, eq, gte, ilike, like, lt, or } from "drizzle-orm";
import { authCheck } from "../utils/auth-check";
import {
  createTaskSchema,
  taskQuerySchema,
  updateTaskSchema,
} from "../schema/task.schema";
import { validateBody, validateQuery } from "../utils/validation";
import { getNextDate } from "../utils/get-next-date";

const taskRouter = Router();

// /api/tasks/: GET all tasks of a user (with filters)
taskRouter.get(
  "/",
  authCheck,
  validateQuery(taskQuerySchema),
  async function (req: Request, res: Response) {
    const { userId: currentUserId, validatedQuery } = req;

    if (currentUserId) {
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
  }
);

// GET all tasks due on or before today
taskRouter.get(
  "/today",
  authCheck,
  async function (req: Request, res: Response) {
    const { userId: currentUserId } = req;
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    if (currentUserId) {
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
  }
);

// GET a specific task
taskRouter.get("/:id", authCheck, async function (req: Request, res: Response) {
  try {
    const currentUserId = req.userId;
    if (currentUserId) {
      const task = await db
        .selectDistinct()
        .from(tasksTable)
        .where(
          and(
            eq(tasksTable.id, req.params.id),
            eq(tasksTable.userId, currentUserId)
          )
        );
      res.json(task[0]);
    }
  } catch (error) {
    console.error("Database error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// UPDATE a specific task
taskRouter.put(
  "/:id",
  authCheck,
  validateBody(updateTaskSchema),
  async function (req: Request, res: Response) {
    try {
      const { userId: currentUserId, validatedBody } = req;

      if (validatedBody.startDate) {
        validatedBody.startDate = new Date(validatedBody.startDate);
      }
      if (validatedBody.endDate) {
        validatedBody.endDate = new Date(validatedBody.endDate);
      }

      if (currentUserId && validatedBody) {
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
        res.json(task[0]);
      }
    } catch (error) {
      console.error("Database error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
);

// DELETE a specific task
taskRouter.delete(
  "/:id",
  authCheck,
  async function (req: Request, res: Response) {
    try {
      const currentUserId = req.userId;
      if (currentUserId) {
        const task = await db
          .delete(tasksTable)
          .where(
            and(
              eq(tasksTable.id, req.params.id),
              eq(tasksTable.userId, currentUserId)
            )
          )
          .returning();

        res.json({ task: task });
      }
    } catch (error) {
      console.error("Database error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
);

// CREATE a new task
taskRouter.post(
  "/",
  authCheck,
  validateBody(createTaskSchema),
  async function (req: Request, res: Response) {
    try {
      const { userId: currentUserId, validatedBody } = req;
      if (currentUserId) {
        const [task] = await db
          .insert(tasksTable)
          .values({ ...validatedBody, userId: currentUserId })
          .returning();

        res.json({ message: "success", task: task });
      }
    } catch (error) {
      console.error("Database error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
);

export default taskRouter;
