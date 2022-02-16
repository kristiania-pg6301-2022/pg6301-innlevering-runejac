import express, { Express } from "express";
import { AddressInfo } from "net";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import path from "path";
import { QuizRouter } from "./quizRouter";

dotenv.config();
const app: Express = express();
app.use(bodyParser.json());
app.use(cookieParser(process.env.COOKIE_SECRET));

app.use("/api", QuizRouter);
app.use(express.static(path.resolve("..", "client", "dist")));
app.use(
  (req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (req.method === "GET" && !req.path.startsWith("/api")) {
      return res.sendFile(path.resolve("../client/dist/index.html"));
    } else {
      next();
    }
  }
);

const port = process.env.PORT || 5000;

export const server = app.listen(port, function () {
  console.log(
    `Starting server on http://localhost:${
      (server.address() as AddressInfo).port
    }`
  );
});
