import mongoose from "mongoose";

const patientSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
    },
    disease: {
      type: String,
    },
   
    location: {
        type: String,
    },
    isCured: { type: Boolean, default: false } // <--- Added this field
  },
  { timestamps: true }
);

export default mongoose.model("Patient", patientSchema);
