import Disease from '../models/diseaseDesc.model.js';

export const getAllDiseases = async (req, res) => {
  try {
    const { name } = req.query;
    let query = {};
    if (name && name !== "All") {
      // 'i' makes it case-insensitive
      query.Disease = { $regex: new RegExp(`^${name}$`, 'i') }; 
    }
    const diseases = await Disease.find(query).sort({ Disease: 1 });
    res.status(200).json(diseases);
  } catch (error) {
    res.status(500).json({ message: "Error", error });
  }
};

export const getDiseaseList = async (req, res) => {
  try {
    const list = await Disease.distinct("Disease");
    res.status(200).json(list.sort());
  } catch (error) {
    res.status(500).json({ message: "Error fetching disease list", error });
  }
};