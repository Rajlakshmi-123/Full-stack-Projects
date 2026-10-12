
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

router.post("/create", async (req, res) => {
  try {
    // 1. Log request body and cookies
    console.log("Request Body:", req.body);
    console.log("Request Cookies:", req.cookies);

    // 2. Get token from cookies
    const token = req.cookies?.token;

    // 3. Check if token exists
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Token is missing",
      });
    }

    // 4. Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log("Decoded Token:", decoded);

    // 5. Find user in MongoDB using JWT payload
    const user = await User.findById(decoded.userId).select("-password");

    // 6. Check whether user exists
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: User not found",
      });
    }

    // 7. Console logged-in user data
    console.log("Logged-in User Data:", user);

    // 8. Send success response
    return res.status(201).json({
      success: true,
      message: "Post created successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });

  } catch (error) {
    if (
      error.name === "JsonWebTokenError" ||
      error.name === "TokenExpiredError" ||
      error.name === "NotBeforeError"
    ) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Invalid or expired token",
      });
    }

    console.error("Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

module.exports = router;
