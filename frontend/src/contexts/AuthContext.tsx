import { createContext, useContext, useState, ReactNode } from 'react';
import { apiFetch } from '../lib/api';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { name: string; email: string; password: string }) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, password: string) => {
    const response = await apiFetch('POST', '/api/auth/login', { email, password });
    localStorage.setItem('token', response.accessToken);
    setUser(response.user);
  };

  const register = async (data: { name: string; email: string; password: string }) => {
    const response = await apiFetch('POST', '/api/auth/register', data);
    localStorage.setItem('token', response.accessToken);
    setUser(response.user);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);