// otpController.js
import { Vonage } from '@vonage/server-sdk';
import User from '../models/userModel.js';  // Your User mongoose model
import bcrypt from 'bcrypt';

const vonage = new Vonage({
  apiKey: process.env.VONAGE_API_KEY,
  apiSecret: process.env.VONAGE_API_SECRET,
});

const otpStore = new Map();

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export const sendOTP = async (req, res) => {
  const { phone } = req.body;
  if (!phone) return res.status(400).json({ error: 'Phone number is required' });

  const otp = generateOTP();
  const from = '2030Chicken';
  const text = `Your OTP code is: ${otp}`;

  try {
    await vonage.sms.send({ to: phone, from, text });
    otpStore.set(phone, { otp, expires: Date.now() + 5 * 60 * 1000 });
    res.json({ success: true, message: 'OTP sent' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const verifyOtp = (req, res) => {
  const { phone, otp } = req.body;
  if (!phone || !otp) return res.status(400).json({ error: 'Phone and OTP are required' });

  const record = otpStore.get(phone);
  if (!record) return res.status(400).json({ error: 'OTP not sent or expired' });

  if (record.expires < Date.now()) {
    otpStore.delete(phone);
    return res.status(400).json({ error: 'OTP expired' });
  }

  if (record.otp !== otp) return res.status(400).json({ error: 'Invalid OTP' });

  otpStore.delete(phone);

  res.json({ success: true, message: 'OTP verified' });
};

export const reset = async (req, res) => {
  const { phone, password } = req.body;
  const phonee = phone.startsWith('+976') ? phone.slice(4) : phone;
  console.log(phonee);
  
  if (!phone || !password) {
    return res.status(400).json({ error: 'Phone and new password are required' });
  }

  try {
    const user = await User.findOne({ phone: phonee });
    if (!user) {
      return res.status(404).json({ error: 'User with this phone number not found' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user.password = hashedPassword;
    await user.save();

    res.json({ success: true, message: 'Password reset successful' });
  } catch (error) {
    res.status(500).json({ error: 'Server error: ' + error.message });
  }
};

