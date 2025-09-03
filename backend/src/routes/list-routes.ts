import { type Request, type Response, Router } from "express";
import db from "../db";
import { lists as listsTable } from "../db/schema/task-schema";
import { session as sessionTable } from "../db/schema/auth-schema";
import { and, eq, gt } from "drizzle-orm";

const listRouter = Router();

listRouter.get("/all", async function (req: Request, res: Response) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : null;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }

  try {
    const userSession = await db
      .select()
      .from(sessionTable)
      .where(
        and(
          eq(sessionTable.token, token),
          gt(sessionTable.expiresAt, new Date())
        )
      );

    if (userSession.length === 0) {
      return res.status(401).json({ error: "Unauthorized: Invalid token" });
    }

    const lists = await db
      .select()
      .from(listsTable)
      .where(eq(listsTable.userId, userSession[0].userId));

    console.log("Getting lists from the database: ", lists.length);
    res.json({ lists });
  } catch (error) {
    console.error("Database error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default listRouter;
