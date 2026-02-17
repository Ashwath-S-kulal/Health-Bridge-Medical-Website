import mongoose from "mongoose"


// models/Medicine.js
const medicineSchema = new mongoose.Schema({
  // Use exact strings to match your MongoDB keys
  "Medicine_Name": String,
  "Composition": String,
  "Uses": String,
  "Side_effects": String,
  "Image_URL": String,
  "Manufacturer": String,
  "Excellent_Review_%": Number,
  "Average_Review_%": Number,
  "Poor_Review_%": Number
}, { 
  strict: false, // This allows fields not defined here to pass through
  collection: 'medicines' // Ensure this matches your actual collection name
});


 const Medicine = mongoose.model('Medicine', medicineSchema);
export default Medicine;
