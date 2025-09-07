import { type Request, type Response, Router } from "express";
import db from "../db";
import { tasks as tasksTable } from "../db/schema/task-schema";
import { and, eq, gte, lt } from "drizzle-orm";
import { authCheck } from "../utils/auth-check";

const taskRouter = Router();

// /api/tasks/all: GET all tasks of a user
taskRouter.get("/all", authCheck, async function (req: Request, res: Response) {
  try {
    const currentUserId = req.userId;
    if (currentUserId) {
      const tasks = await db
        .select()
        .from(tasksTable)
        .where(eq(tasksTable.userId, currentUserId));

      console.log("Getting tasks from the database: ", tasks.length);

      res.json({ tasks });
    }
  } catch (error) {
    console.error("Database error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

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
taskRouter.put("/:id", authCheck, async function (req: Request, res: Response) {
  try {
    const currentUserId = req.userId;
    const updatedTask = req.body;

    if (updatedTask.startDate) {
      updatedTask.startDate = new Date(updatedTask.startDate);
    }
    if (updatedTask.endDate) {
      updatedTask.endDate = new Date(updatedTask.endDate);
    }

    if (currentUserId && updatedTask) {
      const task = await db
        .update(tasksTable)
        .set(updatedTask)
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
});

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
taskRouter.post("/", authCheck, async function (req: Request, res: Response) {
  try {
    const newTask = req.body;
    const currentUserId = req.userId;
    if (currentUserId) {
      const [task] = await db
        .insert(tasksTable)
        .values({ ...newTask, userId: currentUserId })
        .returning();

      res.json({ message: "success", task: task });
    }
  } catch (error) {
    console.error("Database error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// GET task due on given date
taskRouter.get(
  "/due-on/:date",
  authCheck,
  async function (req: Request, res: Response) {
    try {
      const date = new Date(req.params.date);
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);
      const currentUserId = req.userId;

      if (currentUserId) {
        const tasks = await db
          .select()
          .from(tasksTable)
          .where(
            and(
              eq(tasksTable.userId, currentUserId),
              gte(tasksTable.startDate, date),
              lt(tasksTable.startDate, nextDate)
            )
          );

        res.json({ tasks: tasks });
      }
    } catch (error) {
      console.log("Database error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
);

export default taskRouter;
