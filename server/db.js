import mongoose from "mongoose";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

export const connectDB = async () => {
  if (isConnected) {
    console.log("✅ Using existing MongoDB connection");
    return mongoose.connection;
  }

  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is not defined in .env file");
    }

    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    return conn.connection;
  } catch (err) {
    console.error("❌ MongoDB Connection Error:", err.message);
    process.exit(1); // Exit process with failure
  }


  // Optional: handle runtime disconnects
  mongoose.connection.on("disconnected", () => {
    console.warn("⚠️ MongoDB disconnected. Trying to reconnect...");
  });

  mongoose.connection.on("error", (err) => {
    console.error("❌ MongoDB runtime error:", err.message);
  });
};
