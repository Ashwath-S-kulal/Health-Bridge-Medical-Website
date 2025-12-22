import express from 'express';
import { google, signout } from '../controller/auth.controller.js';
const router = express.Router();


router.post('/google', google);
router.get('/signout', signout);
export default router;
