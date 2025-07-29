import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function OTP() {
  const [otp, setOtp] = useState('');
  const navigate = useNavigate();
  const email = localStorage.getItem('signupEmail');

  const handleVerify = async () => {
    try {
      const res = await axios.post('http://localhost:4000/api/auth/verify-otp', {
        email,
        otp,
      });
      localStorage.setItem('token', res.data.token);
      navigate('/dashboard');
    } catch (err) {
      alert('Invalid OTP or verification failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-200 to-indigo-300">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold text-center text-indigo-700 mb-6">
          Verify OTP
        </h2>
        <input
          type="text"
          placeholder="Enter OTP"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-4"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />
        <button
          className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition"
          onClick={handleVerify}
        >
          Verify
        </button>
      </div>
    </div>
  );
}

export default OTP;
