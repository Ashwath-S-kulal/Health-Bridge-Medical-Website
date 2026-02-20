import Precaution from '../models/precaution.model.js';


export const getAllPrecautions = async (req, res) => {
  try {
    const { disease, page = 1, limit = 20 } = req.query;
    let query = {};
    
    if (disease && disease !== "All") {
      query.Disease = { $regex: new RegExp(`^${disease}$`, 'i') };
    }
    
    const skip = (page - 1) * limit;
    const data = await Precaution.find(query)
    .sort({ Disease: 1 })
    .skip(skip)
    .limit(parseInt(limit))
    .lean();
    const total = await Precaution.countDocuments(query);
    res.status(200).json({
      success: true,
      data,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page)
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
}

export const getPrecautionList = async (req, res) => {
  try {
    const list = await Precaution.distinct("Disease");
    res.status(200).json(list.sort());
  } catch (error) {
    res.status(500).json({ message: "Error fetching disease list", error });
  }
};