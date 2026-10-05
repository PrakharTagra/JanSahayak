const express = require("express");
const router = express.Router();
const multer = require("multer");
const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs");
const path = require("path");

// Ensure upload directory exists
const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const upload = multer({ dest: uploadDir });

router.post("/", upload.single("image"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: "No image uploaded" });
  }

  const filePath = req.file.path;

  try {
    // Forward image to Python ML service
    const form = new FormData();
    form.append("image", fs.createReadStream(filePath), req.file.originalname);

    const mlUrl = (process.env.ML_SERVICE_URL || "https://jansahayak-ml-service.onrender.com").replace(/\/+$/, "");
    const targetEndpoint = mlUrl.endsWith("/predict") ? mlUrl : `${mlUrl}/predict`;

    const mlResponse = await axios.post(
      targetEndpoint,
      form,
      {
        headers: form.getHeaders(),
        timeout: 45000 // 45s timeout
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
    // Return HTTP 200 with fallback indicator so client doesn't hit a 500/503 network crash
    return res.status(200).json({
      success: false,
      fallback: true,
      category: null,
      message: isTimeout
        ? "AI vision service is spinning up on Render. Please select the category manually."
        : "AI classification is currently unavailable. Please select the category manually.",
    });
  } finally {
    // Ensure uploaded temp file is always cleaned up
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (cleanupErr) {
      console.error("Failed to delete temp file:", cleanupErr.message);
    }
  }
});

module.exports = router;