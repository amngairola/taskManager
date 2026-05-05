import express from "express";
import cors from "cors";

import userRouter from "./routes/userRoutes.js";

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

app.use(express.json());

app.get("/", (req, res) => {
  res.send("API running...");
});

app.use("/api", userRouter);

export default app;
