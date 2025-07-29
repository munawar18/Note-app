import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const [name, setName] = useState('');
  const [, setEmail] = useState('');
  const [photo, setPhoto] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedName = localStorage.getItem('name');
    const storedEmail = localStorage.getItem('signupEmail');

    if (storedName) setName(storedName);
    if (storedEmail) setEmail(storedEmail);
  }, []);

  const handleNameUpdate = async () => {
    try {
      const res = await axios.put(
        'http://localhost:4000/api/auth/update-name',
        { name },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      localStorage.setItem('name', res.data.name);
      alert('Name updated successfully');
    } catch (err) {
      alert('Failed to update name');
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhoto(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handlePhotoUpload = async () => {
    if (!photo) return;

    const formData = new FormData();
    formData.append('photo', photo);

    try {
      const res = await axios.post('http://localhost:4000/api/auth/upload-photo', formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      localStorage.setItem('profilePhoto', res.data.profilePhoto);
      alert('Profile photo updated');
      navigate('/dashboard'); // Go back to dashboard to reflect change
    } catch (err) {
      alert('Failed to upload photo');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-gray-100 px-4 py-8">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center text-indigo-600">Profile</h2>

        <div className="mb-4 text-center">
          <img
            src={
              preview ||
              localStorage.getItem('profilePhoto') ||
              '/profile.png'
            }
            alt="Profile"
            className="w-24 h-24 rounded-full mx-auto object-cover"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-600 mb-1">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <button
            onClick={handleNameUpdate}
            className="mt-2 w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
          >
            Update Name
          </button>
        </div>

        <div className="mb-4">
          <label className="block text-gray-600 mb-1">Profile Photo</label>
          <input
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
            className="mb-2"
          />
          <button
            onClick={handlePhotoUpload}
            className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
          >
            Upload Photo
          </button>
        </div>

        <div className="text-center">
          <button
            onClick={() => navigate('/dashboard')}
            className="text-sm text-blue-600 hover:underline"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
