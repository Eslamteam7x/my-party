'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload,
  Image,
  Video,
  Trash2,
  Download,
  Edit3,
  Save,
  X,
  ImagePlus,
  Film,
  HardDrive,
  RefreshCw,
  Heart,
  PanelLeft,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useSettings } from '@/context/SettingsContext';
import { storage, type StoredFile } from '@/lib/storage';
import DragDropUpload from '@/components/DragDropUpload';
import MasonryGallery from '@/components/MasonryGallery';
import VideoGallery from '@/components/VideoGallery';
import LuxuryHeader from '@/components/LuxuryHeader';
import AdminSidebar from '@/components/AdminSidebar';
import GlassCard from '@/components/GlassCard';

export default function Dashboard() {
  const { isAuthenticated, isAdmin } = useAuth();
  const { settings } = useSettings();
  const [photos, setPhotos] = useState<StoredFile[]>([]);
  const [videos, setVideos] = useState<StoredFile[]>([]);
  const [activeTab, setActiveTab] = useState<'photos' | 'videos' | 'stats'>('stats');
  const [isClient, setIsClient] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [editingPhoto, setEditingPhoto] = useState<string | null>(null);
  const [editCaption, setEditCaption] = useState('');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    setIsClient(true);
    setPhotos(storage.getPhotos());
    setVideos(storage.getVideos());
  }, []);

  const showToast = useCallback((message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const handlePhotosAdded = useCallback((newFiles: StoredFile[]) => {
    const updated = [...photos, ...newFiles];
    storage.savePhotos(updated);
    setPhotos(updated);
    showToast(`تم إضافة ${newFiles.length} صورة بنجاح`, 'success');
  }, [photos, showToast]);

  const handleVideosAdded = useCallback((newFiles: StoredFile[]) => {
    const updated = [...videos, ...newFiles];
    storage.saveVideos(updated);
    setVideos(updated);
    showToast(`تم إضافة ${newFiles.length} فيديو بنجاح`, 'success');
  }, [videos, showToast]);

  const handleDeletePhoto = useCallback((id: string) => {
    const updated = storage.removePhoto(id);
    setPhotos(updated);
    showToast('تم حذف الصورة', 'success');
  }, [showToast]);

  const handleDeleteVideo = useCallback((id: string) => {
    const updated = storage.removeVideo(id);
    setVideos(updated);
    showToast('تم حذف الفيديو', 'success');
  }, [showToast]);

  const handleSaveCaption = useCallback((id: string) => {
    const updated = storage.updatePhoto(id, { caption: editCaption });
    setPhotos(updated);
    setEditingPhoto(null);
    showToast('تم حفظ التعديل', 'success');
  }, [editCaption, showToast]);

  const handleExport = useCallback(() => {
    const data = storage.exportData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'wedding-backup.json';
    a.click();
    URL.revokeObjectURL(url);
    showToast('تم تصدير البيانات', 'success');
  }, [showToast]);

  if (!isClient) return null;
  if (!isAuthenticated || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-luxury-cream via-luxury-beige to-luxury-cream">
        <p className="font-sans text-luxury-dark/60">غير مصرح بالدخول</p>
      </div>
    );
  }

  const tabs = [
    { id: 'stats', label: 'الإحصائيات', icon: Heart },
    { id: 'photos', label: 'الصور', icon: Image },
    { id: 'videos', label: 'الفيديوهات', icon: Video },
  ] as const;

  return (
    <div className="min-h-screen bg-luxury-cream">
      <LuxuryHeader />
      <AdminSidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

      <div className={`${sidebarOpen ? 'lg:mr-60' : 'lg:mr-18'} transition-all duration-300 pt-20`}>
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="font-script text-4xl md:text-5xl text-luxury-dark mb-2">
              لوحة التحكم
            </h1>
            <p className="font-sans text-luxury-dark/60">
              مرحباً بك في لوحة التحكم. يمكنك إدارة المحتوى من هنا.
            </p>
          </motion.div>

          <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-sans text-sm transition-all duration-300 whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-luxury-gold text-white shadow-gold'
                      : 'glass text-luxury-dark/60 hover:text-luxury-gold'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          <AnimatePresence mode="wait">
            {activeTab === 'stats' && (
              <motion.div
                key="stats"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
              >
                <GlassCard>
                  <div className="p-6 text-center">
                    <ImagePlus className="w-8 h-8 text-luxury-gold mx-auto mb-3" />
                    <p className="font-serif text-3xl text-luxury-dark">{photos.length}</p>
                    <p className="font-sans text-sm text-luxury-dark/60">صورة</p>
                  </div>
                </GlassCard>
                <GlassCard>
                  <div className="p-6 text-center">
                    <Film className="w-8 h-8 text-luxury-gold mx-auto mb-3" />
                    <p className="font-serif text-3xl text-luxury-dark">{videos.length}</p>
                    <p className="font-sans text-sm text-luxury-dark/60">فيديو</p>
                  </div>
                </GlassCard>
                <GlassCard>
                  <div className="p-6 text-center">
                    <HardDrive className="w-8 h-8 text-luxury-gold mx-auto mb-3" />
                    <p className="font-serif text-3xl text-luxury-dark">
                      {(storage.getTotalSize() / 1024 / 1024).toFixed(1)}
                    </p>
                    <p className="font-sans text-sm text-luxury-dark/60">MB المستخدمة</p>
                  </div>
                </GlassCard>
              </motion.div>
            )}

            {activeTab === 'photos' && (
              <motion.div
                key="photos"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className="mb-8">
                  <DragDropUpload
                    onFilesAdded={handlePhotosAdded}
                    accept="image/*"
                  />
                </div>

                {photos.length > 0 ? (
                  <MasonryGallery
                    images={photos.map((p) => ({ id: p.id, src: p.dataUrl, alt: p.name, caption: p.caption }))}
                    onDelete={handleDeletePhoto}
                  />
                ) : (
                  <div className="text-center py-20">
                    <Image className="w-16 h-16 text-luxury-gold/30 mx-auto mb-4" />
                    <p className="font-sans text-luxury-dark/40">لا توجد صور بعد. اسحب وأفلت الصور لإضافتها.</p>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'videos' && (
              <motion.div
                key="videos"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className="mb-8">
                  <DragDropUpload
                    onFilesAdded={handleVideosAdded}
                    accept="video/*"
                  />
                </div>

                {videos.length > 0 ? (
                  <VideoGallery
                    videos={videos.map((v) => ({ id: v.id, src: v.dataUrl, title: v.name, createdAt: v.createdAt }))}
                    onDelete={handleDeleteVideo}
                  />
                ) : (
                  <div className="text-center py-20">
                    <Video className="w-16 h-16 text-luxury-gold/30 mx-auto mb-4" />
                    <p className="font-sans text-luxury-dark/40">لا توجد فيديوهات بعد.</p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="mt-8 flex flex-wrap gap-3">
            <button onClick={handleExport} className="btn-outline-luxury text-sm flex items-center gap-2">
              <Download className="w-4 h-4" />
              تصدير البيانات
            </button>
            <button
              onClick={() => {
                if (confirm('هل أنت متأكد؟ سيتم حذف جميع البيانات!')) {
                  storage.clearAll();
                  setPhotos([]);
                  setVideos([]);
                  showToast('تم مسح جميع البيانات', 'success');
                }
              }}
              className="px-6 py-3 border-2 border-red-400/30 text-red-400 font-medium rounded-full hover:bg-red-500/10 transition-all duration-300 text-sm flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              مسح الكل
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-2xl shadow-luxury-lg font-sans text-sm ${
              toast.type === 'success' ? 'bg-green-500/90 text-white' : 'bg-red-500/90 text-white'
            }`}
          >
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
