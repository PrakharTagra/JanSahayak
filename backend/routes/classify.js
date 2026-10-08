const express = require("express");
const router = express.Router();
const multer = require("multer");
const axios = require("axios");
const FormData = require("form-data");

// Use memory storage: avoids read-only filesystem restrictions on serverless and ephemeral containers
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

router.post("/", upload.single("image"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: "No image uploaded" });
  }

  try {
    // Forward image buffer directly to Python ML service
    const form = new FormData();
    form.append("image", req.file.buffer, {
      filename: req.file.originalname || "upload.jpg",
      contentType: req.file.mimetype || "image/jpeg",
    });

    const mlUrl = (process.env.ML_SERVICE_URL || "https://jansahayak-9afz.onrender.com").replace(/\/+$/, "");
    const targetEndpoint = mlUrl.endsWith("/predict") ? mlUrl : `${mlUrl}/predict`;

    const mlResponse = await axios.post(
      targetEndpoint,
      form,
      {
        headers: form.getHeaders(),
        timeout: 45000 // 45s timeout to allow cold starts
      }
    );

    const { category, confidence, all_scores } = mlResponse.data;

    return res.json({
      success: true,
      category,
      confidence,
      all_scores,
    });
  } catch (error) {
    console.error("Classification error:", error.message);
    const isTimeout = error.code === "ECONNABORTED" || error.message.includes("timeout");
    return res.status(200).json({
      success: false,
      fallback: true,
      category: null,
      message: isTimeout
        ? "AI vision service is spinning up. Please select the category manually."
        : "AI classification is currently unavailable. Please select the category manually.",
    });
  }
});

module.exports = router;