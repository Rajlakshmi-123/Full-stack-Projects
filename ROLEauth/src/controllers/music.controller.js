
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const Music = require("../models/music.model");
const Album = require("../models/album.model");
const { uploadFile } = require("../services/storage.service");

const createMusic = async (req, res) => {
  try {
    // 1. Check whether token exists
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token not found. Please login first."
      });
    }

    // 2. Verify token
    let decoded;

    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token"
      });
    }

    // 3. Check artist role
    if (decoded.role !== "artist") {
      return res.status(403).json({
        success: false,
        message: "You don't have access to create music"
      });
    }

    // 4. Validate artist ID
    if (!mongoose.isValidObjectId(decoded.userId)) {
      return res.status(401).json({
        success: false,
        message: "Invalid user information in token"
      });
    }

    // 5. Get music details
    const { title} = req.body;

    if (
      typeof title !== "string" || !title.trim() 
    ) {
      return res.status(400).json({
        success: false,
        message: "Title and type are required"
      });
    }

    // 6. Check uploaded audio file
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload an audio file"
      });
    }

    // 7. Upload audio to ImageKit
    const uploadedFile = await uploadFile(
      req.file.buffer,
      req.file.originalname
    );

    // 8. Create music document in MongoDB
    const music = await Music.create({
    
      uri: uploadedFile.url,
      title: title.trim(), 
      artist: decoded.userId
    });

    // 9. Return response with artist details
    const savedMusic = await Music.findById(music._id)
      .populate("artist", "username email role");

    return res.status(201).json({
      success: true,
      message: "Music created successfully",
      data: savedMusic
    });

  } catch (error) {
    console.error("Create music error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to create music"
    });
  }
};


const createAlbum = async (req, res) => {
    try {
        // 1. Check whether token exists
        const token = req.cookies?.token;

        if (!token) {
            return res.status(401).json({
                message: "Token is required"
            });
        }

        // 2. Verify token
        let decoded;

        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (error) {
            return res.status(401).json({
                message: "Invalid or expired token"
            });
        }

        // 3. Check whether user is an artist
        if (decoded.role !== "artist") {
            return res.status(403).json({
                message: "You don't have access to create an album"
            });
        }

        // 4. Get data from request body
        const { title, musicIDs } = req.body;

        if (!title || !Array.isArray(musicIDs)) {
            return res.status(400).json({
                message: "Title and musicIDs are required"
            });
        }

        // 5. Create album
        const album = await Album.create({
            title,
            artist: decoded.id,
            musics: musicIDs
        });

        // 6. Send response
        return res.status(201).json({
            message: "Album created successfully",
            data: album
        });

    } catch (error) {
        console.error("Create album error:", error);

        return res.status(500).json({
            message: "Failed to create album",
            error: error.message
        });
    }
};



module.exports = { createMusic  , createAlbum };
