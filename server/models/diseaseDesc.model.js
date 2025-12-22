import mongoose from 'mongoose';

const diseaseSchema = new mongoose.Schema({
  Disease: { type: String, required: true },
  Description: { type: String, required: true },
});

const DiseaseDescription = mongoose.model(
  'DiseaseDescription',
  diseaseSchema
);

export default DiseaseDescription;
