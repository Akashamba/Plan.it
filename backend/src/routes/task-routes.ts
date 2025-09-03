import { type Request, type Response, Router } from "express";
import db from "../db";
import { tasks as tasksTable } from "../db/schema/task-schema";
import { session as sessionTable } from "../db/schema/auth-schema";
import { and, eq, gt } from "drizzle-orm";
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

taskRouter.post("/", authCheck, async function (req: Request, res: Response) {
  try {
    const newTask = req.body.newTask;
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

export default taskRouter;
