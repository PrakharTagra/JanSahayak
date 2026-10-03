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

    const mlUrl = (process.env.ML_SERVICE_URL || "http://localhost:5001").replace(/\/+$/, "");
    const targetEndpoint = mlUrl.endsWith("/predict") ? mlUrl : `${mlUrl}/predict`;

    const mlResponse = await axios.post(
      targetEndpoint,
      form,
      {
        headers: form.getHeaders(),
        timeout: 45000 // Render free tier can take a few seconds to respond
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
    return res.status(500).json({
      success: false,
      message: "Classification failed: " + (error.response?.data?.error || error.message),
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