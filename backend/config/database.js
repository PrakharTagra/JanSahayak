const mongoose = require('mongoose');

exports.connect = () => {
    if (!process.env.MONGODB_URL) {
        console.warn("⚠️ MONGODB_URL is not defined in environment variables. Database connection deferred.");
        return;
    }
    mongoose.connect(process.env.MONGODB_URL, {
        serverSelectionTimeoutMS: 5000,
    })
        .then(() => console.log("✅ Database Connected Successfully"))
        .catch((err) => console.error("❌ Database connection error:", err.message));
};