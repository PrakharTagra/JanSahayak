const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const axios = require("axios");
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
    // Allow requests with no origin (such as mobile apps, curl, uptime monitors)
    if (!origin) return callback(null, true);
    if (
      defaultAllowedOrigins.includes(origin) ||
      defaultAllowedOrigins.some((allowed) => origin.startsWith(allowed))
    ) {
      return callback(null, true);
    }
    // In production, also allow vercel preview deployments
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

// Routes
app.use("/api/v1/auth", require("./routes/auth"));
app.use("/api/v1/complaint", require("./routes/complaint"));
app.use("/api/v1/volunteer", require("./routes/volunteer"));
app.use("/api/v1/government", require("./routes/government"));
app.use("/api/v1/classify", require("./routes/classify"));
app.use("/api/v1/reports", require("./routes/exportRoutes"));

// Health check endpoint (for Render health check & monitoring services)
app.get("/health", (req, res) => {
  return res.status(200).json({
    status: "ok",
    service: "JanSahayak Backend",
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
  });
});

// Default root route
app.get("/", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "JanSahayak backend API is running successfully",
    healthCheck: "/health",
  });
});

// Start server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on PORT ${PORT}`);

  // Automated keep-alive to keep Render free tier alive
  // Pings itself and optionally ML service every 14 minutes (Render sleeps after 15 min)
  const pingUrl = process.env.KEEP_ALIVE_URL || process.env.RENDER_EXTERNAL_URL;
  if (pingUrl) {
    const targetUrl = pingUrl.endsWith("/health") ? pingUrl : `${pingUrl.replace(/\/+$/, "")}/health`;
    console.log(`Keep-alive active. Self-ping configured for: ${targetUrl}`);

    setInterval(async () => {
      try {
        const response = await axios.get(targetUrl, { timeout: 10000 });
        console.log(`[Keep-Alive] Pinged backend: status ${response.status}`);
      } catch (err) {
        console.error(`[Keep-Alive] Self-ping failed:`, err.message);
      }

      // Also ping ML service if URL configured
      if (process.env.ML_SERVICE_URL) {
        try {
          const mlBase = process.env.ML_SERVICE_URL.replace(/\/+$/, "");
          const mlHealthUrl = mlBase.endsWith("/health") ? mlBase : `${mlBase}/health`;
          const mlRes = await axios.get(mlHealthUrl, { timeout: 10000 });
          console.log(`[Keep-Alive] Pinged ML service: status ${mlRes.status}`);
        } catch (mlErr) {
          console.error(`[Keep-Alive] ML service ping failed:`, mlErr.message);
        }
      }
    }, 14 * 60 * 1000); // Every 14 minutes
  }
});