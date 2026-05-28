'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Heart, ArrowDown } from 'lucide-react';
import { useSettings } from '@/context/SettingsContext';

export default function CoverSection() {
  const { settings } = useSettings();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-luxury-cream z-10" />

      {settings.coverImage ? (
        <img
          src={settings.coverImage}
          alt="Wedding Cover"
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 luxury-gradient" />
      )}

      <div className="absolute inset-0 z-20">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-64 h-64 bg-luxury-gold/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/3 right-1/4 w-48 h-48 bg-luxury-rose/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
        className="relative z-30 text-center px-4 max-w-4xl mx-auto"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: 'spring', stiffness: 100 }}
          className="inline-flex items-center gap-3 glass rounded-full px-6 py-2 mb-8"
        >
          <Heart className="w-4 h-4 text-luxury-gold" fill="#D4AF37" />
          <span className="text-white/80 text-sm font-sans tracking-widest">
            نِكَاحِي
          </span>
          <Heart className="w-4 h-4 text-luxury-gold" fill="#D4AF37" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="font-script text-6xl md:text-8xl lg:text-9xl text-white mb-4 leading-relaxed"
        >
          {settings.groomName}
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="flex items-center justify-center gap-4 my-4"
        >
          <div className="w-16 h-px gold-gradient" />
          <span className="font-serif text-2xl md:text-3xl text-luxury-gold">&</span>
          <div className="w-16 h-px gold-gradient" />
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="font-script text-6xl md:text-8xl lg:text-9xl text-white mb-6 leading-relaxed"
        >
          {settings.brideName}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6, duration: 0.8 }}
          className="font-sans text-white/70 text-lg md:text-xl tracking-widest mb-2"
        >
          {new Date(settings.weddingDate).toLocaleDateString('ar-SA', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </motion.p>

        {settings.weddingLocation && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.8, duration: 0.8 }}
            className="font-sans text-white/50 text-sm md:text-base"
          >
            {settings.weddingLocation}
          </motion.p>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.2, duration: 0.8 }}
          className="mt-12 animate-bounce"
        >
          <ArrowDown className="w-6 h-6 text-white/60 mx-auto" />
        </motion.div>
      </motion.div>
    </section>
  );
}
