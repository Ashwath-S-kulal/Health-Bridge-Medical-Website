import express from 'express';
import { getAllPrecautions, getPrecautionList } from '../controller/precaution.controller.js';

const router = express.Router();

router.get('/', getAllPrecautions);
router.get('/list', getPrecautionList);


export default router;
