import express from 'express';
import { getDiseaseList, getSymptomsByDisease } from '../controller/symptomts.controller.js';


const router = express.Router();


router.get('/', getSymptomsByDisease);
router.get('/list', getDiseaseList);

export default router;
