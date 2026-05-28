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

  const SITE_PASSWORD = 'wedding2024';
  const ADMIN_PASSWORD = 'wedding2024_admin';

  const login = useCallback((password: string): boolean => {
    if (password === SITE_PASSWORD) {
      setIsAuthenticated(true);
      sessionStorage.setItem('wedding_auth', 'true');
      return true;
    }
    return false;
  }, []);

  const adminLogin = useCallback((password: string): boolean => {
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setIsAdmin(true);
      sessionStorage.setItem('wedding_auth', 'true');
      sessionStorage.setItem('wedding_admin', 'true');
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    setIsAdmin(false);
    sessionStorage.removeItem('wedding_auth');
    sessionStorage.removeItem('wedding_admin');
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, isAdmin, login, adminLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
