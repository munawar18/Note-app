import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Signup from './pages/Signup';
import OTP from './pages/Otp';
import Dashboard from './pages/Dashboard';
import SignIn from './pages/Signin';
import Profile from './pages/Profile'; // ✅ Import Profile Page

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Signup />} />
        <Route path="/otp" element={<OTP />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} /> {/* ✅ Profile route */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
