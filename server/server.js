import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";
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

app.use(cookieParser());
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));



// app.use(cors({
//   origin: process.env.FRONTEND_URL,
//   credentials: true,
//   allowedHeaders: ['Content-Type', 'Authorization'] // Authorization MUST be here
// }));

app.use(
  cors({
    origin: ["https://health-bridge-medical-website-wgbm.vercel.app/"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }),
);

app.use(express.json());

await connectDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/diseasedesc", diseaseDescRoutes);
app.use("/api/precaution", PrecautionRoutes);
app.use("/api/symptoms", symptomsRoutes);
app.use("/api/admin", AdminRoutes);
app.use("/api/doctors", doctorRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Backend running on http://localhost:${PORT}`);
});
