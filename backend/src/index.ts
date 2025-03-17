import dotenv from "dotenv";
import express, { Express, Request, Response } from "express";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3002;

app.get("/", (req: Request, res: Response) => {
  res.send("hello world");
});

app.listen(port, () => {
  console.log(`server running at http://localhost:${port}`);
});
