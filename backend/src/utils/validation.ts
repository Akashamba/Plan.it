import { z } from "zod";
import { NextFunction, Request, Response } from "express";

export const validateQuery =
  (schema: z.ZodType) => (req: Request, res: Response, next: NextFunction) => {
    try {
      req.validatedQuery = schema.parse(req.query);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.issues });
      }
      return res.status(500).json({ error: "Internal server error" });
    }
  };

export const validateBody =
  (schema: z.ZodType) => (req: Request, res: Response, next: NextFunction) => {
    try {
      req.validatedBody = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res
          .status(400)
          .json({ error: "Validation failed", details: error.issues });
      }
      return res.status(500).json({ error: "Internal server error" });
    }
  };
