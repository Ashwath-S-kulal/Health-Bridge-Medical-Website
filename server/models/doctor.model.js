import mongoose from 'mongoose';

const doctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  specialty: { type: String, required: true },
  experience: String,
  rating: { type: Number, default: 0 },
  reviews: { type: Number, default: 0 },
  education: String,
  languages: [String],
  contactDays: { type: String, default: "Mon - Fri" },
  contactTime: { type: String, default: "09:00 AM - 05:00 PM" }, 
  email: { type: String, required: true, unique: true },
  phone: String,
  whatsapp: String,
  address: String,
  about: String,
  verified: { type: Boolean, default: false },
  image: String,
}, { timestamps: true });

const Doctor = mongoose.model('Doctor', doctorSchema);
export default Doctor;