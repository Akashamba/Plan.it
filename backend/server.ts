import express, { type Request, type Response } from "express";
import dotenv from "dotenv";
import db from "./db/index";
import { usersTable } from "./db/schema";

dotenv.config();
const app = express();

app.use(express.static("public"));

app.get("/", async function (req: Request, res: Response) {
  const users = await db.select().from(usersTable);
  console.log("Getting all users from the database: ", users);
  res.json({ users: users });
});

app.post("/new-user", async function (req: Request, res: Response) {
  const user: typeof usersTable.$inferInsert = {
    name: "John",
    age: 30,
    email: "john@example.com",
  };

  await db.insert(usersTable).values(user);
  console.log("New user created!");

  res.json({ message: "success" });
});

app.listen(3000, () => console.log("Server ready on port 3000."));

// module.exports = app;
