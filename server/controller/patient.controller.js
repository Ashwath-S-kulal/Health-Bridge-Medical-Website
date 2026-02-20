import Patient from "../models/patient.model.js";
import DiseaseDescription from "../models/diseaseDesc.model.js";
import Precaution from "../models/precaution.model.js";
import Symptom from "../models/symptoms.model.js";

export const addPatient = async (req, res) => {
  try {
    const newPatient = new Patient({
      ...req.body,
      userId: req.user.id, 
    });
    const savedPatient = await newPatient.save();

    res.status(201).json(savedPatient);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPatient = async (req, res) => {
  try {
    const patients = await Patient.find({ userId: req.user.id }).sort({
      createdAt: -1,
    });

    const enrichedPatients = await Promise.all(
      patients.map(async (patient) => {
        const description = await DiseaseDescription.findOne({
          Disease: patient.disease,
        });

        const precautions = await Precaution.findOne({
          Disease: patient.disease,
        });

        const symptoms = await Symptom.findOne({
          Disease: patient.disease,
        });

        return {
          ...patient._doc,
          diseaseInfo: {
            description,
            precautions,
            symptoms,
          },
        };
      }),
    );

    res.json(enrichedPatients);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateCuredStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { isCured } = req.body; 

    const patient = await Patient.findOneAndUpdate(
      { _id: id, userId: req.user.id },
      { $set: { isCured: isCured } },
      { new: true }
    );

    if (!patient) {
      return res.status(404).json({ message: "Patient record not found" });
    }

    res.status(200).json(patient);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};