import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
import defaultProfile from '../assets/profile.png'; // ✅ Ensure this file exists

interface Note {
  _id: string;
  content: string;
}

export default function Dashboard() {
  const [note, setNote] = useState('');
  const [notes, setNotes] = useState<Note[]>([]);
  const [profilePhoto, setProfilePhoto] = useState<string>('');
  const navigate = useNavigate();

  const name = localStorage.getItem('name') || 'User';
  const email = localStorage.getItem('signupEmail') || 'No Email Found';

  const token = localStorage.getItem('token');

  const addNote = async () => {
    try {
      const res = await axios.post(
        'http://localhost:4000/api/notes',
        { content: note },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setNotes([...notes, res.data]);
      setNote('');
    } catch (err) {
      alert('Session expired or not logged in');
      navigate('/');
    }
  };

  const deleteNote = async (id: string) => {
    try {
      await axios.delete(`http://localhost:4000/api/notes/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setNotes(notes.filter((n) => n._id !== id));
    } catch (err) {
      alert('Session expired or not logged in');
      navigate('/');
    }
  };

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await axios.get('http://localhost:4000/api/notes', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setNotes(res.data);
      } catch (err) {
        alert('Session expired or not logged in');
        navigate('/');
      }
    };

    const loadPhoto = () => {
      const storedPhoto = localStorage.getItem('profilePhoto');
      if (storedPhoto) {
        setProfilePhoto(`http://localhost:4000${storedPhoto}`);
      } else {
        setProfilePhoto(defaultProfile);
      }
    };

    fetchNotes();
    loadPhoto();
  }, [navigate, token]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-gray-100 px-4 py-6">
      <div className="w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-semibold flex items-center space-x-2">
            <span>Dashboard</span>
            <img
              src={profilePhoto}
              alt="Profile"
              onClick={() => navigate('/profile')}
              className="w-8 h-8 rounded-full cursor-pointer object-cover border border-gray-300"
            />
          </h1>
          <button
            onClick={() => {
              localStorage.clear();
              navigate('/');
            }}
            className="text-blue-600 hover:underline text-sm"
          >
            Sign Out
          </button>
        </div>

        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <h2 className="font-bold text-lg">Welcome, {name}!</h2>
          <p className="text-gray-600 text-sm mt-1">Email: {email}</p>
        </div>

        <div className="flex items-center space-x-2 mb-4">
          <input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Write a note..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            onClick={addNote}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
          >
            Create Note
          </button>
        </div>

        <div className="space-y-3">
          {notes.map((n) => (
            <div
              key={n._id}
              className="flex justify-between items-center px-4 py-2 bg-white rounded-md shadow"
            >
              <span className="text-gray-700">{n.content}</span>
              <button onClick={() => deleteNote(n._id)}>
                <Trash2 className="w-5 h-5 text-red-500 hover:text-red-700" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
