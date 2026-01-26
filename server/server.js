import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";
import { connectDB } from "./db.js";

// Route Imports - Ensure filenames match exactly (case-sensitive for Render)
import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import diseaseDescRoutes from "./routes/diseaseDesc.route.js";
import PrecautionRoutes from "./routes/precaution.route.js";
import symptomsRoutes from "./routes/symptoms.route.js";
import AdminRoutes from "./routes/admin.routes.js"; // Matches your admin.routes.js
import doctorRoutes from "./routes/doctor.routes.js";

const app = express();
const PORT = process.env.PORT || 5000;

// 1. Database Connection
// In production, it's safer to wrap this or handle it before the listen
connectDB().catch(err => console.error("MongoDB Connection Error:", err));

// 2. Global Middleware
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 3. CORS Configuration
// Put this BEFORE your routes. 
app.use(cors({
  origin: [
    "https://health-bridge-medical-website-wgbm.vercel.app",
    "http://localhost:5173" // Good for local testing
  ],
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

// Handle preflight (OPTIONS) requests for all routes
app.options("*", cors());

// 4. API Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/diseasedesc", diseaseDescRoutes);
app.use("/api/precaution", PrecautionRoutes);
app.use("/api/symptoms", symptomsRoutes);
app.use("/api/admin", AdminRoutes);
app.use("/api/doctors", doctorRoutes);

// 5. Health Check (Very helpful for Render/Vercel debugging)
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", message: "Server is running" });
});

// 6. Global Error Handler (This will help you see errors in Render logs)
app.use((err, req, res, next) => {
  console.error("Internal Server Error:", err.stack);
  res.status(500).json({ error: "Internal Server Error", message: err.message });
});

app.listen(PORT, () => {
  console.log(`🚀 Backend running on port ${PORT}`);
});