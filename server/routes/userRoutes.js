import express from "express";
import User from "../models/userModel.js";
import { authenticateUser } from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ Protected Route: Get User Profile
router.get("/profile", authenticateUser, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select("-hashed_password"); // Exclude password

        if (!user) return res.status(404).json({ message: "User not found" });

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
});

router.get("/:email", async (req, res) => {
    console.log(`🔍 Received request for email: ${req.params.email}`);

    try {
        // Run case-insensitive search
        const user = await User.findOne({ email: new RegExp(`^${req.params.email}$`, "i") });

        console.log(`📢 MongoDB Response:`, user);

        if (!user) {
            console.log("❌ User not found");
            return res.status(404).json({ message: "User not found" });
        }

        res.json(user);
    } catch (error) {
        console.error("❌ API Error:", error);
        res.status(500).json({ message: "Server error", error });
    }
});

export default router;
