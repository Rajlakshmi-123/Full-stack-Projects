
const express = require("express");

const authRoutes = require("./routes/auth.routes");
const postRoutes = require("./routes/post.routes") ;

const app = express();

const cookieParser = require("cookie-parser") ;

// Middleware
app.use(express.json());
app.use(cookieParser()) ;

// Home route
app.get("/", (req, res) => {
  res.send("Server is running!");
});

// Authentication routes
app.use("/api/auth", authRoutes);
app.use("/api/post", postRoutes);



module.exports = app;
