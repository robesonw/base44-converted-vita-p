import React, { createContext, useContext, useState } from 'react';
import { apiFetch } from '@/lib/api';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

const AuthContext = createContext<{ user: User | null; login: (email: string, password: string) => Promise<void>; register: (name: string, email: string, password: string) => Promise<void>; logout: () => void; } | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string) => {
    const response = await apiFetch<{ accessToken: string }>('POST', '/api/auth/login', { email, password });
    localStorage.setItem('token', response.accessToken);
    // Fetch user info here and set user
    setUser({ id: '1', name: 'John Doe', email, role: 'user' }); // Mock user
  };

  const register = async (name: string, email: string, password: string) => {
    await apiFetch('POST', '/api/auth/register', { name, email, password });
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return <AuthContext.Provider value={{ user, login, register, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};