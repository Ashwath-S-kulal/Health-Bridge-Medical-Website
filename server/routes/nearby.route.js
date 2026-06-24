import express from 'express';
import handler from '../controller/nearby.controller.js';

const router = express.Router();

router.post('/', handler);


export default router;
