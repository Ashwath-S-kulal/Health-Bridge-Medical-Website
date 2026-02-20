import Symptom from '../models/symptoms.model.js';

export const getSymptomsByDisease = async (req, res) => {
  try {
    const { disease } = req.query; // Backend expects 'disease'
    if (!disease) return res.status(400).json({ message: "Required" });

    const records = await Symptom.find({ 
        Disease: { $regex: new RegExp(`^${disease}$`, 'i') } 
    });
    
    // Your cleaning logic remains the same
    const cleanedRecords = records.map(record => {
      const row = record.toObject();
      return Object.keys(row)
        .filter(key => key.startsWith('Symptom_'))
        .map(key => row[key]?.trim().replace(/_/g, ' '))
        .filter(val => val && val !== "");
    });

    res.status(200).json(cleanedRecords);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

export const getDiseaseList = async (req, res) => {
  try {
    const diseases = await Symptom.distinct("Disease");
    res.status(200).json(diseases.sort());
  } catch (error) {
    res.status(500).json({ message: "Error fetching list", error });
  }
};