
const express = require("express");
const multer = require("multer");
const router = express.Router();

const { createMusic , createAlbum } = require("../controllers/music.controller");

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 20 * 1024 * 1024 // 20 MB
  }
});

router.post("/create",upload.single("uri"),createMusic);

router.post("/album",createAlbum);


module.exports = router;
