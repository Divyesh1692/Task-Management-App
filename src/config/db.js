require("dotenv").config({ path: "../.env" });
require("dotenv").config();
const mongoose = require("mongoose");

const dbURI = process.env.MONGO_URI;
const connectDB = async () => {
  try {
    const connect = await mongoose.connect(dbURI);
    console.log("MongoDB Connected...");
  } catch (error) {
    console.error("error connecting to MongoDB: " + error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
