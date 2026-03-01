import React, { useState } from 'react';
import apiFetch from '@/lib/api';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await apiFetch.post('/api/auth/register', { name, email, password });
      localStorage.setItem('token', response.data.accessToken);
      navigate('/');
    } catch (error) {
      console.error('Registration failed', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4">
      <h1 className="text-2xl mb-4">Register</h1>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="block mb-4"
        placeholder="Name"
        required
      />
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="block mb-4"
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="block mb-4"
        placeholder="Password"
        required
      />
      <button type="submit" className="btn">Register</button>
    </form>
  );
};

export default Register;