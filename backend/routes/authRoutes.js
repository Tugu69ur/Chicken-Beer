import express from 'express';
import { sendOTP, verifyOtp, reset } from '../controller/otpController.js';

const router = express.Router();

router.post('/send', sendOTP);
router.post('/verify', verifyOtp);
router.post('/reset-password', reset);

export default router;
