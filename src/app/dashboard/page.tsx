'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Image,
  Video,
  Trash2,
  Download,
  Edit3,
  Save,
  ImagePlus,
  Film,
  HardDrive,
  Heart,
  Folder,
  Palette,
  Check,
  Plus,
  Shield,
  User,
  Lock,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useSettings } from '@/context/SettingsContext';
import { storage, type StoredFile } from '@/lib/storage';
import { userStorage, type WeddingUser } from '@/lib/user-storage';
import DragDropUpload from '@/components/DragDropUpload';
import MasonryGallery from '@/components/MasonryGallery';
import VideoGallery from '@/components/VideoGallery';
import LuxuryHeader from '@/components/LuxuryHeader';
import AdminSidebar from '@/components/AdminSidebar';
import GlassCard from '@/components/GlassCard';
import { generateId } from '@/lib/utils';

export default function Dashboard() {
  const { isAuthenticated, isAdmin } = useAuth();
  const { settings, updateSettings, updateTheme } = useSettings();
  const [photos, setPhotos] = useState<StoredFile[]>([]);
  const [videos, setVideos] = useState<StoredFile[]>([]);
  const [albums, setAlbums] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'stats' | 'photos' | 'videos' | 'albums' | 'texts' | 'users'>('stats');
  const [isClient, setIsClient] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const [selectedAlbum, setSelectedAlbum] = useState<string>('all');
  const [newAlbumName, setNewAlbumName] = useState('');
  const [newAlbumDesc, setNewAlbumDesc] = useState('');
  const [showNewAlbum, setShowNewAlbum] = useState(false);

  const [users, setUsers] = useState<WeddingUser[]>([]);
  const [showNewUser, setShowNewUser] = useState(false);
  const [newUser, setNewUser] = useState({ username: '', password: '', name: '' });
  const [editingUser, setEditingUser] = useState<WeddingUser | null>(null);

  const [localTexts, setLocalTexts] = useState({
    brideName: '',
    groomName: '',
    weddingDate: '',
    weddingLocation: '',
    welcomeMessage: '',
    coverImage: '',
    musicUrl: '',
    musicEnabled: false,
  });
  const [localThemeColors, setLocalThemeColors] = useState({
    primaryColor: '#D4AF37',
    accentColor: '#F5E6CC',
    backgroundColor: '#FAF8F5',
    textColor: '#1A1A1A',
  });

  useEffect(() => {
    setIsClient(true);
    setPhotos(storage.getPhotos());
    setVideos(storage.getVideos());
    setAlbums(storage.getAlbums());
    setUsers(userStorage.getUsers());
    setLocalTexts({
      brideName: settings.brideName,
      groomName: settings.groomName,
      weddingDate: settings.weddingDate,
      weddingLocation: settings.weddingLocation,
      welcomeMessage: settings.welcomeMessage,
      coverImage: settings.coverImage,
      musicUrl: settings.musicUrl,
      musicEnabled: settings.musicEnabled,
    });
    setLocalThemeColors(settings.theme);
  }, [settings]);

  const showToast = useCallback((message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const filteredPhotos = selectedAlbum === 'all'
    ? photos
    : photos.filter((p) => p.album === selectedAlbum);

  const handlePhotosAdded = useCallback((newFiles: StoredFile[]) => {
    const withAlbum = newFiles.map((f) => ({
      ...f,
      album: selectedAlbum !== 'all' ? selectedAlbum : undefined,
    }));
    const updated = [...photos, ...withAlbum];
    storage.savePhotos(updated);
    setPhotos(updated);
    showToast(`تم إضافة ${newFiles.length} صورة بنجاح`, 'success');
  }, [photos, selectedAlbum, showToast]);

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

  const handleCreateAlbum = () => {
    if (!newAlbumName.trim()) return;
    const album = { id: generateId(), name: newAlbumName, description: newAlbumDesc };
    const updated = storage.addAlbum(album);
    setAlbums(updated);
    setNewAlbumName('');
    setNewAlbumDesc('');
    setShowNewAlbum(false);
    showToast('تم إنشاء الألبوم', 'success');
  };

  const handleDeleteAlbum = (id: string) => {
    if (confirm('سيتم إزالة الصور من هذا الألبوم دون حذفها. هل تريد المتابعة؟')) {
      const updated = storage.removeAlbum(id);
      setAlbums(updated);
      setPhotos(storage.getPhotos());
      if (selectedAlbum === id) setSelectedAlbum('all');
      showToast('تم حذف الألبوم', 'success');
    }
  };

  const handleAssignAlbum = (photoId: string, albumId: string) => {
    const updated = storage.updatePhoto(photoId, { album: albumId || undefined });
    setPhotos(updated);
    showToast('تم نقل الصورة', 'success');
  };

  const handleSaveTexts = () => {
    updateSettings(localTexts);
    updateTheme(localThemeColors);
    showToast('تم حفظ النصوص والتعديلات', 'success');
  };

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
    { id: 'albums', label: 'الألبومات', icon: Folder },
    { id: 'texts', label: 'النصوص', icon: Edit3 },
    { id: 'users', label: 'المستخدمين', icon: User },
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
              >
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
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
                      <Folder className="w-8 h-8 text-luxury-gold mx-auto mb-3" />
                      <p className="font-serif text-3xl text-luxury-dark">{albums.length}</p>
                      <p className="font-sans text-sm text-luxury-dark/60">ألبوم</p>
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
                </div>
              </motion.div>
            )}

            {activeTab === 'photos' && (
              <motion.div
                key="photos"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className="flex flex-wrap items-center gap-3 mb-6">
                  <span className="font-sans text-sm text-luxury-dark/60">الألبوم:</span>
                  <button
                    onClick={() => setSelectedAlbum('all')}
                    className={`px-4 py-2 rounded-xl text-sm transition-all ${
                      selectedAlbum === 'all' ? 'bg-luxury-gold text-white' : 'glass text-luxury-dark/60'
                    }`}
                  >
                    الكل
                  </button>
                  {albums.map((a) => (
                    <button
                      key={a.id}
                      onClick={() => setSelectedAlbum(a.id)}
                      className={`px-4 py-2 rounded-xl text-sm transition-all ${
                        selectedAlbum === a.id ? 'bg-luxury-gold text-white' : 'glass text-luxury-dark/60'
                      }`}
                    >
                      {a.name}
                    </button>
                  ))}
                </div>

                <div className="mb-8">
                  <DragDropUpload
                    onFilesAdded={handlePhotosAdded}
                    accept="image/*"
                  />
                  {selectedAlbum !== 'all' && (
                    <p className="text-xs text-luxury-gold mt-2 text-center font-sans">
                      سيتم إضافة الصور إلى الألبوم: {albums.find((a) => a.id === selectedAlbum)?.name}
                    </p>
                  )}
                </div>

                {filteredPhotos.length > 0 ? (
                  <div>
                    {filteredPhotos.map((p) => (
                      <div key={p.id} className="flex items-center gap-3 glass rounded-xl p-3 mb-2">
                        <img src={p.dataUrl} alt={p.name} className="w-16 h-16 rounded-xl object-cover" />
                        <div className="flex-1 min-w-0">
                          <p className="font-sans text-sm text-luxury-dark truncate">{p.name}</p>
                          <p className="font-sans text-xs text-luxury-dark/40">
                            {(p.size / 1024).toFixed(0)} KB
                            {p.album && ` • ${albums.find((a) => a.id === p.album)?.name || 'بدون ألبوم'}`}
                          </p>
                          <div className="flex gap-2 mt-1">
                            <input
                              type="text"
                              defaultValue={p.caption || ''}
                              placeholder="تعليق..."
                              className="text-xs bg-white/30 rounded-lg px-2 py-1 w-32 border border-luxury-gold/20"
                              onBlur={(e) => {
                                const updated = storage.updatePhoto(p.id, { caption: e.target.value });
                                setPhotos(updated);
                              }}
                            />
                            <select
                              defaultValue={p.album || ''}
                              className="text-xs bg-white/30 rounded-lg px-2 py-1 border border-luxury-gold/20"
                              onChange={(e) => handleAssignAlbum(p.id, e.target.value)}
                            >
                              <option value="">بدون ألبوم</option>
                              {albums.map((a) => (
                                <option key={a.id} value={a.id}>{a.name}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeletePhoto(p.id)}
                          className="text-red-400 hover:text-red-600 transition-colors p-2"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Image className="w-16 h-16 text-luxury-gold/30 mx-auto mb-4" />
                    <p className="font-sans text-luxury-dark/40">لا توجد صور. اسحب وأفلت الصور لإضافتها.</p>
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
                  <DragDropUpload onFilesAdded={handleVideosAdded} accept="video/*" />
                </div>
                {videos.length > 0 ? (
                  <VideoGallery
                    videos={videos.map((v) => ({ id: v.id, src: v.dataUrl, title: v.name, createdAt: v.createdAt }))}
                    onDelete={handleDeleteVideo}
                  />
                ) : (
                  <div className="text-center py-12">
                    <Video className="w-16 h-16 text-luxury-gold/30 mx-auto mb-4" />
                    <p className="font-sans text-luxury-dark/40">لا توجد فيديوهات بعد.</p>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'albums' && (
              <motion.div
                key="albums"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-sans text-xl text-luxury-dark">إدارة الألبومات</h2>
                  <button
                    onClick={() => setShowNewAlbum(!showNewAlbum)}
                    className="btn-luxury text-sm flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    ألبوم جديد
                  </button>
                </div>

                <AnimatePresence>
                  {showNewAlbum && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="glass rounded-2xl p-6 mb-6 overflow-hidden"
                    >
                      <div className="space-y-4">
                        <div>
                          <label className="block font-sans text-sm text-luxury-dark/70 mb-2">اسم الألبوم</label>
                          <input
                            type="text"
                            value={newAlbumName}
                            onChange={(e) => setNewAlbumName(e.target.value)}
                            className="input-luxury"
                            placeholder="مثلاً: ليلة الحناء"
                          />
                        </div>
                        <div>
                          <label className="block font-sans text-sm text-luxury-dark/70 mb-2">وصف (اختياري)</label>
                          <input
                            type="text"
                            value={newAlbumDesc}
                            onChange={(e) => setNewAlbumDesc(e.target.value)}
                            className="input-luxury"
                            placeholder="وصف الألبوم"
                          />
                        </div>
                        <div className="flex gap-3">
                          <button onClick={handleCreateAlbum} className="btn-luxury text-sm">
                            <Check className="w-4 h-4 inline ml-2" />
                            إنشاء الألبوم
                          </button>
                          <button onClick={() => setShowNewAlbum(false)} className="btn-outline-luxury text-sm">
                            إلغاء
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {albums.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {albums.map((album) => {
                      const albumPhotos = storage.getPhotosByAlbum(album.id);
                      const cover = albumPhotos[0];
                      return (
                        <GlassCard key={album.id}>
                          <div className="p-5">
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <h3 className="font-sans font-medium text-luxury-dark">{album.name}</h3>
                                {album.description && (
                                  <p className="font-sans text-xs text-luxury-dark/50 mt-1">{album.description}</p>
                                )}
                              </div>
                              <button
                                onClick={() => handleDeleteAlbum(album.id)}
                                className="text-red-400 hover:text-red-600 transition-colors p-1"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-luxury-dark/50">
                              <Image className="w-3 h-3" />
                              <span>{albumPhotos.length} صورة</span>
                            </div>
                            {cover && (
                              <img
                                src={cover.dataUrl}
                                alt={album.name}
                                className="w-full h-32 object-cover rounded-xl mt-3"
                              />
                            )}
                          </div>
                        </GlassCard>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Folder className="w-16 h-16 text-luxury-gold/30 mx-auto mb-4" />
                    <p className="font-sans text-luxury-dark/40">لا توجد ألبومات بعد. أنشئ ألبومك الأول.</p>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'users' && (
              <motion.div
                key="users"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-sans text-xl text-luxury-dark">إدارة المستخدمين</h2>
                  <button
                    onClick={() => setShowNewUser(!showNewUser)}
                    className="btn-luxury text-sm flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    مستخدم جديد
                  </button>
                </div>

                <AnimatePresence>
                  {showNewUser && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="glass rounded-2xl p-6 mb-6 overflow-hidden"
                    >
                      <div className="space-y-4">
                        <div>
                          <label className="block font-sans text-sm text-luxury-dark/70 mb-2">الاسم (للتعريف)</label>
                          <input
                            type="text"
                            value={newUser.name}
                            onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                            className="input-luxury"
                            placeholder="مثلاً: أحمد"
                          />
                        </div>
                        <div>
                          <label className="block font-sans text-sm text-luxury-dark/70 mb-2">اسم المستخدم</label>
                          <input
                            type="text"
                            value={newUser.username}
                            onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                            className="input-luxury"
                            placeholder="مثلاً: ahmed123"
                          />
                        </div>
                        <div>
                          <label className="block font-sans text-sm text-luxury-dark/70 mb-2">كلمة المرور</label>
                          <input
                            type="text"
                            value={newUser.password}
                            onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                            className="input-luxury"
                            placeholder="كلمة المرور"
                          />
                        </div>
                        <div className="flex gap-3">
                          <button
                            onClick={() => {
                              if (!newUser.username.trim() || !newUser.password.trim()) {
                                showToast('يرجى تعبئة الحقول المطلوبة', 'error');
                                return;
                              }
                              const existing = userStorage.getUserByUsername(newUser.username);
                              if (existing) {
                                showToast('اسم المستخدم موجود مسبقاً', 'error');
                                return;
                              }
                              const user: WeddingUser = {
                                id: generateId(),
                                username: newUser.username.trim(),
                                password: newUser.password.trim(),
                                name: newUser.name.trim() || newUser.username.trim(),
                                allowedAlbums: [],
                                createdAt: new Date().toISOString(),
                              };
                              userStorage.addUser(user);
                              setUsers(userStorage.getUsers());
                              setNewUser({ username: '', password: '', name: '' });
                              setShowNewUser(false);
                              showToast('تم إنشاء المستخدم', 'success');
                            }}
                            className="btn-luxury text-sm"
                          >
                            <Check className="w-4 h-4 inline ml-2" />
                            إنشاء المستخدم
                          </button>
                          <button onClick={() => setShowNewUser(false)} className="btn-outline-luxury text-sm">
                            إلغاء
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {users.length > 0 ? (
                  <div className="space-y-3">
                    {users.map((user) => (
                      <GlassCard key={user.id}>
                        <div className="p-5">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <div className="w-10 h-10 rounded-full bg-luxury-gold/20 flex items-center justify-center">
                                  <User className="w-5 h-5 text-luxury-gold" />
                                </div>
                                <div>
                                  <h3 className="font-sans font-medium text-luxury-dark">
                                    {user.name}
                                    {user.name !== user.username && (
                                      <span className="text-xs text-luxury-dark/40 block">@{user.username}</span>
                                    )}
                                  </h3>
                                </div>
                              </div>

                              <div className="flex items-center gap-4 text-xs text-luxury-dark/50 mb-3">
                                <span className="flex items-center gap-1">
                                  <Lock className="w-3 h-3" />
                                  {user.password}
                                </span>
                                <span>
                                  {user.allowedAlbums.length === 0
                                    ? 'جميع الألبومات'
                                    : `${user.allowedAlbums.length} ألبوم/ألبومات`}
                                </span>
                              </div>

                              <div className="space-y-2">
                                {editingUser?.id === user.id ? (
                                  <div>
                                    <label className="block font-sans text-xs text-luxury-dark/60 mb-2">
                                      الألبومات المسموح بها (اترك فارغاً للسماح بالكل):
                                    </label>
                                    <div className="flex flex-wrap gap-2 mb-3">
                                      {albums.map((album) => (
                                        <button
                                          key={album.id}
                                          onClick={() => {
                                            const updated = editingUser.allowedAlbums.includes(album.id)
                                              ? editingUser.allowedAlbums.filter((id) => id !== album.id)
                                              : [...editingUser.allowedAlbums, album.id];
                                            setEditingUser({ ...editingUser, allowedAlbums: updated });
                                          }}
                                          className={`px-3 py-1.5 rounded-lg text-xs transition-all ${
                                            editingUser.allowedAlbums.includes(album.id)
                                              ? 'bg-luxury-gold text-white'
                                              : 'glass text-luxury-dark/60'
                                          }`}
                                        >
                                          {album.name}
                                        </button>
                                      ))}
                                    </div>
                                    <div className="flex gap-2">
                                      <button
                                        onClick={() => {
                                          userStorage.updateUser(user.id, { allowedAlbums: editingUser.allowedAlbums });
                                          setUsers(userStorage.getUsers());
                                          setEditingUser(null);
                                          showToast('تم حفظ الصلاحيات', 'success');
                                        }}
                                        className="px-4 py-1.5 bg-green-500 text-white rounded-lg text-xs"
                                      >
                                        <Save className="w-3 h-3 inline ml-1" />
                                        حفظ
                                      </button>
                                      <button
                                        onClick={() => setEditingUser(null)}
                                        className="px-4 py-1.5 glass text-luxury-dark/60 rounded-lg text-xs"
                                      >
                                        إلغاء
                                      </button>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="flex flex-wrap gap-2">
                                    <button
                                      onClick={() => setEditingUser({ ...user })}
                                      className="px-3 py-1.5 bg-luxury-gold/20 text-luxury-gold rounded-lg text-xs flex items-center gap-1"
                                    >
                                      <Shield className="w-3 h-3" />
                                      صلاحيات الألبومات
                                    </button>
                                    <button
                                      onClick={() => {
                                        const newPw = prompt('أدخل كلمة المرور الجديدة:');
                                        if (newPw && newPw.trim()) {
                                          userStorage.updateUser(user.id, { password: newPw.trim() });
                                          setUsers(userStorage.getUsers());
                                          showToast('تم تغيير كلمة المرور', 'success');
                                        }
                                      }}
                                      className="px-3 py-1.5 glass text-luxury-dark/60 rounded-lg text-xs flex items-center gap-1"
                                    >
                                      <Lock className="w-3 h-3" />
                                      تغيير كلمة المرور
                                    </button>
                                    <button
                                      onClick={() => {
                                        if (confirm(`هل تريد حذف المستخدم "${user.name}"؟`)) {
                                          userStorage.removeUser(user.id);
                                          setUsers(userStorage.getUsers());
                                          showToast('تم حذف المستخدم', 'success');
                                        }
                                      }}
                                      className="px-3 py-1.5 bg-red-500/10 text-red-500 rounded-lg text-xs flex items-center gap-1"
                                    >
                                      <Trash2 className="w-3 h-3" />
                                      حذف
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </GlassCard>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <User className="w-16 h-16 text-luxury-gold/30 mx-auto mb-4" />
                    <p className="font-sans text-luxury-dark/40">لا يوجد مستخدمون بعد. أنشئ مستخدم جديد.</p>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'texts' && (
              <motion.div
                key="texts"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <GlassCard intensity="strong">
                  <div className="p-6 md:p-8 space-y-6">
                    <h2 className="font-sans text-xl text-luxury-dark">تعديل النصوص والمحتوى</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-sans text-sm text-luxury-dark/70 mb-2">اسم العريس</label>
                        <input
                          type="text"
                          value={localTexts.groomName}
                          onChange={(e) => setLocalTexts({ ...localTexts, groomName: e.target.value })}
                          className="input-luxury"
                        />
                      </div>
                      <div>
                        <label className="block font-sans text-sm text-luxury-dark/70 mb-2">اسم العروس</label>
                        <input
                          type="text"
                          value={localTexts.brideName}
                          onChange={(e) => setLocalTexts({ ...localTexts, brideName: e.target.value })}
                          className="input-luxury"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-sans text-sm text-luxury-dark/70 mb-2">تاريخ الزفاف</label>
                      <input
                        type="datetime-local"
                        value={localTexts.weddingDate.slice(0, 16)}
                        onChange={(e) => setLocalTexts({ ...localTexts, weddingDate: e.target.value + ':00' })}
                        className="input-luxury"
                      />
                    </div>

                    <div>
                      <label className="block font-sans text-sm text-luxury-dark/70 mb-2">مكان الزفاف</label>
                      <input
                        type="text"
                        value={localTexts.weddingLocation}
                        onChange={(e) => setLocalTexts({ ...localTexts, weddingLocation: e.target.value })}
                        className="input-luxury"
                      />
                    </div>

                    <div>
                      <label className="block font-sans text-sm text-luxury-dark/70 mb-2">رسالة الترحيب</label>
                      <textarea
                        value={localTexts.welcomeMessage}
                        onChange={(e) => setLocalTexts({ ...localTexts, welcomeMessage: e.target.value })}
                        className="input-luxury h-24 resize-none"
                      />
                    </div>

                    <div>
                      <label className="block font-sans text-sm text-luxury-dark/70 mb-2">رابط صورة الغلاف</label>
                      <input
                        type="url"
                        value={localTexts.coverImage}
                        onChange={(e) => setLocalTexts({ ...localTexts, coverImage: e.target.value })}
                        className="input-luxury"
                        placeholder="https://example.com/cover.jpg"
                      />
                    </div>

                    <div className="border-t border-luxury-gold/20 pt-6">
                      <h3 className="font-sans font-medium text-luxury-dark mb-4 flex items-center gap-2">
                        <Palette className="w-5 h-5 text-luxury-gold" />
                        ألوان الثيم
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                          { label: 'الذهبي', key: 'primaryColor', value: localThemeColors.primaryColor },
                          { label: 'البيج', key: 'accentColor', value: localThemeColors.accentColor },
                          { label: 'الخلفية', key: 'backgroundColor', value: localThemeColors.backgroundColor },
                          { label: 'النص', key: 'textColor', value: localThemeColors.textColor },
                        ].map((c) => (
                          <div key={c.key}>
                            <label className="block font-sans text-xs text-luxury-dark/70 mb-2">{c.label}</label>
                            <input
                              type="color"
                              value={c.value}
                              onChange={(e) => setLocalThemeColors({ ...localThemeColors, [c.key]: e.target.value })}
                              className="w-full h-10 rounded-xl cursor-pointer border border-luxury-gold/30"
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 pt-4 border-t border-luxury-gold/20">
                      <button onClick={handleSaveTexts} className="btn-luxury flex items-center gap-2">
                        <Save className="w-4 h-4" />
                        حفظ التعديلات
                      </button>
                    </div>
                  </div>
                </GlassCard>
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
                  setAlbums([]);
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
