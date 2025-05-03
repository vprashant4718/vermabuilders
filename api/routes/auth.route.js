import express from 'express';
import { signup, signin, google, signOut, email, validateOtp } from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/email', email);
router.post('/validateotp', validateOtp);
router.post('/signin', signin);
router.post('/google', google);
router.get('/signout',signOut)

export default router;
