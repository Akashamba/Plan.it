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
    if (req.userId) {
      const tasks = await db
        .select()
        .from(tasksTable)
        .where(eq(tasksTable.userId, req.userId));

      console.log("Getting tasks from the database: ", tasks.length);

      res.json({ tasks });
    }
  } catch (error) {
    console.error("Database error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// GET all tasks of a user from the given list (should this be in list router)
taskRouter.get("/:listId", async function (req: Request, res: Response) {});

// GET a specific task
taskRouter.get("/:id", authCheck, async function (req: Request, res: Response) {
  console.log("object");
  try {
    if (req.userId) {
      const task = await db
        .selectDistinct()
        .from(tasksTable)
        .where(
          and(
            eq(tasksTable.id, req.params.id),
            eq(tasksTable.userId, req.userId)
          )
        );
      res.json(task[0]);
    } else {
      res.status(500).json({ error: "user id not found" });
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

      // console.log(result);
      res.json({ message: "success", task: task });
    }
  } catch (error) {
    console.error("Database error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default taskRouter;
