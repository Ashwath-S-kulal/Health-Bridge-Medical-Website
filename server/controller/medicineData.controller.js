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
export const getMedicineSuggestions = async (req, res) => {
    try {
        const { q, page = 1, limit = 20 } = req.query;
        
        // Build a search filter
        let filter = {};
        if (q) {
            // "i" makes it case-insensitive
            filter.Medicine_Name = { $regex: q, $options: 'i' }; 
        }

        const skip = (page - 1) * limit;

        const medicines = await Medicine.find(filter)
            .select('Medicine_Name Manufacturer Image_URL Excellent_Review_%')
            .skip(skip)
            .limit(parseInt(limit))
            .lean();

        const total = await Medicine.countDocuments(filter);

        res.status(200).json({
            success: true,
            data: medicines,
            total,
            totalPages: Math.ceil(total / limit),
            currentPage: parseInt(page)
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export const getMedicineById = async (req, res) => {
    try {
        const medicine = await Medicine.findById(req.params.id).lean();
        if (!medicine) return res.status(404).json({ message: "Not found" });
        res.status(200).json({ success: true, data: medicine });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};