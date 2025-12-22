import mongoose from 'mongoose';

const precautionSchema = new mongoose.Schema({
  Disease: { 
    type: String, 
    required: true, 
    unique: true 
  },
  Precaution_1: { type: String, required: true },
  Precaution_2: { type: String, required: true },
  Precaution_3: { type: String, required: true },
  Precaution_4: { type: String, required: true },
});

const Precaution = mongoose.model('Precaution', precautionSchema);

export default Precaution;
