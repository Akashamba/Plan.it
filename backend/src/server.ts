import express, { type Request, type Response } from "express";
import "dotenv/config";

import { authRouter } from "./auth";
import taskRouter from "./routes/task-routes";

const app = express();

// auth routes
app.use("/api/auth", authRouter);

app.use(express.json());

// index route
app.get("/", (req: Request, res: Response) => {
  res.send("Hello from server!");
});

// task routes
app.use("/tasks", taskRouter);

app.listen(process.env.PORT ?? 3000, () =>
  console.log(`Server ready on port ${process.env.PORT ?? 3000}.`)
);
