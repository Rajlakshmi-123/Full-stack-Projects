// const mongoose = require("mongoose")
// const dns = require("dns") 

// dns.setServers([
//     '1.1.1.1',
//      '8.8.8.8'
// ])

// async function connectDB() {
//       await mongoose.connect("mongodb+srv://first_user:0TObJ6KHCdxv656D@cluster0.pdgql3v.mongodb.net/authentication_database") 

//       console.log("connected to DB")
// }

// module.exports = connectDB ;


const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGO_URI);

    console.log(`MongoDB connected: ${connection.connection.host}`);
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    throw error;
  }
};

module.exports = connectDB;