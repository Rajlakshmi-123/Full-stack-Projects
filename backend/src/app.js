
require("dotenv").config();

const cors = require("cors");

const express = require("express");
const multer = require("multer");
const Post = require("./models/post.model");
const { uploadFile } = require("./services/storage.service");

const app = express();
app.use(cors());
app.use(express.json());

// Multer memory storage
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024 // 5 MB
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith("image/")) {
            cb(null, true);
        } else {
            cb(new Error("Only image files are allowed"));
        }
    }
});

// POST API: Create a post
app.post("/create-post", upload.single("image"), async (req, res) => {
    try {
        console.log("Request Body:", req.body);

        if (!req.file) {
            return res.status(400).json({
                message: "Image is required"
            });
        }

        const { caption } = req.body;

        if (!caption || !caption.trim()) {
            return res.status(400).json({
                message: "Caption is required"
            });
        }

        console.log("Uploaded File:", {
            originalname: req.file.originalname,
            mimetype: req.file.mimetype,
            size: req.file.size
        });

        // Upload image using storage service
        const imageUrl = await uploadFile(
            req.file.buffer,
            `${Date.now()}-${req.file.originalname}`
        );

        // Save image URL and caption in MongoDB
        const post = await Post.create({
            image: imageUrl,
            caption: caption.trim()
        });

        return res.status(201).json({
            message: "Post created successfully",
            post
        });

    } catch (error) {
        console.error("Create Post Error:", error.message);

        return res.status(500).json({
            message: "Failed to create post",
            error: error.message
        });
    }
});

// GET API: Fetch all posts
app.get("/posts", async (req, res) => {
    try {
        const posts = await Post.find();

        res.status(200).json({
            message: "Posts fetched successfully",
            posts: posts
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch posts",
            error: error.message
        });
    }
});

module.exports = app;
