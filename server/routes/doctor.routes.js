import express from 'express';
import { addDoctor, deleteDoctor, getDoctors, updateDoctor } from '../controller/doctor.controller.js';
import { verifyToken } from '../utils/VerifyUser.js';
import { verifyAdmin } from '../utils/verifyAdmin.js';

const router = express.Router();

router.get('/getdoctor', getDoctors);
router.post('/adddoctor',verifyToken,verifyAdmin, addDoctor);
router.put('/update/:id',verifyToken,verifyAdmin, updateDoctor); 
router.delete('/delete/:id',verifyToken,verifyAdmin, deleteDoctor); 



export default router;
