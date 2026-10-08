const mongoose = require('mongoose');

let isConnected = false;

exports.connect = async () => {
    if (mongoose.connection.readyState >= 1) {
        return mongoose.connection;
    }
    if (!process.env.MONGODB_URL) {
        console.warn("⚠️ MONGODB_URL is not defined in environment variables. Database connection deferred.");
        return;
    }
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URL, {
            serverSelectionTimeoutMS: 5000,
        });
        isConnected = true;
        console.log("✅ Database Connected Successfully");
        return conn;
    } catch (err) {
        console.error("❌ Database connection error:", err.message);
    }
};