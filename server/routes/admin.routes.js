import express from 'express';
import { verifyToken} from '../utils/VerifyUser.js';
import { verifyAdmin } from '../utils/verifyAdmin.js';
import { deleteUser, getAllUsers, updateUserRole } from '../controller/admin.controller.js';


const router = express.Router();

router.get('/getallusers',verifyToken,verifyAdmin,getAllUsers); 
router.delete('/deleteuser/:id',verifyToken,verifyAdmin,deleteUser); 
router.put("/:id/role", verifyToken, verifyAdmin, updateUserRole);


export default router;
