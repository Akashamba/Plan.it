import { type Request, type Response, Router } from "express";
import db from "../db/index.js";
import { lists as listsTable } from "../db/schema/task-schema.js";
import { and, eq } from "drizzle-orm";
import { authCheck } from "../utils/auth-check.js";
import { validateParams } from "../utils/validation.js";
import { getListSchema } from "../schema/task.schema.js";

const listRouter = Router();

listRouter.get("/", authCheck, async function (req: Request, res: Response) {
  try {
    const currentUserId = req.userId;

    const lists = await db
      .select()
      .from(listsTable)
      .where(eq(listsTable.userId, currentUserId));

    console.log("Getting lists from the database: ", lists.length);
    res.json({ lists });
  } catch (error) {
    console.error("Database error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// GET all info about a given list
listRouter.get(
  "/:id",
  authCheck,
  validateParams(getListSchema),
  async function (req: Request, res: Response) {
    try {
      const currentUserId = req.userId;

      const list = await db.query.lists.findFirst({
        where: and(
          eq(listsTable.userId, currentUserId),
          eq(listsTable.id, req.params.id)
        ),
        with: {
          tasks: true,
        },
      });

      if (!list) {
        return res.status(404).json({
          error: "List not found or you don't have permission to access it",
        });
      }
      return res.json({ list });
    } catch (error) {
      console.error("Database error:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
);

export default listRouter;
