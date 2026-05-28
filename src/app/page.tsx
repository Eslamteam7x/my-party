'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Shield, User, Lock, ArrowRight } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useSettings } from '@/context/SettingsContext';
import { useRouter } from 'next/navigation';
import { storage } from '@/lib/storage';
import { userStorage } from '@/lib/user-storage';
import CoverSection from '@/components/CoverSection';
import WelcomeMessage from '@/components/WelcomeMessage';
import Countdown from '@/components/Countdown';
import MasonryGallery from '@/components/MasonryGallery';
import VideoGallery from '@/components/VideoGallery';
import MusicPlayer from '@/components/MusicPlayer';
import LuxuryHeader from '@/components/LuxuryHeader';

function MainContent() {
  const { settings } = useSettings();
  const { currentUser: authUser } = useAuth();
  const [photos, setPhotos] = useState<{ id: string; src: string; alt: string; caption?: string; album?: string }[]>([]);
  const [videos, setVideos] = useState<{ id: string; src: string; title: string; createdAt: string }[]>([]);
  const [albums, setAlbums] = useState<any[]>([]);

  useEffect(() => {
    const storedPhotos = storage.getPhotos();
    const storedVideos = storage.getVideos();
    const storedAlbums = storage.getAlbums();
    setAlbums(storedAlbums);
    setVideos(storedVideos.map((v) => ({ id: v.id, src: v.dataUrl, title: v.name, createdAt: v.createdAt })));

    // Filter photos based on user permissions
    const user = authUser;
    let allowedAlbums: string[] = [];
    if (user && user.allowedAlbums && user.allowedAlbums.length > 0) {
      allowedAlbums = user.allowedAlbums;
    }

    let filteredPhotos = storedPhotos;
    if (allowedAlbums.length > 0) {
      filteredPhotos = storedPhotos.filter(
        (p) => !p.album || allowedAlbums.includes(p.album)
      );
    }

    setPhotos(filteredPhotos.map((p) => ({
      id: p.id,
      src: p.dataUrl,
      alt: p.name,
      caption: p.caption,
      album: p.album,
    })));
  }, [authUser]);

  return (
    <main className="min-h-screen">
      <LuxuryHeader />
      <MusicPlayer />

      <div id="cover"><CoverSection /></div>
      <div id="welcome"><WelcomeMessage /></div>
      <div id="countdown"><Countdown /></div>

      {photos.length > 0 && (
        <section id="gallery" className="py-24 px-4 md:px-8 max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="font-script text-5xl md:text-6xl text-luxury-dark mb-4">معرض الصور</h2>
            <div className="gold-divider" />
            <p className="font-sans text-luxury-dark/60">لحظاتنا الجميلة</p>
          </motion.div>
          <MasonryGallery images={photos} />
        </section>
      )}

      {videos.length > 0 && (
        <section id="videos" className="py-24 px-4 md:px-8 max-w-7xl mx-auto bg-gradient-to-b from-luxury-beige/30 to-luxury-cream">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
            <h2 className="font-script text-5xl md:text-6xl text-luxury-dark mb-4">فيديوهات الفرح</h2>
            <div className="gold-divider" />
            <p className="font-sans text-luxury-dark/60">أجمل الذكريات المصورة</p>
          </motion.div>
          <VideoGallery videos={videos} />
        </section>
      )}

      <footer className="py-12 px-4 relative overflow-hidden bg-luxury-dark">
        <div className="absolute inset-0"><div className="absolute top-0 left-1/3 w-64 h-64 bg-luxury-gold/5 rounded-full blur-3xl" /></div>
        <div className="relative text-center">
          <Heart className="w-6 h-6 text-luxury-gold mx-auto mb-4" fill="#D4AF37" />
          <p className="font-script text-2xl text-white/80 mb-2">{settings.groomName} & {settings.brideName}</p>
          <p className="font-sans text-sm text-white/40">شكراً لكل من شاركنا فرحتنا</p>
          <div className="gold-divider !w-16 my-4" />
          <p className="font-sans text-xs text-white/30">© {new Date().getFullYear()} Wedding Luxury. جميع الحقوق محفوظة</p>
        </div>
      </footer>
    </main>
  );
}

export default function Home() {
  const { isAuthenticated, userLogin, adminLogin } = useAuth();
  const [mode, setMode] = useState<'login' | 'admin'>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => { setIsClient(true); }, []);

  const handleUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (userLogin(username, password)) {
      window.location.reload();
    } else {
      setError('اسم المستخدم أو كلمة المرور غير صحيحة');
    }
  };

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (adminLogin(password)) {
      window.location.reload();
    } else {
      setError('كلمة المرور غير صحيحة');
    }
  };

  if (!isClient) return null;
  if (isAuthenticated) return <MainContent />;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-gradient-to-br from-luxury-cream via-luxury-beige to-luxury-cream">
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-luxury-gold/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-luxury-rose/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-luxury-gold/5 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="relative w-full max-w-md"
      >
        <div className="glass rounded-3xl p-8 md:p-10 shadow-luxury-lg">
          <motion.div
            initial={{ scale: 0 }} animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
            className="flex justify-center mb-8"
          >
            <div className="w-20 h-20 rounded-full glass-gold flex items-center justify-center animate-glow">
              <Heart className="w-10 h-10 text-luxury-gold" fill="#D4AF37" />
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="text-center mb-8">
            <h1 className="font-script text-4xl md:text-5xl text-luxury-dark mb-3">موقع الزفاف</h1>
            <p className="font-sans text-luxury-dark/60">
              {mode === 'admin' ? 'دخول المدير' : 'الرجاء تسجيل الدخول للمتابعة'}
            </p>
          </motion.div>

          <div className="flex gap-2 mb-6">
            <button
              onClick={() => { setMode('login'); setError(''); }}
              className={`flex-1 py-3 rounded-xl text-sm font-sans transition-all ${
                mode === 'login' ? 'bg-luxury-gold text-white' : 'glass text-luxury-dark/60'
              }`}
            >
              <User className="w-4 h-4 inline ml-2" />
              دخول مستخدم
            </button>
            <button
              onClick={() => { setMode('admin'); setError(''); }}
              className={`flex-1 py-3 rounded-xl text-sm font-sans transition-all ${
                mode === 'admin' ? 'bg-luxury-gold text-white' : 'glass text-luxury-dark/60'
              }`}
            >
              <Shield className="w-4 h-4 inline ml-2" />
              دخول مدير
            </button>
          </div>

          {mode === 'login' ? (
            <form onSubmit={handleUserSubmit} className="space-y-4">
              <div>
                <div className="relative">
                  <User className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-luxury-gold/50" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => { setUsername(e.target.value); setError(''); }}
                    placeholder="اسم المستخدم"
                    className="input-luxury pr-12 text-center"
                    autoFocus
                  />
                </div>
              </div>
              <div>
                <div className="relative">
                  <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-luxury-gold/50" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setError(''); }}
                    placeholder="كلمة المرور"
                    className="input-luxury pr-12 text-center"
                  />
                </div>
              </div>
              {error && (
                <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-red-500 text-sm text-center font-sans bg-red-500/10 rounded-xl px-4 py-3">
                  {error}
                </motion.p>
              )}
              <button type="submit" className="btn-luxury w-full flex items-center justify-center gap-2">
                <ArrowRight className="w-5 h-5" />
                <span>دخول</span>
              </button>
            </form>
          ) : (
            <form onSubmit={handleAdminSubmit} className="space-y-4">
              <div>
                <div className="relative">
                  <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-luxury-gold/50" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setError(''); }}
                    placeholder="كلمة مرور المدير"
                    className="input-luxury pr-12 text-center"
                    autoFocus
                  />
                </div>
              </div>
              {error && (
                <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-red-500 text-sm text-center font-sans bg-red-500/10 rounded-xl px-4 py-3">
                  {error}
                </motion.p>
              )}
              <button type="submit" className="btn-luxury w-full">دخول</button>
            </form>
          )}
        </div>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }} className="text-center mt-6 text-xs text-luxury-dark/30 font-sans">
          © {new Date().getFullYear()} Wedding Luxury
        </motion.p>
      </motion.div>
    </div>
  );
}
