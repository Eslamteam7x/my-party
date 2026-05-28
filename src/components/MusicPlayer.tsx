'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Volume2, VolumeX, Music } from 'lucide-react';
import { useSettings } from '@/context/SettingsContext';

export default function MusicPlayer() {
  const { settings } = useSettings();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!settings.musicEnabled || !settings.musicUrl || !isMounted) return null;

  const togglePlay = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio(settings.musicUrl);
      audioRef.current.loop = true;
    }

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(() => {});
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <>
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        onClick={() => setIsVisible(!isVisible)}
        className="fixed bottom-6 left-6 z-50 w-14 h-14 rounded-full glass-gold flex items-center justify-center shadow-gold"
      >
        <Music className={`w-6 h-6 text-luxury-gold ${isPlaying ? 'animate-spin' : ''}`} />
      </motion.button>

      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, x: -20, y: 20 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: -20, y: 20 }}
            className="fixed bottom-24 left-6 z-50 glass rounded-2xl p-4 min-w-[200px]"
          >
            <p className="font-sans text-sm text-luxury-dark/60 mb-3 text-center">
              الموسيقى التصويرية
            </p>
            <button
              onClick={togglePlay}
              className="w-full flex items-center justify-center gap-3 px-4 py-2 rounded-xl bg-luxury-gold/10 hover:bg-luxury-gold/20 transition-all duration-300"
            >
              {isPlaying ? (
                <Pause className="w-5 h-5 text-luxury-gold" />
              ) : (
                <Play className="w-5 h-5 text-luxury-gold" />
              )}
              <span className="font-sans text-sm text-luxury-gold">
                {isPlaying ? 'إيقاف' : 'تشغيل'}
              </span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
