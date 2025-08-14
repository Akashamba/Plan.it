const express = require("express"); // convert to import later
import { type Request, type Response } from "express";

const app = express();

app.use(express.static("public"));

app.get("/", function (req: Request, res: Response) {
  res.json({ message: "hello from server!" });
});

app.listen(3000, () => console.log("Server ready on port 3000."));

module.exports = app;
