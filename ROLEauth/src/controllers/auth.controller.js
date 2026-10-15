
const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");




const registerUser = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    // 1. Validate required fields
    // if (!username || !email || !password) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "Username, email and password are required",
    //   });
    // }

    // 2. Validate role
    // if (role && !["user", "artist"].includes(role)) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "Role must be either user or artist",
    //   });
    // }

    // 3. Check for an existing username or email
    const existingUser = await User.findOne({
      $or: [
        { username: username.trim() },
        { email: email.trim().toLowerCase() },
      ],
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Username or email already exists",
      });
    }

    // 4. Hash the password
     const hashedPassword = await bcrypt.hash(password, 10);

    // 5. Create user
      const user = await User.create({
      username: username.trim(),
      email: email.trim().toLowerCase(),
      password: hashedPassword ,
      role: role || "user",
    });  


    const token = jwt.sign(
  { userId: user._id ,
     role : user.role ,
   },
  process.env.JWT_SECRET,
  { expiresIn: "1d" }
);   


    res.cookie("token", token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  maxAge: 24 * 60 * 60 * 1000
});


    // 6. Send response without password
    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      token, 
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
         password :  hashedPassword 
      },
    });
  } catch (error) {
    // Handle duplicate-key errors from MongoDB
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Username or email already exists",
      });
    }

    console.error("Registration error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};



const loginUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!password || (!username && !email)) {
      return res.status(400).json({
        success: false,
        message: "Username or email and password are required"
      });
    }

    // Find user using $or
    const user = await User.findOne({
      $or: [
        ...(username ? [{ username: username.trim() }] : []),
        ...(email ? [{ email: email.trim().toLowerCase() }] : [])
      ]
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    // Verify password
    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    // Create JWT
    const token = jwt.sign(
      {
        userId: user._id,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // Store token in cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000
    });

    // Return user data
    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error("Login error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
} ;

module.exports = { registerUser  , loginUser };
