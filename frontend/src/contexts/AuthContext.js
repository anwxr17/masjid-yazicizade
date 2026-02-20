import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('rtj-token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyToken = async () => {
      if (token) {
        try {
          const response = await axios.get(`${API}/auth/verify`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setAdmin({ email: response.data.email, name: response.data.name });
        } catch (error) {
          localStorage.removeItem('rtj-token');
          setToken(null);
          setAdmin(null);
        }
      }
      setLoading(false);
    };
    verifyToken();
  }, [token]);

  const login = async (email, password) => {
    const response = await axios.post(`${API}/auth/login`, { email, password });
    const { token: newToken, name } = response.data;
    localStorage.setItem('rtj-token', newToken);
    setToken(newToken);
    setAdmin({ email, name });
    return response.data;
  };

  const logout = () => {
    localStorage.removeItem('rtj-token');
    setToken(null);
    setAdmin(null);
  };

  const getAuthHeaders = () => ({
    headers: { Authorization: `Bearer ${token}` }
  });

  return (
    <AuthContext.Provider value={{ admin, token, loading, login, logout, getAuthHeaders }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
