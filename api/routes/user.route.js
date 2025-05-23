
import express from 'express';
import { userUpdate, userDelete, userListing, getUser, userPasswordUpdate } from '../controllers/user.controller.js';

import { verifyToken } from '../utils/verifyToken.js';

const router = express.Router();

router.post('/update/:id', verifyToken, userUpdate);
router.post('/resetpassword', userPasswordUpdate);
router.delete('/delete/:id', verifyToken, userDelete);
router.get('/listing/:id', verifyToken, userListing);
router.get('/:id', verifyToken, getUser);

 


export default router;
