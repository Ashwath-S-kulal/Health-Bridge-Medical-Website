import Symptom from '../models/symptoms.model.js';

export const getSymptomsByDisease = async (req, res) => {
  try {
    const { disease } = req.query;
    if (!disease) {
      return res.status(400).json({ message: "Disease name is required" });
    }

    const records = await Symptom.find({ Disease: disease });
    
    // Clean the data: filter out empty strings and underscores for the frontend
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