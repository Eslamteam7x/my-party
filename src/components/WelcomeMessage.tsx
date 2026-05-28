'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import { useSettings } from '@/context/SettingsContext';

export default function WelcomeMessage() {
  const { settings } = useSettings();

  return (
    <section className="py-24 px-4 relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-luxury-gold/5 via-transparent to-transparent" />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="max-w-3xl mx-auto text-center relative"
      >
        <motion.div
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
        >
          <Heart className="w-8 h-8 text-luxury-gold mx-auto mb-6" fill="#D4AF37" />
        </motion.div>

        <div className="gold-divider" />

        <h2 className="font-script text-4xl md:text-5xl text-luxury-dark mb-8">
          بسم الله الرحمن الرحيم
        </h2>

        <p className="font-sans text-lg md:text-xl text-luxury-dark/70 leading-relaxed mb-8 max-w-2xl mx-auto">
          {settings.welcomeMessage}
        </p>

        <div className="flex items-center justify-center gap-4 text-luxury-gold/60">
          <div className="w-12 h-px bg-luxury-gold/40" />
          <span className="font-serif text-lg">{settings.groomName} & {settings.brideName}</span>
          <div className="w-12 h-px bg-luxury-gold/40" />
        </div>

        <div className="gold-divider" />
      </motion.div>
    </section>
  );
}
