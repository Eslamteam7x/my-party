'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  intensity?: 'light' | 'medium' | 'strong';
  hover?: boolean;
}

export default function GlassCard({ children, className, intensity = 'medium', hover = true }: GlassCardProps) {
  const variants = {
    light: 'bg-white/10 backdrop-blur-sm border border-white/20',
    medium: 'bg-white/20 backdrop-blur-xl border border-white/30',
    strong: 'bg-white/30 backdrop-blur-2xl border border-white/40',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={hover ? { y: -4, transition: { duration: 0.3 } } : undefined}
      className={cn(
        'rounded-2xl shadow-luxury transition-all duration-500',
        variants[intensity],
        hover && 'hover:shadow-luxury-lg',
        className
      )}
    >
      {children}
    </motion.div>
  );
}
