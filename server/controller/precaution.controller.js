import Precaution from '../models/precaution.model.js';


export const getAllPrecautions = async (req, res) => {
  try {
    const { disease } = req.query;
    let query = {};
    
    if (disease && disease !== "All") {
      query.Disease = disease;
    }

    const data = await Precaution.find(query).sort({ Disease: 1 });
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: "Error fetching safety protocols", error });
  }
};

export const getPrecautionList = async (req, res) => {
  try {
    const list = await Precaution.distinct("Disease");
    res.status(200).json(list.sort());
  } catch (error) {
    res.status(500).json({ message: "Error fetching disease list", error });
  }
};