import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendOtpEmail = async (email: string, otp: string) => {
  console.log("📤 Preparing to send email to:", email); // 🔍 DEBUG LOG

  try {
    const info = await transporter.sendMail({
      from: `"Note App" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Your OTP Code',
      html: `<h3>Your OTP is: <b>${otp}</b></h3>`,
    });

    console.log("✅ Email sent:", info.response); // 🔍 SUCCESS LOG
  } catch (error) {
    console.error("❌ Email sending failed:", error); // 🔥 ERROR LOG
  }
};
