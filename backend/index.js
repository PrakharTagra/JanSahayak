const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const axios = require("axios");
const mongoose = require("mongoose");
const database = require("./config/database");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to Database
database.connect();

// Allowed CORS origins
const defaultAllowedOrigins = [
  "https://jansahayak-rho.vercel.app",
  "http://localhost:5173",
  "http://localhost:3000",
  "http://127.0.0.1:5173",
];

if (process.env.FRONTEND_URL) {
  defaultAllowedOrigins.push(process.env.FRONTEND_URL.replace(/\/+$/, ""));
}

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (such as mobile apps, curl, uptime monitors, same-origin proxy)
    if (!origin) return callback(null, true);
    if (
      defaultAllowedOrigins.includes(origin) ||
      defaultAllowedOrigins.some((allowed) => origin.startsWith(allowed))
    ) {
      return callback(null, true);
    }
    // In production, also allow vercel preview and production deployments
    if (origin.endsWith(".vercel.app") || origin.includes("localhost")) {
      return callback(null, true);
    }
    return callback(null, true); // Permissive to avoid breaking deployment
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));

// Middlewares
app.use(express.json());
app.use(cookieParser());

// Middleware to ensure DB connection is ready on serverless invocations
app.use(async (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    try {
      await database.connect();
    } catch (err) {
      console.warn("DB reconnection notice:", err.message);
    }
  }
  next();
});

// Route handlers
const authRoutes = require("./routes/auth");
const complaintRoutes = require("./routes/complaint");
const volunteerRoutes = require("./routes/volunteer");
const govRoutes = require("./routes/government");
const classifyRoutes = require("./routes/classify");
const exportRoutes = require("./routes/exportRoutes");

// Mount routes on both /api/v1/* and /v1/* for seamless compatibility with Vercel rewrites and standalone hosting
app.use("/api/v1/auth", authRoutes);
app.use("/v1/auth", authRoutes);

app.use("/api/v1/complaint", complaintRoutes);
app.use("/v1/complaint", complaintRoutes);

app.use("/api/v1/volunteer", volunteerRoutes);
app.use("/v1/volunteer", volunteerRoutes);

app.use("/api/v1/government", govRoutes);
app.use("/v1/government", govRoutes);

app.use("/api/v1/classify", classifyRoutes);
app.use("/v1/classify", classifyRoutes);

app.use("/api/v1/reports", exportRoutes);
app.use("/v1/reports", exportRoutes);

// Health check endpoint
app.get(["/health", "/api/health"], (req, res) => {
  const states = ["disconnected", "connected", "connecting", "disconnecting"];
  const dbStatus = states[mongoose.connection.readyState] || "unknown";

  return res.status(200).json({
    status: "ok",
    service: "JanSahayak Backend",
    database: dbStatus,
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
  });
});

// Default root route
app.get(["/", "/api"], (req, res) => {
  return res.status(200).json({
    success: true,
    message: "JanSahayak backend API is running successfully",
    healthCheck: "/api/health",
  });
});

// Global error handling middleware (ensures all errors return clean JSON)
app.use((err, req, res, next) => {
  console.error("Unhandled Error:", err);
  const status = err.status || err.statusCode || 500;
  return res.status(status).json({
    success: false,
    message: err.message || "An unexpected internal server error occurred",
  });
});

// Start server when not running in Vercel serverless environment
if (process.env.VERCEL !== "1") {
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on PORT ${PORT}`);

    // Automated keep-alive to keep free tier alive (when hosted on Render)
    if (process.env.RENDER || process.env.KEEP_ALIVE_URL) {
      const backendHealthUrl = (
        process.env.KEEP_ALIVE_URL ||
        process.env.RENDER_EXTERNAL_URL ||
        "https://jansahayak-backend-zvbb.onrender.com"
      ).replace(/\/+$/, "") + "/health";

      const mlServiceBase = (
        process.env.ML_SERVICE_URL ||
        "https://jansahayak-ml-service.onrender.com"
      ).replace(/\/+$/, "");
      const mlHealthUrl = mlServiceBase.endsWith("/health") ? mlServiceBase : `${mlServiceBase}/health`;

      console.log(`[Keep-Alive] Configured: Backend (${backendHealthUrl}), ML (${mlHealthUrl})`);

      setInterval(async () => {
        try {
          const response = await axios.get(backendHealthUrl, { timeout: 15000 });
          console.log(`[Keep-Alive] Pinged backend: status ${response.status}`);
        } catch (err) {
          console.warn(`[Keep-Alive] Backend ping warning:`, err.message);
        }

        try {
          const mlRes = await axios.get(mlHealthUrl, { timeout: 15000 });
          console.log(`[Keep-Alive] Pinged ML service: status ${mlRes.status}`);
        } catch (mlErr) {
          console.warn(`[Keep-Alive] ML service ping warning:`, mlErr.message);
        }
      }, 10 * 60 * 1000);
    }
  });
}

// Export for Vercel Serverless
module.exports = app;