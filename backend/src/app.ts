import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes";
import entryRoutes from "./routes/entryRoutes";

const app = express();

app.use(cors({
  origin: "http://localhost:5173", // Vite server
  credentials: true
}));

app.use(express.json());

// health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", message: "Food diary API is running" });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/entries", entryRoutes);

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: err.message || "Internal server error",
  });
});

export default app;
