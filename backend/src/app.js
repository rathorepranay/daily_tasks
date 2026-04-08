import express from "express";
import userRouter from "./routes/auth.routes.js";
import Logger from "./utils/logger.js";

const app = express();
const logger = new Logger("App");

// Body parsing middleware
app.use(express.json());

// Middleware: Request logging
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`, {
    query: req.query,
    body: req.body,
  });
  next();
});

// Routes
app.use("/api/users", userRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error(`Unhandled error: ${err.message}`, { stack: err.stack });
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
  });
});

export default app;
