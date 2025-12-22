import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import cookieParser from 'cookie-parser'; // 1. Add this import
import { connectDB } from './db.js';
import authRoutes from './routes/auth.route.js';
import cron from 'node-cron';
import userRoutes from './routes/user.route.js';
import diseaseDescRoutes from './routes/diseaseDesc.route.js';
import PrecautionRoutes from './routes/precaution.route.js';
import symptomsRoutes from './routes/symptoms.route.js';
import AdminRoutes from './routes/admin.routes.js';
import doctorRoutes from './routes/doctor.routes.js';

const app = express();
const PORT = process.env.PORT || 5000;

// 2. Add Cookie Parser middleware
app.use(cookieParser()); 

// 3. Update CORS (Important for cookies)
app.use(cors({
  origin: 'http://localhost:5173', // Replace with your frontend URL
  credentials: true                // Allows cookies to be sent back and forth
}));

app.use(express.json());

await connectDB(); 

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use("/api/diseasedesc",diseaseDescRoutes);
app.use('/api/precaution', PrecautionRoutes);
app.use('/api/symptoms', symptomsRoutes);
app.use("/api/admin", AdminRoutes);
app.use('/api/doctors', doctorRoutes);
// ... rest of your code


// Schedule metrics refresh every 6 hours
cron.schedule('0 */6 * * *', async () => {
  console.log('🔄 Running scheduled metrics refresh...');
  await refreshAllMetrics();
});

app.listen(PORT, () => {
  console.log(`🚀 Backend running on http://localhost:${PORT}`);
});