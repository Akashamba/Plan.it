import express, {
  type Request,
  type Response,
  type NextFunction,
} from "express";
import "dotenv/config";
import db from "./db/index.js";
import { user } from "./db/schema/auth-schema.js";
import { auth } from "./auth.js";
import { toNodeHandler } from "better-auth/node";
import cors from "cors";

const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173"], // React app URL
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);

// auth routes
// app.all("/api/auth/{*any}", toNodeHandler(auth));
app.all(
  "/api/auth/{*any}",
  (req: Request, res: Response, next: NextFunction) => {
    console.log(`Incoming ${req.method} request to ${req.path}`);
    next();
  },
  toNodeHandler(auth)
);

app.use(express.json());

app.get("/", async function (req: Request, res: Response) {
  const users = await db.select().from(user);
  console.log("Getting all users from the database: ", users.length);
  res.json({ users: users });
});

app.listen(3000, () => console.log("Server ready on port 3000."));

// module.exports = app;
