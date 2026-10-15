
const mongoose = require("mongoose");

const dns = require("dns") 

dns.setServers([
    '1.1.1.1',
     '8.8.8.8'
])

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB Atlas");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    throw error;
  }
};

module.exports = connectDB;
