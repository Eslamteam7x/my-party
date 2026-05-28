'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Shield } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useSettings } from '@/context/SettingsContext';
import { storage } from '@/lib/storage';
import CoverSection from '@/components/CoverSection';
import WelcomeMessage from '@/components/WelcomeMessage';
import Countdown from '@/components/Countdown';
import MasonryGallery from '@/components/MasonryGallery';
import VideoGallery from '@/components/VideoGallery';
import MusicPlayer from '@/components/MusicPlayer';
import LuxuryHeader from '@/components/LuxuryHeader';
import PasswordGate from '@/components/PasswordGate';
import { getGreeting } from '@/lib/utils';

function MainContent() {
  const { settings } = useSettings();
  const [photos, setPhotos] = useState<{ id: string; src: string; alt: string; caption?: string }[]>([]);
  const [videos, setVideos] = useState<{ id: string; src: string; thumbnail?: string; title: string; description?: string; createdAt: string }[]>([]);

  useEffect(() => {
    const storedPhotos = storage.getPhotos();
    const storedVideos = storage.getVideos();
    setPhotos(storedPhotos.map((p) => ({ id: p.id, src: p.dataUrl, alt: p.name, caption: p.caption })));
    setVideos(storedVideos.map((v) => ({ id: v.id, src: v.dataUrl, title: v.name, createdAt: v.createdAt })));
  }, []);

  return (
    <main className="min-h-screen">
      <LuxuryHeader />
      <MusicPlayer />

      <div id="cover">
        <CoverSection />
      </div>

      <div id="welcome">
        <WelcomeMessage />
      </div>

      <div id="countdown">
        <Countdown />
      </div>

      {photos.length > 0 && (
        <section id="gallery" className="py-24 px-4 md:px-8 max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-script text-5xl md:text-6xl text-luxury-dark mb-4">
              معرض الصور
            </h2>
            <div className="gold-divider" />
            <p className="font-sans text-luxury-dark/60">لحظاتنا الجميلة</p>
          </motion.div>
          <MasonryGallery images={photos} />
        </section>
      )}

      {videos.length > 0 && (
        <section id="videos" className="py-24 px-4 md:px-8 max-w-7xl mx-auto bg-gradient-to-b from-luxury-beige/30 to-luxury-cream">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-script text-5xl md:text-6xl text-luxury-dark mb-4">
              فيديوهات الفرح
            </h2>
            <div className="gold-divider" />
            <p className="font-sans text-luxury-dark/60">أجمل الذكريات المصورة</p>
          </motion.div>
          <VideoGallery videos={videos} />
        </section>
      )}

      <footer className="py-12 px-4 relative overflow-hidden bg-luxury-dark">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/3 w-64 h-64 bg-luxury-gold/5 rounded-full blur-3xl" />
        </div>
        <div className="relative text-center">
          <Heart className="w-6 h-6 text-luxury-gold mx-auto mb-4" fill="#D4AF37" />
          <p className="font-script text-2xl text-white/80 mb-2">
            {settings.groomName} & {settings.brideName}
          </p>
          <p className="font-sans text-sm text-white/40">
            شكراً لكل من شاركنا فرحتنا
          </p>
          <div className="gold-divider !w-16 my-4" />
          <p className="font-sans text-xs text-white/30">
            © {new Date().getFullYear()} Wedding Luxury. جميع الحقوق محفوظة
          </p>
        </div>
      </footer>
    </main>
  );
}

export default function Home() {
  const { isAuthenticated, login, adminLogin } = useAuth();
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [adminError, setAdminError] = useState('');

  const handleAdminClick = () => {
    setShowAdminLogin(true);
  };

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAdminError('');
    if (adminPassword === 'wedding2024_admin') {
      adminLogin(adminPassword);
      setShowAdminLogin(false);
    } else {
      setAdminError('كلمة المرور غير صحيحة. استخدم: wedding2024_admin');
    }
  };

  if (!isAuthenticated && !showAdminLogin) {
    return <PasswordGate onAdminClick={handleAdminClick} />;
  }

  if (showAdminLogin) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-luxury-cream via-luxury-beige to-luxury-cream">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass rounded-3xl p-8 max-w-md w-full"
        >
          <div className="text-center mb-6">
            <Shield className="w-12 h-12 text-luxury-gold mx-auto mb-4" />
            <h2 className="font-script text-3xl text-luxury-dark mb-2">دخول المدير</h2>
            <p className="font-sans text-sm text-luxury-dark/60">كلمة مرور المدير</p>
          </div>
          <form onSubmit={handleAdminSubmit}>
            <input
              type="password"
              value={adminPassword}
              onChange={(e) => { setAdminPassword(e.target.value); setAdminError(''); }}
              placeholder="كلمة مرور المدير"
              className="input-luxury mb-4 text-center"
              autoFocus
            />
            {adminError && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-500 text-sm text-center font-sans bg-red-500/10 rounded-xl px-4 py-3 mb-4"
              >
                {adminError}
              </motion.p>
            )}
            <button type="submit" className="btn-luxury w-full">دخول</button>
            <button
              type="button"
              onClick={() => setShowAdminLogin(false)}
              className="mt-4 text-sm text-luxury-dark/40 hover:text-luxury-gold transition-colors w-full"
            >
              رجوع
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return <MainContent />;
}
