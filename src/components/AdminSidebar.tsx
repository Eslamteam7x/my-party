'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Image,
  Video,
  Settings,
  LogOut,
  Heart,
  PanelRightOpen,
  PanelRightClose,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';

interface AdminSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export default function AdminSidebar({ isOpen, onToggle }: AdminSidebarProps) {
  const pathname = usePathname();
  const { logout } = useAuth();

  const links = [
    { href: '/dashboard', label: 'لوحة التحكم', icon: LayoutDashboard },
    { href: '/dashboard?tab=photos', label: 'إدارة الصور', icon: Image },
    { href: '/dashboard?tab=videos', label: 'إدارة الفيديوهات', icon: Video },
    { href: '/settings', label: 'الإعدادات', icon: Settings },
  ];

  return (
    <motion.aside
      initial={{ width: isOpen ? 240 : 72 }}
      animate={{ width: isOpen ? 240 : 72 }}
      transition={{ duration: 0.3 }}
      className="fixed right-0 top-0 bottom-0 z-30 bg-luxury-dark/95 backdrop-blur-xl border-l border-white/10 hidden lg:flex flex-col"
    >
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        {isOpen && (
          <Link href="/" className="flex items-center gap-2 font-script text-xl text-white">
            <Heart className="w-5 h-5 text-luxury-gold" fill="#D4AF37" />
            <span>Wedding</span>
          </Link>
        )}
        <button
          onClick={onToggle}
          className="text-white/60 hover:text-white transition-colors p-1"
        >
          {isOpen ? <PanelRightClose className="w-5 h-5" /> : <PanelRightOpen className="w-5 h-5" />}
        </button>
      </div>

      <nav className="flex-1 flex flex-col gap-1 p-3">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href || (link.href.includes('?') && pathname + '?' + link.href.split('?')[1] === link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-300',
                isActive
                  ? 'bg-white/20 text-white'
                  : 'text-white/50 hover:text-white hover:bg-white/10'
              )}
            >
              <Icon className="w-5 h-5 min-w-[20px]" />
              {isOpen && <span className="text-sm whitespace-nowrap">{link.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-white/10">
        <button
          onClick={logout}
          className="flex items-center gap-3 px-3 py-3 rounded-xl text-white/50 hover:text-red-400 hover:bg-white/10 transition-all duration-300 w-full"
        >
          <LogOut className="w-5 h-5 min-w-[20px]" />
          {isOpen && <span className="text-sm whitespace-nowrap">خروج</span>}
        </button>
      </div>
    </motion.aside>
  );
}
