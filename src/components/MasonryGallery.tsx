'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Eye, ChevronLeft, ChevronRight, Download, Shield } from 'lucide-react';
import { useSettings } from '@/context/SettingsContext';

interface MasonryGalleryProps {
  images: { id: string; src: string; alt: string; caption?: string }[];
  onDelete?: (id: string) => void;
}

export default function MasonryGallery({ images, onDelete }: MasonryGalleryProps) {
  const { settings } = useSettings();
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());

  const columns = 3;
  const getColumnCount = () => {
    if (typeof window === 'undefined') return columns;
    const w = window.innerWidth;
    if (w < 640) return 1;
    if (w < 1024) return 2;
    return columns;
  };

  const distributeImages = () => {
    const colCount = getColumnCount();
    const cols: typeof images[] = Array.from({ length: colCount }, () => []);
    images.forEach((img, i) => {
      cols[i % colCount].push(img);
    });
    return cols;
  };

  const columns_d = distributeImages();

  const nextImage = () => {
    if (selectedImage !== null) {
      setSelectedImage((selectedImage + 1) % images.length);
    }
  };

  const prevImage = () => {
    if (selectedImage !== null) {
      setSelectedImage((selectedImage - 1 + images.length) % images.length);
    }
  };

  const handleDownload = (src: string) => {
    if (settings.disableDownload) return;
    const a = document.createElement('a');
    a.href = src;
    a.download = 'photo.jpg';
    a.click();
  };

  return (
    <>
      <div
        className="grid gap-4"
        style={{
          gridTemplateColumns: `repeat(${getColumnCount()}, 1fr)`,
        }}
      >
        {columns_d.map((col, colIdx) => (
          <div key={colIdx} className="flex flex-col gap-4">
            {col.map((image, imgIdx) => (
              <motion.div
                key={image.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: (colIdx + imgIdx) * 0.05 }}
                className="relative group cursor-pointer overflow-hidden rounded-2xl"
                onClick={() => {
                  const globalIdx = images.findIndex((i) => i.id === image.id);
                  setSelectedImage(globalIdx);
                }}
              >
                <div className="relative overflow-hidden rounded-2xl">
                  {!loadedImages.has(image.id) && (
                    <div className="absolute inset-0 bg-luxury-beige/50 animate-pulse rounded-2xl" />
                  )}
                  <img
                    src={image.src}
                    alt={image.alt}
                    className="w-full h-auto object-cover transition-all duration-700 group-hover:scale-110"
                    loading="lazy"
                    onLoad={() => setLoadedImages((prev) => new Set(prev).add(image.id))}
                    style={{ minHeight: '200px' }}
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-500 rounded-2xl" />

                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
                    <div className="glass rounded-full p-3">
                      <Eye className="w-5 h-5 text-white" />
                    </div>
                  </div>

                  {image.caption && (
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500">
                      <p className="text-white text-sm font-sans">{image.caption}</p>
                    </div>
                  )}

                  {settings.disableDownload && (
                    <div className="absolute top-3 right-3 glass rounded-full p-2 opacity-0 group-hover:opacity-100 transition-all duration-500">
                      <Shield className="w-4 h-4 text-luxury-gold" />
                    </div>
                  )}
                </div>

                {onDelete && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(image.id);
                    }}
                    className="absolute top-3 left-3 glass rounded-full p-2 opacity-0 group-hover:opacity-100 transition-all duration-500 hover:bg-red-500/30"
                  >
                    <X className="w-4 h-4 text-white" />
                  </button>
                )}
              </motion.div>
            ))}
          </div>
        ))}
      </div>

      <AnimatePresence>
        {selectedImage !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-6 right-6 glass rounded-full p-3 hover:bg-white/30 transition-all duration-300 z-10"
            >
              <X className="w-6 h-6 text-white" />
            </button>

            {!settings.disableDownload && (
              <button
                onClick={() => handleDownload(images[selectedImage].src)}
                className="absolute top-6 left-6 glass rounded-full p-3 hover:bg-white/30 transition-all duration-300 z-10"
              >
                <Download className="w-6 h-6 text-white" />
              </button>
            )}

            <button
              onClick={(e) => { e.stopPropagation(); prevImage(); }}
              className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 glass rounded-full p-3 hover:bg-white/30 transition-all duration-300 z-10"
            >
              <ChevronRight className="w-6 h-6 text-white" />
            </button>

            <button
              onClick={(e) => { e.stopPropagation(); nextImage(); }}
              className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 glass rounded-full p-3 hover:bg-white/30 transition-all duration-300 z-10"
            >
              <ChevronLeft className="w-6 h-6 text-white" />
            </button>

            <motion.img
              key={selectedImage}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              src={images[selectedImage].src}
              alt={images[selectedImage].alt}
              className="max-w-full max-h-[85vh] object-contain rounded-2xl"
              onClick={(e) => e.stopPropagation()}
            />

            {images[selectedImage].caption && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 glass rounded-full px-6 py-2 text-white text-sm"
              >
                {images[selectedImage].caption}
              </motion.p>
            )}

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 glass rounded-full px-4 py-2">
              <span className="text-white/80 text-sm font-sans">
                {selectedImage + 1} / {images.length}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
