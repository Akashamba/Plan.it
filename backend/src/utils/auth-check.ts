import { NextFunction, Request, Response } from "express";
import { session as sessionTable } from "../db/schema/auth-schema";
import db from "../db";
import { and, eq, gt } from "drizzle-orm";

export const authCheck = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("object 1");
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
    req.userId = userSession[0].userId;
    next();
  } catch (error) {
    console.error("Database error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
