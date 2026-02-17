import express from "express";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";

import { connectDB } from "./db.js";
import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import diseaseDescRoutes from "./routes/diseaseDesc.route.js";
import precautionRoutes from "./routes/precaution.route.js";
import symptomsRoutes from "./routes/symptoms.route.js";
import adminRoutes from "./routes/admin.routes.js";
import doctorRoutes from "./routes/doctor.routes.js";
import medicineDataRoutes from "./routes/medicineData.route.js"

const app = express();
const PORT = process.env.PORT || 5000;

/* ===========================
   ✅ CORS CONFIG (VERY IMPORTANT)
=========================== */

app.use(
  cors({
    origin: process.env.FRONTEND_URL, // Must match your Vercel domain
    credentials: true,
  })
);

/* ===========================
   ✅ MIDDLEWARE
=========================== */

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

/* ===========================
   ✅ DATABASE CONNECTION
=========================== */

await connectDB();

/* ===========================
   ✅ ROUTES
=========================== */

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/diseasedesc", diseaseDescRoutes);
app.use("/api/precaution", precautionRoutes);
app.use("/api/symptoms", symptomsRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/medicine", medicineDataRoutes)

/* ===========================
   ✅ TEST ROUTE
=========================== */

app.get("/", (req, res) => {
  res.send("API is running...");
});

/* ===========================
   ✅ START SERVER
=========================== */

app.listen(PORT, () => {
  console.log(`🚀 Backend running on port ${PORT}`);
});



// import express from "express";
// import cors from "cors";
// import cookieParser from "cookie-parser";

// import authRoutes from "./routes/auth.route.js";
// import userRoutes from "./routes/user.route.js";
// import diseaseDescRoutes from "./routes/diseaseDesc.route.js";
// import precautionRoutes from "./routes/precaution.route.js";
// import symptomsRoutes from "./routes/symptoms.route.js";
// import adminRoutes from "./routes/admin.routes.js";
// import doctorRoutes from "./routes/doctor.routes.js";

// const app = express();

// // Middleware
// app.use(cookieParser());

// app.use(cors({
//   origin: process.env.FRONTEND_URL,
//   credentials: true,
//   allowedHeaders: ["Content-Type", "Authorization"],
// }));

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // Test Route
// app.get("/", (req, res) => {
//   res.json({ message: "API Working 🚀" });
// });

// // Routes
// app.use("/api/auth", authRoutes);
// app.use("/api/user", userRoutes);
// app.use("/api/diseasedesc", diseaseDescRoutes);
// app.use("/api/precaution", precautionRoutes);
// app.use("/api/symptoms", symptomsRoutes);
// app.use("/api/admin", adminRoutes);
// app.use("/api/doctors", doctorRoutes);

// export default app;
