import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

export default function Signup() {
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtp, setShowOtp] = useState(false);
  const navigate = useNavigate();

  const handleSendOtp = async () => {
    try {
      await axios.post('http://localhost:4000/api/auth/signup', { name, dob, email });
      localStorage.setItem('signupEmail', email);
      setShowOtp(true);
    } catch (err) {
      alert('Failed to send OTP');
    }
  };

  const handleVerifyOtp = async () => {
    try {
      const res = await axios.post('http://localhost:4000/api/auth/verify-otp', { email, otp });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('name', res.data.name);
      navigate('/dashboard');
    } catch (err) {
      alert('Invalid OTP');
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      {/* Left Side for Illustration or Info */}
      <div className="hidden md:flex w-1/2 bg-blue-600 text-white flex-col items-center justify-center p-10">
        <h1 className="text-4xl font-bold mb-4">Welcome to Note App</h1>
        <p className="text-lg">Securely create and manage your notes</p>
      </div>

      {/* Right Side: Signup Form */}
      <div className="w-full md:w-1/2 bg-white flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-5">
          <h2 className="text-2xl font-bold text-center text-blue-600">Create Account</h2>

          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="date"
            placeholder="Date of Birth"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          {!showOtp && (
            <button
              onClick={handleSendOtp}
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
            >
              Get OTP
            </button>
          )}

          {showOtp && (
            <>
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-400"
              />
              <button
                onClick={handleVerifyOtp}
                className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
              >
                Verify OTP
              </button>
            </>
          )}

          <p className="text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/signin" className="text-blue-600 hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
