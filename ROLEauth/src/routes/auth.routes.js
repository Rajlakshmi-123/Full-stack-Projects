
const express = require("express");
const router = express.Router();

const { registerUser ,loginUser } = require("../controllers/auth.controller");
 

// POST /api/auth/register
router.post("/register", registerUser);
router.get("/login"  , loginUser)  ;

module.exports = router;
