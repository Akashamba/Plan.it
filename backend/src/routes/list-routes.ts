import { type Request, type Response, Router } from "express";
import db from "../db";
import { lists as listsTable } from "../db/schema/task-schema";
import { session as sessionTable } from "../db/schema/auth-schema";
import { and, eq, gt } from "drizzle-orm";
import { authCheck } from "../utils/auth-check";

const listRouter = Router();

listRouter.get("/", authCheck, async function (req: Request, res: Response) {
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

// GET all info about a given list
listRouter.get("/:id", authCheck, async function (req: Request, res: Response) {
  try {
    const currentUserId = req.userId;

    if (currentUserId) {
      const lists = await db.query.lists.findFirst({
        where: and(
          eq(listsTable.userId, currentUserId),
          eq(listsTable.id, req.params.id)
        ),
        with: {
          tasks: true,
        },
      });

      res.json({ lists });
    }
  } catch (error) {
    console.error("Database error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default listRouter;
