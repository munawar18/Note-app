import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  dob: String,
  otp: String,
  profilePhoto: String // 👈 Add this
});

export default mongoose.model('User', userSchema);
