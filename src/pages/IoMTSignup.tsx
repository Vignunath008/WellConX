import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const IoMTSignup: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: '',
    deviceSerial: '',
    organization: '',
    deviceType: '',
    phone: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    if (!form.fullName || !form.email || !form.password || !form.deviceSerial || !form.organization || !form.deviceType || !form.phone) {
      setError('All fields are required.');
      return false;
    }
    if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      setError('Invalid email address.');
      return false;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return false;
    }
    if (!/^[a-zA-Z0-9-]+$/.test(form.deviceSerial)) {
      setError('Device Serial Number must be alphanumeric.');
      return false;
    }
    if (!/^\d{10}$/.test(form.phone)) {
      setError('Phone number must be 10 digits.');
      return false;
    }
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!validate()) return;
    setLoading(true);
    setTimeout(() => {
      const iomtUsers = JSON.parse(localStorage.getItem('iomt_users') || '[]');
      if (iomtUsers.find((u: any) => u.email === form.email)) {
        setError('Email already registered.');
        setLoading(false);
        return;
      }
      iomtUsers.push(form);
      localStorage.setItem('iomt_users', JSON.stringify(iomtUsers));
      setLoading(false);
      navigate('/iomt/login');
    }, 800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form className="bg-white p-8 rounded-lg shadow-md w-full max-w-md" onSubmit={handleSubmit}>
        <h2 className="text-2xl font-bold mb-6 text-center">IoMT Module Signup</h2>
        <input name="fullName" placeholder="Full Name" className="input mb-3" value={form.fullName} onChange={handleChange} />
        <input name="email" placeholder="Email" className="input mb-3" value={form.email} onChange={handleChange} />
        <input name="password" type="password" placeholder="Password" className="input mb-3" value={form.password} onChange={handleChange} />
        <input name="deviceSerial" placeholder="Device Serial Number" className="input mb-3" value={form.deviceSerial} onChange={handleChange} />
        <input name="organization" placeholder="Organization Name" className="input mb-3" value={form.organization} onChange={handleChange} />
        <input name="deviceType" placeholder="Device Type" className="input mb-3" value={form.deviceType} onChange={handleChange} />
        <input name="phone" placeholder="Phone Number" className="input mb-3" value={form.phone} onChange={handleChange} />
        {error && <div className="text-red-500 mb-3">{error}</div>}
        <button type="submit" className="btn w-full" disabled={loading}>{loading ? 'Registering...' : 'Sign Up'}</button>
        <div className="mt-4 text-center">
          Already have an account? <span className="text-blue-600 cursor-pointer" onClick={() => navigate('/iomt/login')}>Login</span>
        </div>
      </form>
    </div>
  );
};

export default IoMTSignup; 