import express from 'express';
import { getAllMedicines, getMedicineById, getMedicineSuggestions } from '../controller/medicineData.controller.js';

const router = express.Router();

router.get('/getmedicine', getAllMedicines);
router.get('/suggestions', getMedicineSuggestions);

router.get('/:id', getMedicineById);




export default router;
