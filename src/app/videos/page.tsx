'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Video } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { storage } from '@/lib/storage';
import VideoGallery from '@/components/VideoGallery';
import LuxuryHeader from '@/components/LuxuryHeader';
import PasswordGate from '@/components/PasswordGate';

export default function VideosPage() {
  const { isAuthenticated } = useAuth();
  const [videos, setVideos] = useState<{ id: string; src: string; title: string; createdAt: string }[]>([]);

  useEffect(() => {
    const stored = storage.getVideos();
    setVideos(stored.map((v) => ({ id: v.id, src: v.dataUrl, title: v.name, createdAt: v.createdAt })));
  }, []);

  if (!isAuthenticated) {
    return <PasswordGate onAdminClick={() => {}} />;
  }

  return (
    <main className="min-h-screen bg-luxury-cream">
      <LuxuryHeader />
      <div className="pt-32 pb-16 px-4 md:px-8 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="font-script text-5xl md:text-6xl text-luxury-dark mb-4">
            فيديوهات الفرح
          </h1>
          <div className="gold-divider" />
          <p className="font-sans text-lg text-luxury-dark/60">
            أجمل الذكريات المصورة
          </p>
        </motion.div>

        {videos.length > 0 ? (
          <VideoGallery videos={videos} />
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <Video className="w-20 h-20 text-luxury-gold/30 mx-auto mb-6" />
            <p className="font-script text-2xl text-luxury-dark/40">لا توجد فيديوهات بعد</p>
          </motion.div>
        )}
      </div>
    </main>
  );
}
