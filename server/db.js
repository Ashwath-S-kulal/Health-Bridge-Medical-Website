import mongoose from "mongoose";

let isConnected = false;

export const connectDB = async () => {
  if (isConnected) return;

  try {
    if (!process.env.MONGO_URI) throw new Error("MONGO_URI not defined");

    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    isConnected = true;
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error("❌ MongoDB Connection Error:", err.message);
    throw err;
  }

  mongoose.connection.on("disconnected", () => console.warn("⚠️ MongoDB disconnected"));
  mongoose.connection.on("error", (err) => console.error("❌ MongoDB runtime error:", err.message));
};
