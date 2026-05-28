'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { SiteSettings, StorageConfig } from '@/types';

const defaultSettings: SiteSettings = {
  brideName: process.env.NEXT_PUBLIC_BRIDE_NAME || 'سارة',
  groomName: process.env.NEXT_PUBLIC_GROOM_NAME || 'أحمد',
  weddingDate: process.env.NEXT_PUBLIC_WEDDING_DATE || '2024-12-15T18:00:00',
  weddingLocation: process.env.NEXT_PUBLIC_WEDDING_LOCATION || 'قاعة الأندلس، الرياض',
  welcomeMessage: process.env.NEXT_PUBLIC_WELCOME_MESSAGE || 'نرحب بكم في موقع زفافنا',
  coverImage: '',
  theme: {
    primaryColor: '#D4AF37',
    accentColor: '#F5E6CC',
    backgroundColor: '#FAF8F5',
    textColor: '#1A1A1A',
    fontFamily: 'serif',
  },
  musicUrl: '',
  musicEnabled: false,
  disableDownload: false,
  albums: [],
};

interface SettingsContextType {
  settings: SiteSettings;
  storageConfig: StorageConfig;
  updateSettings: (updates: Partial<SiteSettings>) => void;
  updateTheme: (theme: Partial<SiteSettings['theme']>) => void;
  updateStorageConfig: (config: Partial<StorageConfig>) => void;
  resetSettings: () => void;
}

const SettingsContext = createContext<SettingsContextType>({
  settings: defaultSettings,
  storageConfig: { type: 'local' },
  updateSettings: () => {},
  updateTheme: () => {},
  updateStorageConfig: () => {},
  resetSettings: () => {},
});

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [storageConfig, setStorageConfig] = useState<StorageConfig>({ type: 'local' });

  useEffect(() => {
    try {
      const saved = localStorage.getItem('wedding_settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        setSettings({ ...defaultSettings, ...parsed });
      }
      const savedConfig = localStorage.getItem('wedding_storage_config');
      if (savedConfig) {
        setStorageConfig(JSON.parse(savedConfig));
      }
    } catch {}
  }, []);

  const updateSettings = useCallback((updates: Partial<SiteSettings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...updates };
      localStorage.setItem('wedding_settings', JSON.stringify(next));
      return next;
    });
  }, []);

  const updateTheme = useCallback((theme: Partial<SiteSettings['theme']>) => {
    setSettings((prev) => {
      const next = { ...prev, theme: { ...prev.theme, ...theme } };
      localStorage.setItem('wedding_settings', JSON.stringify(next));
      return next;
    });
  }, []);

  const updateStorageConfig = useCallback((config: Partial<StorageConfig>) => {
    setStorageConfig((prev) => {
      const next = { ...prev, ...config };
      localStorage.setItem('wedding_storage_config', JSON.stringify(next));
      return next;
    });
  }, []);

  const resetSettings = useCallback(() => {
    setSettings(defaultSettings);
    localStorage.removeItem('wedding_settings');
  }, []);

  return (
    <SettingsContext.Provider
      value={{ settings, storageConfig, updateSettings, updateTheme, updateStorageConfig, resetSettings }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export const useSettings = () => useContext(SettingsContext);
