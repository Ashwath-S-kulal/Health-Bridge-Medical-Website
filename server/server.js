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
import patientRoutes from "./routes/patient.route.js"
import dietRoutes from "./routes/diet.routes.js"

const app = express();
const PORT = process.env.PORT || 5000;


app.use(
  cors({
    origin: process.env.FRONTEND_URL, 
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

await connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/diseasedesc", diseaseDescRoutes);
app.use("/api/precaution", precautionRoutes);
app.use("/api/symptoms", symptomsRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/medicine", medicineDataRoutes)
app.use("/api/patient", patientRoutes);
app.use("/api/diet",dietRoutes)


app.get("/", (req, res) => {
  res.send("API is running...");
});

app.listen(PORT, () => {
  console.log(` Backend running on port ${PORT}`);
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
// import medicineDataRoutes from "./routes/medicineData.route.js"
// import patientRoutes from "./routes/patient.route.js"

// const app = express();

// // Middleware
// app.use(cookieParser());

// app.use(cors({
//     origin: process.env.FRONTEND_URL,
//     credentials: true,
//     allowedHeaders: ["Content-Type", "Authorization"],
//   }));
  
//   app.use(express.json());
//   app.use(express.urlencoded({ extended: true }));
  
//   // Test Route
//   app.get("/", (req, res) => {
//       res.json({ message: "API Working " });
//     });
    
//     app.use("/api/auth", authRoutes);
//     app.use("/api/user", userRoutes);
//     app.use("/api/diseasedesc", diseaseDescRoutes);
//     app.use("/api/precaution", precautionRoutes);
//     app.use("/api/symptoms", symptomsRoutes);
//     app.use("/api/admin", adminRoutes);
//     app.use("/api/doctors", doctorRoutes);
//     app.use("/api/medicine", medicineDataRoutes)
//     app.use("/api/patient", patientRoutes);

// export default app;
