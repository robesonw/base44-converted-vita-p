import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiFetch from '@/lib/api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await apiFetch.post('/api/auth/login', { email, password });
      localStorage.setItem('token', response.data.accessToken);
      navigate('/');
    } catch (error) {
      console.error('Login failed', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4">
      <h1 className="text-2xl mb-4">Login</h1>
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
      <button type="submit" className="btn">Log In</button>
    </form>
  );
};

export default Login;