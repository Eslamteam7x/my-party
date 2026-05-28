'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { userStorage, type WeddingUser } from '@/lib/user-storage';

interface AuthContextType {
  isAuthenticated: boolean;
  isAdmin: boolean;
  currentUser: WeddingUser | null;
  login: (password: string) => boolean;
  userLogin: (username: string, password: string) => boolean;
  adminLogin: (password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isAdmin: false,
  currentUser: null,
  login: () => false,
  userLogin: () => false,
  adminLogin: () => false,
  logout: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [currentUser, setCurrentUser] = useState<WeddingUser | null>(null);

  useEffect(() => {
    const auth = sessionStorage.getItem('wedding_auth');
    const admin = sessionStorage.getItem('wedding_admin');
    if (auth === 'true') setIsAuthenticated(true);
    if (admin === 'true') setIsAdmin(true);
    const saved = userStorage.getCurrentUser();
    if (saved) {
      setCurrentUser(saved);
      setIsAuthenticated(true);
    }
  }, []);

  const login = useCallback((password: string): boolean => {
    if (password === 'wedding2024') {
      sessionStorage.setItem('wedding_auth', 'true');
      setIsAuthenticated(true);
      return true;
    }
    return false;
  }, []);

  const userLogin = useCallback((username: string, password: string): boolean => {
    const user = userStorage.login(username, password);
    if (user) {
      setCurrentUser(user);
      setIsAuthenticated(true);
      return true;
    }
    return false;
  }, []);

  const adminLogin = useCallback((password: string): boolean => {
    if (password === 'Eslam2026') {
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
    userStorage.logout();
    setIsAuthenticated(false);
    setIsAdmin(false);
    setCurrentUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, isAdmin, currentUser, login, userLogin, adminLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
