import Doctor from '../models/doctor.model.js';

export const getDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find();
    res.status(200).json(doctors);
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

export const addDoctor = async (req, res) => {
  try {
    const newDoctor = new Doctor(req.body);
    await newDoctor.save();
    res.status(201).json(newDoctor);
  } catch (err) {
    res.status(400).json({ message: "Error saving doctor", error: err.message });
  }
};

export const updateDoctor = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedDoctor = await Doctor.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedDoctor) return res.status(404).json({ message: "Doctor not found" });
        res.status(200).json(updatedDoctor);
    } catch (error) {
        res.status(500).json({ message: "Update failed", error: error.message });
    }
};

// DELETE a doctor
export const deleteDoctor = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedDoctor = await Doctor.findByIdAndDelete(id);
        if (!deletedDoctor) return res.status(404).json({ message: "Doctor not found" });
        res.status(200).json({ message: "Doctor profile deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Deletion failed", error: error.message });
    }
};