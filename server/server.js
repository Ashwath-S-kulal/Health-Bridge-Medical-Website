import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import { connectDB } from './db.js';
import authRoutes from './routes/auth.route.js';
import userRoutes from './routes/user.route.js';
import diseaseDescRoutes from './routes/diseaseDesc.route.js';
import PrecautionRoutes from './routes/precaution.route.js';
import symptomsRoutes from './routes/symptoms.route.js';
import AdminRoutes from './routes/admin.routes.js';
import doctorRoutes from './routes/doctor.routes.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cookieParser()); 

app.use(cors({
  origin: process.env.FRONTEND_URL, 
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'] // Authorization MUST be here
}));

app.use(express.json());

await connectDB(); 


// Add this before your app.use('/api/auth', ...)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', process.env.FRONTEND_URL);
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  // Handle the OPTIONS preflight immediately
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});



// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use("/api/diseasedesc",diseaseDescRoutes);
app.use('/api/precaution', PrecautionRoutes);
app.use('/api/symptoms', symptomsRoutes);
app.use("/api/admin", AdminRoutes);
app.use('/api/doctors', doctorRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Backend running on http://localhost:${PORT}`);
});