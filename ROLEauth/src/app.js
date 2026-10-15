
// const express = require("express");
// const cookieParser = require("cookie-parser");

// const authRoutes = require("./routes/auth.routes");
// const musicRoute= require("./routes/music.routes");

// const app = express();

// app.use(cookieParser());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// app.get("/", (req, res) => {
//   res.status(200).json({
//     success: true,
//     message: "Server is running successfully!",
//   });
// });

// // Authentication routes
// app.use("/api/auth", authRoutes);
// app.use("/api/music", musicRoutes);

// module.exports = app;





const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/auth.routes");
const musicRoutes = require("./routes/music.routes");

const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/music", musicRoutes);

module.exports = app;
