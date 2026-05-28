'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Eye, EyeOff, Shield, Heart } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { getGreeting } from '@/lib/utils';

interface PasswordGateProps {
  onAdminClick: () => void;
}

export default function PasswordGate({ onAdminClick }: PasswordGateProps) {
  const { login, adminLogin } = useAuth();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password === 'wedding2024') {
      sessionStorage.setItem('wedding_auth', 'true');
      window.location.reload();
    } else {
      setError('كلمة المرور غير صحيحة');
    }
  };

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
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
            className="flex justify-center mb-8"
          >
            <div className="w-20 h-20 rounded-full glass-gold flex items-center justify-center animate-glow">
              <Heart className="w-10 h-10 text-luxury-gold" fill="#D4AF37" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-center mb-8"
          >
            <h1 className="font-script text-4xl md:text-5xl text-luxury-dark mb-3">
              موقع الزفاف
            </h1>
            <p className="font-sans text-luxury-dark/60">
              {getGreeting()}، الرجاء إدخال كلمة المرور للمتابعة
            </p>
          </motion.div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError('');
                  }}
                  placeholder="أدخل كلمة المرور"
                  className="input-luxury pr-12 text-lg text-center"
                  autoFocus
                  dir="auto"
                />
                <Lock className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-luxury-gold/50" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-luxury-dark/30 hover:text-luxury-gold transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </motion.div>

            <AnimatePresence>
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="text-red-500 text-sm text-center font-sans bg-red-500/10 rounded-xl px-4 py-3"
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
            >
              <button
                type="submit"
                disabled={isSubmitting || !password}
                className="btn-luxury w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Shield className="w-5 h-5" />
                    <span>دخول</span>
                  </>
                )}
              </button>
            </motion.div>
          </form>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="mt-8 text-center"
          >
            <button
              type="button"
              onClick={onAdminClick}
              className="text-xs text-luxury-dark/30 hover:text-luxury-gold transition-colors font-sans"
            >
              لوحة التحكم
            </button>
          </motion.div>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="text-center mt-6 text-xs text-luxury-dark/30 font-sans"
        >
          © 2024 Wedding Luxury. All rights reserved.
        </motion.p>
      </motion.div>
    </div>
  );
}
