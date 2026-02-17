import Medicine from '../models/medicine.model.js';

// controllers/medicineController.js
export const getAllMedicines = async (req, res) => {
  try {
    const { page = 1, limit = 5000, search = "" } = req.query;

    const query = search 
      ? { "Medicine Name": { $regex: search, $options: "i" } } 
      : {};

    const medicines = await Medicine.find(query)
      // ADD THE MISSING FIELDS HERE:
      .select('Medicine_Name Manufacturer Composition Uses Side_effects Image_URL Excellent_Review_% Average_Review_% Poor_Review_%') 
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    res.json(medicines);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


