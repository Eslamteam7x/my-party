'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Heart,
  Menu,
  X,
  Home,
  Image,
  Video,
  LayoutDashboard,
  Settings,
  LogOut,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';

export default function LuxuryHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { isAdmin, logout } = useAuth();

  const navLinks = [
    { href: '/', label: 'الرئيسية', icon: Home },
    { href: '/gallery', label: 'معرض الصور', icon: Image },
    { href: '/videos', label: 'الفيديوهات', icon: Video },
    ...(isAdmin
      ? [
          { href: '/dashboard', label: 'لوحة التحكم', icon: LayoutDashboard },
          { href: '/settings', label: 'الإعدادات', icon: Settings },
        ]
      : []),
  ];

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="fixed top-0 left-0 right-0 z-40"
      >
        <div className="glass-dark mx-4 md:mx-8 mt-4 rounded-2xl px-6 py-3">
          <nav className="flex items-center justify-between max-w-7xl mx-auto">
            <Link
              href="/"
              className="flex items-center gap-2 font-script text-2xl text-white"
            >
              <Heart className="w-5 h-5 text-luxury-gold" fill="#D4AF37" />
              <span>Wedding</span>
            </Link>

            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      'flex items-center gap-2 px-4 py-2 rounded-xl text-sm transition-all duration-300',
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'text-white/60 hover:text-white hover:bg-white/10'
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{link.label}</span>
                  </Link>
                );
              })}
              {isAdmin && (
                <button
                  onClick={logout}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm text-white/60 hover:text-red-400 hover:bg-white/10 transition-all duration-300"
                >
                  <LogOut className="w-4 h-4" />
                  <span>خروج</span>
                </button>
              )}
            </div>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden text-white/80 hover:text-white transition-colors"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </nav>
        </div>
      </motion.header>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-30 md:hidden"
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
            <div className="absolute right-0 top-0 bottom-0 w-72 bg-luxury-dark/95 backdrop-blur-xl p-8 pt-24">
              <nav className="flex flex-col gap-2">
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        'flex items-center gap-3 px-4 py-3 rounded-xl text-base transition-all duration-300',
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'text-white/60 hover:text-white hover:bg-white/10'
                      )}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{link.label}</span>
                    </Link>
                  );
                })}
                {isAdmin && (
                  <button
                    onClick={() => { logout(); setIsOpen(false); }}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-base text-white/60 hover:text-red-400 hover:bg-white/10 transition-all duration-300"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>خروج</span>
                  </button>
                )}
              </nav>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
