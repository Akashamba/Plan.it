import { type Request, type Response, Router } from "express";
import db from "../db";
import { tasks as tasksTable } from "../db/schema/task-schema";

const taskRouter = Router();

taskRouter.get("/", async function (req: Request, res: Response) {
  const tasks = await db.select().from(tasksTable);
  console.log("Getting all tasks from the database: ", tasks.length);
  res.json({ tasks: tasks });
});

export default taskRouter;
