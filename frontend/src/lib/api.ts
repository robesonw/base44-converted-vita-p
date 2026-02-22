import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000',
});

// Add a request interceptor
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
}, error => Promise.reject(error));

// Add a response interceptor
apiClient.interceptors.response.use((response) => response, (error) => {
  if (error.response.status === 401) {
    localStorage.removeItem('token');
    window.location.href = '/login';
  }
  return Promise.reject(error);
});

export async function apiFetch<T>(method: string, path: string, data?: unknown): Promise<T> {
  const response = await apiClient({ method, url: path, data });
  return response.data;
}