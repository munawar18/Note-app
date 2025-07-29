import express, { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { sendOtpEmail } from '../utils/email';

const router = express.Router();

// Configure multer for profile photo uploads
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}${ext}`);
  },
});
const upload = multer({ storage });

// Generate 6-digit OTP
const generateOTP = (): string =>
  Math.floor(100000 + Math.random() * 900000).toString();

// ---------------- SIGNUP ----------------
router.post('/signup', async (req, res) => {
  const { email, name, dob } = req.body;
  const otp = generateOTP();

  try {
    let user = await User.findOne({ email });

    if (!user) {
      user = new User({ email, name, dob, otp });
    } else {
      user.otp = otp;
      if (name) user.name = name;
      if (dob) user.dob = dob;
    }

    await user.save();
    await sendOtpEmail(email, otp);

    res.json({ message: 'OTP sent to your email' });
  } catch (err) {
    console.error('Signup Error:', err);
    res.status(500).json({ error: 'Error during signup' });
  }
});

// ---------------- VERIFY SIGNUP OTP ----------------
router.post('/verify-otp', async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || user.otp !== otp) {
      return res.status(400).json({ error: 'Invalid OTP' });
    }

    user.otp = '';
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, {
      expiresIn: '7d',
    });

    res.json({
      token,
      name: user.name,
      email: user.email,
      profilePhoto: user.profilePhoto,
    });
  } catch (err) {
    console.error('Verify OTP Error:', err);
    res.status(500).json({ error: 'OTP verification failed' });
  }
});

// ---------------- SIGNIN ----------------
router.post('/signin', async (req, res) => {
  const { email } = req.body;
  const otp = generateOTP();

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.otp = otp;
    await user.save();
    await sendOtpEmail(email, otp);

    res.json({ message: 'OTP sent to your email' });
  } catch (err) {
    console.error('Signin Error:', err);
    res.status(500).json({ error: 'Error during signin' });
  }
});

// ---------------- VERIFY SIGNIN OTP ----------------
router.post('/verify-signin-otp', async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || user.otp !== otp) {
      return res.status(400).json({ error: 'Invalid OTP' });
    }

    user.otp = '';
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, {
      expiresIn: '7d',
    });

    res.json({
      token,
      name: user.name,
      email: user.email,
      profilePhoto: user.profilePhoto,
    });
  } catch (err) {
    console.error('Verify Signin OTP Error:', err);
    res.status(500).json({ error: 'OTP verification failed' });
  }
});

// ---------------- UPLOAD PROFILE PHOTO ----------------
router.post(
  '/upload-photo',
  upload.single('photo'),
  async (req: Request, res: Response) => {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      if (!token) return res.status(401).json({ error: 'No token provided' });

      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
      const user = await User.findById(decoded.id);

      if (!user) return res.status(404).json({ error: 'User not found' });

      if (req.file) {
        user.profilePhoto = `/uploads/${req.file.filename}`;
        await user.save();

        res.json({
          message: 'Photo uploaded successfully',
          profilePhoto: user.profilePhoto,
        });
      } else {
        res.status(400).json({ error: 'No file uploaded' });
      }
    } catch (err) {
      console.error('Upload Photo Error:', err);
      res.status(500).json({ error: 'Failed to upload photo' });
    }
  }
);

export default router;
