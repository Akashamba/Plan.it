import { type Request, type Response, Router } from "express";
import db from "../db";
import { lists as listsTable } from "../db/schema/task-schema";
import { session as sessionTable } from "../db/schema/auth-schema";
import { and, eq, gt } from "drizzle-orm";
import { authCheck } from "../utils/auth-check";

const listRouter = Router();

listRouter.get("/all", authCheck, async function (req: Request, res: Response) {
  try {
    const currentUserId = req.userId;

    if (currentUserId) {
      const lists = await db
        .select()
        .from(listsTable)
        .where(eq(listsTable.userId, currentUserId));

      console.log("Getting lists from the database: ", lists.length);
      res.json({ lists });
    }
  } catch (error) {
    console.error("Database error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// GET all tasks of a user from the given list (should this be in list router)
listRouter.get("/:listId", async function (req: Request, res: Response) {});

export default listRouter;
