import express, { NextFunction, type Request, type Response } from "express";
import "dotenv/config";

import { auth } from "./auth";
import taskRouter from "./routes/task-routes";
import { toNodeHandler } from "better-auth/node";
import listRouter from "./routes/list-routes";

const app = express();

// auth routes
app.all(
  "/api/auth/{*any}",
  (req: Request, res: Response, next: NextFunction) => {
    console.log(`Incoming ${req.method} request to ${req.path}`);
    next();
  },
  toNodeHandler(auth)
);

app.use(express.json());

// index route
app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Hello from server!" });
});

// task routes
app.use("/api/task", taskRouter);

// list routes
app.use("/api/list", listRouter);

app.listen(process.env.PORT ?? 3000, () =>
  console.log(`Server ready on port ${process.env.PORT ?? 3000}.`)
);
