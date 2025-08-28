import { type Request, type Response, Router } from "express";
import db from "../db";
import { tasks as tasksTable } from "../db/schema/task-schema";
import { auth } from "../auth";
import { session as sessionTable } from "../db/schema/auth-schema";
import { eq } from "drizzle-orm";

const taskRouter = Router();

taskRouter.get("/", async function (req: Request, res: Response) {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }

  const userSession = await db
    .select()
    .from(sessionTable)
    .where(eq(sessionTable.token, token));

  if (userSession.length === 0) {
    return res.status(401).json({ error: "Unauthorized: Invalid token" });
  }

  const tasks = await db
    .select()
    .from(tasksTable)
    .where(eq(tasksTable.userId, userSession[0].userId));

  console.log("Getting tasks from the database: ", tasks.length);
  res.json({ tasks });
});

export default taskRouter;
