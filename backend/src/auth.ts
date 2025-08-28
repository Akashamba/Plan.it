import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import db from "./db"; // your drizzle instance
import { account, session, user, verification } from "./db/schema/auth-schema";
import { expo } from "@better-auth/expo";
import { NextFunction, Request, Response, Router } from "express";
import { toNodeHandler } from "better-auth/node";

const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } = process.env;
if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
  throw new Error("Missing GOOGLE_CLIENT_ID/GOOGLE_CLIENT_SECRET");
}

export const auth = betterAuth({
  plugins: [expo()],
  database: drizzleAdapter(db, {
    provider: "pg", // or "mysql", "sqlite"
    schema: {
      verification: verification,
      account: account,
      session: session,
      user: user,
    },
  }),
  socialProviders: {
    google: {
      prompt: "select_account",
      clientId: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
    },
  },
  trustedOrigins: [""],
});

export const authRouter = Router().all(
  "/{*any}",
  (req: Request, res: Response, next: NextFunction) => {
    console.log(`Incoming ${req.method} request to ${req.path}`);
    next();
  },
  toNodeHandler(auth)
);
