const express = require("express");
const router = express.Router();

const {
    createComplaint,
    getAllComplaints,
    getComplaintById,
    updateComplaintStatus,
    deleteComplaint,
    getMyComplaints,
    // getComplaintsByCategory,
    getUserDashboardStats,
    getFeed,
    toggleUpvote,  // ✅ add this
} = require("../controllers/complaint.js");

const { isAuthenticated, isGovernment } = require("../middlewares/auth");
const { upload } = require("../config/cloudinary");

// ✅ Safe upload wrapper catching multer errors (e.g. file size limit)
const safeUpload = (req, res, next) => {
    upload.single("photo")(req, res, (err) => {
        if (err) {
            console.error("Multer upload error:", err.message);
            return res.status(400).json({
                success: false,
                message: "File upload error: " + err.message,
            });
        }
        next();
    });
};

// ✅ Specific static routes FIRST
router.get("/feed", getFeed);
router.get("/all", getAllComplaints);
router.get("/my/complaints", isAuthenticated, getMyComplaints);   // moved up
router.get("/user/stats", isAuthenticated, getUserDashboardStats); // moved up

// ✅ Dynamic :id routes LAST
router.get("/:id", getComplaintById);
router.post("/create", isAuthenticated, safeUpload, createComplaint);
router.delete("/:id", isAuthenticated, deleteComplaint);
router.put("/:id/upvote", isAuthenticated, toggleUpvote);
router.put("/:id/status", isAuthenticated, isGovernment, updateComplaintStatus);

module.exports = router;