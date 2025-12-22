import mongoose from 'mongoose';

const symptomSchema = new mongoose.Schema({
  Disease: { 
    type: String, 
    required: true 
  },
  // We define all 17 potential symptoms as optional strings
  ...Object.fromEntries(
    Array.from({ length: 17 }, (_, i) => [`Symptom_${i + 1}`, { type: String, default: "" }])
  )
});

const Symptom = mongoose.model('Symptom', symptomSchema);
export default Symptom;