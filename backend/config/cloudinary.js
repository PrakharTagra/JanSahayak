const cloudinary = require("cloudinary").v2;
const multer = require("multer");
const { Readable } = require("stream");

// ✅ cloudinary configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ✅ memory storage configuration (avoids pipeline crash if Cloudinary rejects mid-stream)
const storage = multer.memoryStorage();

// ✅ multer instance
const upload = multer({ 
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }
});

// ✅ helper to upload memory buffer to Cloudinary
const uploadToCloudinary = (buffer, options = {}) => {
    return new Promise((resolve, reject) => {
        if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
            return reject(new Error("Cloudinary credentials are not configured"));
        }

        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: "jansahayak",
                transformation: [{ width: 800, height: 600, crop: "limit" }],
                ...options,
            },
            (error, result) => {
                if (error) return reject(error);
                resolve(result);
            }
        );

        Readable.from(buffer).pipe(uploadStream);
    });
};

module.exports = { cloudinary, upload, uploadToCloudinary };