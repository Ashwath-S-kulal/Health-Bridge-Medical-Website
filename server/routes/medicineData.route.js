import express from 'express';
import { getAllMedicines } from '../controller/medicineData.controller.js';

const router = express.Router();

router.get('/getmedicine', getAllMedicines);




export default router;
