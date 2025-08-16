import express, { type Request, type Response } from "express";
import dotenv from "dotenv";
import db from "./db/index";
import { fakeuserstable } from "./db/schema";
import { auth } from "./auth";
import { toNodeHandler } from "better-auth/node";

dotenv.config();
const app = express();

// auth routes
app.all("/api/auth/{*any}", toNodeHandler(auth));

app.use(express.json());

app.get("/", async function (req: Request, res: Response) {
  const users = await db.select().from(fakeuserstable);
  console.log("Getting all users from the database: ", users);
  res.json({ users: users });
});

app.post("/new-user", async function (req: Request, res: Response) {
  const user: typeof fakeuserstable.$inferInsert = {
    name: "John",
    age: 30,
    email: "john@example.com",
  };

  await db.insert(fakeuserstable).values(user);
  console.log("New user created!");

  res.json({ message: "success" });
});

app.listen(3000, () => console.log("Server ready on port 3000."));

// module.exports = app;
