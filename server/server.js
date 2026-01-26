import express from "express";
import cookieParser from "cookie-parser";
import "dotenv/config";
import { connectDB } from "./db.js";
import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import diseaseDescRoutes from "./routes/diseaseDesc.route.js";
import PrecautionRoutes from "./routes/precaution.route.js";
import symptomsRoutes from "./routes/symptoms.route.js";
import AdminRoutes from "./routes/admin.routes.js";
import doctorRoutes from "./routes/doctor.routes.js";

const app = express();
const PORT = process.env.PORT || 5000;

// --- MIDDLEWARE ---
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- CORS CONFIG FOR PRODUCTION ---
app.use((req, res, next) => {
  const allowedOrigin = "https://health-bridge-medical-website-wgbm.vercel.app";

  res.header("Access-Control-Allow-Origin", allowedOrigin);
  res.header("Access-Control-Allow-Credentials", "true");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS"
  );

  // handle preflight
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

// --- CONNECT TO DB ---
await connectDB();

// --- ROUTES ---
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/diseasedesc", diseaseDescRoutes);
app.use("/api/precaution", PrecautionRoutes);
app.use("/api/symptoms", symptomsRoutes);
app.use("/api/admin", AdminRoutes);
app.use("/api/doctors", doctorRoutes);

// --- START SERVER ---
app.listen(PORT, () => {
  console.log(`🚀 Backend running on port ${PORT}`);
});
