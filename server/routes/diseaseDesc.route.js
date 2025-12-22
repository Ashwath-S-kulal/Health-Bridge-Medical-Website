import express from 'express';
import { getAllDiseases, getDiseaseList } from '../controller/diseaseDesc.controller.js';

const router = express.Router();

router.get('/', getAllDiseases);
router.get('/list', getDiseaseList);


export default router;
