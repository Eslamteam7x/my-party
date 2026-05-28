'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import { useSettings } from '@/context/SettingsContext';
import type { Video } from '@/types';

interface VideoGalleryProps {
  videos: Video[];
  onDelete?: (id: string) => void;
}

export default function VideoGallery({ videos, onDelete }: VideoGalleryProps) {
  const { settings } = useSettings();

  if (videos.length === 0) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {videos.map((video, index) => (
        <motion.div
          key={video.id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.1 }}
          className="relative group rounded-2xl overflow-hidden card-luxury"
        >
          <div className="relative aspect-[9/16] bg-luxury-dark overflow-hidden rounded-2xl">
            <video
              src={video.src}
              className="w-full h-full object-cover"
              controls
              playsInline
              preload="metadata"
            >
              متصفحك لا يدعم تشغيل الفيديو
            </video>

            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-16 h-16 rounded-full glass flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
                <Play className="w-8 h-8 text-luxury-gold ml-1" />
              </div>
            </div>

            {video.title && (
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
                <p className="text-white font-sans text-sm">{video.title}</p>
                {video.description && (
                  <p className="text-white/60 text-xs mt-1">{video.description}</p>
                )}
              </div>
            )}
          </div>

          {onDelete && (
            <button
              onClick={() => onDelete(video.id)}
              className="absolute top-3 left-3 z-10 glass rounded-full p-2 opacity-0 group-hover:opacity-100 transition-all duration-500 hover:bg-red-500/30"
            >
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}

          {settings.disableDownload && (
            <div className="absolute top-3 right-3 glass rounded-full p-2 opacity-0 group-hover:opacity-100 transition-all duration-500">
              <svg className="w-4 h-4 text-luxury-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
}
