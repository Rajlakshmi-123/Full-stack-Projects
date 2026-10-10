const mongoose = require("mongoose")
const dns = require("dns") 

dns.setServers([
    '1.1.1.1',
     '8.8.8.8'
])

async function connectDB() {
      await mongoose.connect("mongodb+srv://first_user:0TObJ6KHCdxv656D@cluster0.pdgql3v.mongodb.net/project1") 

      console.log("connected to DB")
}

module.exports = connectDB ;