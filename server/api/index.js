import app from "../server.js";
import { connectDB } from "../db.js";

let isConnected = false;

async function connectDatabase() {
  if (!isConnected) {
    await connectDB();
    isConnected = true;
    console.log("✅ MongoDB Connected");
  }
}

export default async function handler(req, res) {
  await connectDatabase();
  return app(req, res);
}
