import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRouter from "./routes/userRoutes.js";
import adminRoutes from "./routes/adminRoutes.js"; // ✅ Add this import

const app = express();

// ✅ Middleware order matters
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// Routes
app.get("/", (req, res) => {
  res.send("API running...");
});

app.use("/api", userRouter);
app.use("/api/admin", adminRoutes);

export default app;
