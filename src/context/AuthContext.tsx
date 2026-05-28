'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (password: string) => boolean;
  adminLogin: (password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isAdmin: false,
  login: () => false,
  adminLogin: () => false,
  logout: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const auth = sessionStorage.getItem('wedding_auth');
    const admin = sessionStorage.getItem('wedding_admin');
    if (auth === 'true') setIsAuthenticated(true);
    if (admin === 'true') setIsAdmin(true);
  }, []);

  const login = useCallback((password: string): boolean => {
    if (password === 'wedding2024') {
      sessionStorage.setItem('wedding_auth', 'true');
      setIsAuthenticated(true);
      return true;
    }
    return false;
  }, []);

  const adminLogin = useCallback((password: string): boolean => {
    if (password === 'wedding2024_admin') {
      sessionStorage.setItem('wedding_auth', 'true');
      sessionStorage.setItem('wedding_admin', 'true');
      setIsAuthenticated(true);
      setIsAdmin(true);
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem('wedding_auth');
    sessionStorage.removeItem('wedding_admin');
    setIsAuthenticated(false);
    setIsAdmin(false);
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, isAdmin, login, adminLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
