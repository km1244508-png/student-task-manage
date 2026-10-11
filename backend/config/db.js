const mongoose = require("mongoose");

// Connects the app to MongoDB using the URI from the .env file
const connectDB = async () => {
  const uri = process.env.MONGO_URI;

  if (!uri) {
    console.error("MONGO_URI is missing. Create a .env file (see .env.example).");
    process.exit(1);
  }

  try {
    await mongoose.connect(uri, { family: 4, serverSelectionTimeoutMS: 20000 });
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
