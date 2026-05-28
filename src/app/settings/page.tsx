'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Save,
  RefreshCw,
  Github,
  Cloud,
  Image,
  Music,
  Palette,
  Globe,
  Lock,
  Eye,
  EyeOff,
  Database,
  Check,
  AlertCircle,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useSettings } from '@/context/SettingsContext';
import { saveGitHubConfig, getGitHubConfig } from '@/lib/github-storage';
import LuxuryHeader from '@/components/LuxuryHeader';
import GlassCard from '@/components/GlassCard';

export default function Settings() {
  const { isAuthenticated, isAdmin } = useAuth();
  const { settings, storageConfig, updateSettings, updateTheme, updateStorageConfig } = useSettings();
  const [isClient, setIsClient] = useState(false);
  const [activeSection, setActiveSection] = useState('general');
  const [saved, setSaved] = useState(false);
  const [showToken, setShowToken] = useState(false);

  const [localSettings, setLocalSettings] = useState({
    brideName: '',
    groomName: '',
    weddingDate: '',
    weddingLocation: '',
    welcomeMessage: '',
    coverImage: '',
    musicUrl: '',
    musicEnabled: false,
    disableDownload: false,
  });

  const [localTheme, setLocalTheme] = useState({
    primaryColor: '#D4AF37',
    accentColor: '#F5E6CC',
    backgroundColor: '#FAF8F5',
    textColor: '#1A1A1A',
  });

  const [localStorageConfig, setLocalStorageConfig] = useState<{
    type: 'local' | 'cloudinary' | 'supabase';
    githubToken: string;
    githubRepoOwner: string;
    githubRepoName: string;
    githubBranch: string;
    cloudinaryCloudName: string;
    cloudinaryUploadPreset: string;
    supabaseUrl: string;
    supabaseAnonKey: string;
    supabaseBucket: string;
  }>({
    type: 'local',
    githubToken: '',
    githubRepoOwner: '',
    githubRepoName: '',
    githubBranch: 'main',
    cloudinaryCloudName: '',
    cloudinaryUploadPreset: '',
    supabaseUrl: '',
    supabaseAnonKey: '',
    supabaseBucket: 'wedding',
  });

  useEffect(() => {
    setIsClient(true);
    setLocalSettings({
      brideName: settings.brideName,
      groomName: settings.groomName,
      weddingDate: settings.weddingDate,
      weddingLocation: settings.weddingLocation,
      welcomeMessage: settings.welcomeMessage,
      coverImage: settings.coverImage,
      musicUrl: settings.musicUrl,
      musicEnabled: settings.musicEnabled,
      disableDownload: settings.disableDownload,
    });
    setLocalTheme(settings.theme);

    // Load GitHub config
    const ghConfig = getGitHubConfig();
    if (ghConfig) {
      setLocalStorageConfig((prev) => ({
        ...prev,
        githubToken: ghConfig.token || '',
        githubRepoOwner: ghConfig.owner || '',
        githubRepoName: ghConfig.repo || '',
        githubBranch: ghConfig.branch || 'main',
      }));
    }
  }, [settings]);

  const handleSave = () => {
    updateSettings(localSettings);
    updateTheme(localTheme);
    updateStorageConfig({
      type: localStorageConfig.type,
      cloudinary: {
        cloudName: localStorageConfig.cloudinaryCloudName,
        uploadPreset: localStorageConfig.cloudinaryUploadPreset,
      },
      supabase: {
        url: localStorageConfig.supabaseUrl,
        anonKey: localStorageConfig.supabaseAnonKey,
        bucket: localStorageConfig.supabaseBucket,
      },
      github: {
        token: localStorageConfig.githubToken,
        repoOwner: localStorageConfig.githubRepoOwner,
        repoName: localStorageConfig.githubRepoName,
        branch: localStorageConfig.githubBranch,
      },
    });

    // Save GitHub config for image upload
    saveGitHubConfig({
      token: localStorageConfig.githubToken,
      owner: localStorageConfig.githubRepoOwner,
      repo: localStorageConfig.githubRepoName,
      branch: localStorageConfig.githubBranch,
      folder: 'media',
    });

    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (!isClient) return null;
  if (!isAuthenticated || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-luxury-cream via-luxury-beige to-luxury-cream">
        <p className="font-sans text-luxury-dark/60">غير مصرح بالدخول</p>
      </div>
    );
  }

  const sections = [
    { id: 'general', label: 'عام', icon: Globe },
    { id: 'theme', label: 'المظهر', icon: Palette },
    { id: 'storage', label: 'التخزين', icon: Database },
    { id: 'domain', label: 'الدومين', icon: Globe },
    { id: 'music', label: 'الموسيقى', icon: Music },
    { id: 'security', label: 'الأمان', icon: Lock },
  ];

  return (
    <div className="min-h-screen bg-luxury-cream">
      <LuxuryHeader />
      <div className="pt-24 pb-12 max-w-5xl mx-auto px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="font-script text-4xl md:text-5xl text-luxury-dark mb-2">
            الإعدادات
          </h1>
          <p className="font-sans text-luxury-dark/60">
            خصص موقع زفافك حسب رغبتك
          </p>
        </motion.div>

        <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`flex items-center gap-2 px-5 py-3 rounded-xl font-sans text-sm transition-all duration-300 whitespace-nowrap ${
                  activeSection === section.id
                    ? 'bg-luxury-gold text-white shadow-gold'
                    : 'glass text-luxury-dark/60 hover:text-luxury-gold'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{section.label}</span>
              </button>
            );
          })}
        </div>

        <GlassCard intensity="strong">
          <div className="p-6 md:p-8 space-y-6">
            {activeSection === 'general' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <h2 className="font-sans text-xl text-luxury-dark mb-6">المعلومات الأساسية</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-sans text-sm text-luxury-dark/70 mb-2">اسم العريس</label>
                    <input
                      type="text"
                      value={localSettings.groomName}
                      onChange={(e) => setLocalSettings({ ...localSettings, groomName: e.target.value })}
                      className="input-luxury"
                    />
                  </div>
                  <div>
                    <label className="block font-sans text-sm text-luxury-dark/70 mb-2">اسم العروس</label>
                    <input
                      type="text"
                      value={localSettings.brideName}
                      onChange={(e) => setLocalSettings({ ...localSettings, brideName: e.target.value })}
                      className="input-luxury"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-sans text-sm text-luxury-dark/70 mb-2">تاريخ الزفاف</label>
                  <input
                    type="datetime-local"
                    value={localSettings.weddingDate.slice(0, 16)}
                    onChange={(e) => setLocalSettings({ ...localSettings, weddingDate: e.target.value + ':00' })}
                    className="input-luxury"
                  />
                </div>

                <div>
                  <label className="block font-sans text-sm text-luxury-dark/70 mb-2">مكان الزفاف</label>
                  <input
                    type="text"
                    value={localSettings.weddingLocation}
                    onChange={(e) => setLocalSettings({ ...localSettings, weddingLocation: e.target.value })}
                    className="input-luxury"
                  />
                </div>

                <div>
                  <label className="block font-sans text-sm text-luxury-dark/70 mb-2">رسالة الترحيب</label>
                  <textarea
                    value={localSettings.welcomeMessage}
                    onChange={(e) => setLocalSettings({ ...localSettings, welcomeMessage: e.target.value })}
                    className="input-luxury h-24 resize-none"
                  />
                </div>

                <div>
                  <label className="block font-sans text-sm text-luxury-dark/70 mb-2">رابط صورة الغلاف</label>
                  <input
                    type="url"
                    value={localSettings.coverImage}
                    onChange={(e) => setLocalSettings({ ...localSettings, coverImage: e.target.value })}
                    className="input-luxury"
                    placeholder="https://example.com/cover.jpg"
                  />
                </div>
              </motion.div>
            )}

            {activeSection === 'theme' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <h2 className="font-sans text-xl text-luxury-dark mb-6">تخصيص المظهر</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block font-sans text-sm text-luxury-dark/70 mb-2">اللون الرئيسي</label>
                    <div className="flex gap-3 items-center">
                      <input
                        type="color"
                        value={localTheme.primaryColor}
                        onChange={(e) => setLocalTheme({ ...localTheme, primaryColor: e.target.value })}
                        className="w-12 h-12 rounded-xl cursor-pointer border border-luxury-gold/30"
                      />
                      <span className="font-sans text-sm text-luxury-dark/60">{localTheme.primaryColor}</span>
                    </div>
                  </div>

                  <div>
                    <label className="block font-sans text-sm text-luxury-dark/70 mb-2">لون الإظهار</label>
                    <div className="flex gap-3 items-center">
                      <input
                        type="color"
                        value={localTheme.accentColor}
                        onChange={(e) => setLocalTheme({ ...localTheme, accentColor: e.target.value })}
                        className="w-12 h-12 rounded-xl cursor-pointer border border-luxury-gold/30"
                      />
                      <span className="font-sans text-sm text-luxury-dark/60">{localTheme.accentColor}</span>
                    </div>
                  </div>

                  <div>
                    <label className="block font-sans text-sm text-luxury-dark/70 mb-2">لون الخلفية</label>
                    <div className="flex gap-3 items-center">
                      <input
                        type="color"
                        value={localTheme.backgroundColor}
                        onChange={(e) => setLocalTheme({ ...localTheme, backgroundColor: e.target.value })}
                        className="w-12 h-12 rounded-xl cursor-pointer border border-luxury-gold/30"
                      />
                      <span className="font-sans text-sm text-luxury-dark/60">{localTheme.backgroundColor}</span>
                    </div>
                  </div>

                  <div>
                    <label className="block font-sans text-sm text-luxury-dark/70 mb-2">لون النص</label>
                    <div className="flex gap-3 items-center">
                      <input
                        type="color"
                        value={localTheme.textColor}
                        onChange={(e) => setLocalTheme({ ...localTheme, textColor: e.target.value })}
                        className="w-12 h-12 rounded-xl cursor-pointer border border-luxury-gold/30"
                      />
                      <span className="font-sans text-sm text-luxury-dark/60">{localTheme.textColor}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-8 p-6 rounded-2xl" style={{ background: localTheme.backgroundColor, color: localTheme.textColor, border: `2px solid ${localTheme.primaryColor}40` }}>
                  <p className="font-sans text-sm mb-2">معاينة حية:</p>
                  <p style={{ color: localTheme.primaryColor }} className="font-script text-3xl mb-2">
                    {localSettings.groomName || 'العريس'} & {localSettings.brideName || 'العروس'}
                  </p>
                  <p className="font-sans text-sm opacity-60">هذا هو شكل النصوص في الموقع</p>
                </div>
              </motion.div>
            )}

            {activeSection === 'storage' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <h2 className="font-sans text-xl text-luxury-dark mb-6">إعدادات التخزين</h2>

                <div>
                  <label className="block font-sans text-sm text-luxury-dark/70 mb-3">نوع التخزين</label>
                  <div className="flex gap-3">
                    {['local', 'cloudinary', 'supabase'].map((type) => (
                      <button
                        key={type}
                        onClick={() => setLocalStorageConfig({ ...localStorageConfig, type: type as 'local' | 'cloudinary' | 'supabase' })}
                        className={`flex items-center gap-2 px-5 py-3 rounded-xl font-sans text-sm transition-all duration-300 ${
                          localStorageConfig.type === type
                            ? 'bg-luxury-gold text-white shadow-gold'
                            : 'glass text-luxury-dark/60 hover:text-luxury-gold'
                        }`}
                      >
                        {type === 'local' && <Database className="w-4 h-4" />}
                        {type === 'cloudinary' && <Cloud className="w-4 h-4" />}
                        {type === 'supabase' && <Image className="w-4 h-4" />}
                        <span>
                          {type === 'local' && 'محلي (LocalStorage)'}
                          {type === 'cloudinary' && 'Cloudinary'}
                          {type === 'supabase' && 'Supabase'}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {localStorageConfig.type === 'cloudinary' && (
                  <div className="space-y-4 p-4 rounded-2xl bg-luxury-gold/5 border border-luxury-gold/20">
                    <h3 className="font-sans font-medium text-luxury-dark">إعدادات Cloudinary</h3>
                    <div>
                      <label className="block font-sans text-sm text-luxury-dark/70 mb-2">Cloud Name</label>
                      <input
                        type="text"
                        value={localStorageConfig.cloudinaryCloudName}
                        onChange={(e) => setLocalStorageConfig({ ...localStorageConfig, cloudinaryCloudName: e.target.value })}
                        className="input-luxury"
                        placeholder="your-cloud-name"
                      />
                    </div>
                    <div>
                      <label className="block font-sans text-sm text-luxury-dark/70 mb-2">Upload Preset</label>
                      <input
                        type="text"
                        value={localStorageConfig.cloudinaryUploadPreset}
                        onChange={(e) => setLocalStorageConfig({ ...localStorageConfig, cloudinaryUploadPreset: e.target.value })}
                        className="input-luxury"
                        placeholder="wedding_preset"
                      />
                    </div>
                  </div>
                )}

                {localStorageConfig.type === 'supabase' && (
                  <div className="space-y-4 p-4 rounded-2xl bg-luxury-gold/5 border border-luxury-gold/20">
                    <h3 className="font-sans font-medium text-luxury-dark">إعدادات Supabase</h3>
                    <div>
                      <label className="block font-sans text-sm text-luxury-dark/70 mb-2">Supabase URL</label>
                      <input
                        type="url"
                        value={localStorageConfig.supabaseUrl}
                        onChange={(e) => setLocalStorageConfig({ ...localStorageConfig, supabaseUrl: e.target.value })}
                        className="input-luxury"
                        placeholder="https://your-project.supabase.co"
                      />
                    </div>
                    <div>
                      <label className="block font-sans text-sm text-luxury-dark/70 mb-2">Supabase Anon Key</label>
                      <div className="relative">
                        <input
                          type={showToken ? 'text' : 'password'}
                          value={localStorageConfig.supabaseAnonKey}
                          onChange={(e) => setLocalStorageConfig({ ...localStorageConfig, supabaseAnonKey: e.target.value })}
                          className="input-luxury ml-10"
                          placeholder="your-anon-key"
                        />
                        <button
                          onClick={() => setShowToken(!showToken)}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-luxury-dark/30 hover:text-luxury-gold"
                        >
                          {showToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block font-sans text-sm text-luxury-dark/70 mb-2">Bucket Name</label>
                      <input
                        type="text"
                        value={localStorageConfig.supabaseBucket}
                        onChange={(e) => setLocalStorageConfig({ ...localStorageConfig, supabaseBucket: e.target.value })}
                        className="input-luxury"
                        placeholder="wedding"
                      />
                    </div>
                  </div>
                )}

                {localStorageConfig.type === 'local' && (
                  <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20">
                    <p className="font-sans text-sm text-blue-600 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      التخزين المحلي يحفظ البيانات في متصفحك فقط. قد تفقد البيانات إذا مسحت ذاكرة التخزين.
                    </p>
                  </div>
                )}

                <div className="space-y-4 p-4 rounded-2xl bg-luxury-gold/5 border border-luxury-gold/20">
                  <h3 className="font-sans font-medium text-luxury-dark flex items-center gap-2">
                    <Github className="w-5 h-5" />
                    إعدادات GitHub (للنشر)
                  </h3>
                  <div>
                    <label className="block font-sans text-sm text-luxury-dark/70 mb-2">GitHub Token</label>
                    <div className="relative">
                      <input
                        type={showToken ? 'text' : 'password'}
                        value={localStorageConfig.githubToken}
                        onChange={(e) => setLocalStorageConfig({ ...localStorageConfig, githubToken: e.target.value })}
                        className="input-luxury ml-10"
                        placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                      />
                      <button
                        onClick={() => setShowToken(!showToken)}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-luxury-dark/30 hover:text-luxury-gold"
                      >
                        {showToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block font-sans text-sm text-luxury-dark/70 mb-2">Owner</label>
                      <input
                        type="text"
                        value={localStorageConfig.githubRepoOwner}
                        onChange={(e) => setLocalStorageConfig({ ...localStorageConfig, githubRepoOwner: e.target.value })}
                        className="input-luxury"
                        placeholder="your-username"
                      />
                    </div>
                    <div>
                      <label className="block font-sans text-sm text-luxury-dark/70 mb-2">Repository</label>
                      <input
                        type="text"
                        value={localStorageConfig.githubRepoName}
                        onChange={(e) => setLocalStorageConfig({ ...localStorageConfig, githubRepoName: e.target.value })}
                        className="input-luxury"
                        placeholder="wedding-site"
                      />
                    </div>
                    <div>
                      <label className="block font-sans text-sm text-luxury-dark/70 mb-2">Branch</label>
                      <input
                        type="text"
                        value={localStorageConfig.githubBranch}
                        onChange={(e) => setLocalStorageConfig({ ...localStorageConfig, githubBranch: e.target.value })}
                        className="input-luxury"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeSection === 'domain' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <h2 className="font-sans text-xl text-luxury-dark mb-6">إعدادات الدومين والنشر</h2>

                <div className="space-y-4 p-4 rounded-2xl bg-luxury-gold/5 border border-luxury-gold/20">
                  <h3 className="font-sans font-medium text-luxury-dark">رابط الموقع</h3>
                  <div>
                    <label className="block font-sans text-sm text-luxury-dark/70 mb-2">رابط الموقع الحالي</label>
                    <input
                      type="url"
                      value={typeof window !== 'undefined' ? window.location.origin : ''}
                      className="input-luxury bg-white/30 cursor-not-allowed"
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block font-sans text-sm text-luxury-dark/70 mb-2">الدومين المخصص (اختياري)</label>
                    <input
                      type="text"
                      className="input-luxury"
                      placeholder="https://your-domain.com"
                    />
                    <p className="font-sans text-xs text-luxury-dark/40 mt-2">
                      يمكنك استخدام دومين مخصص عن طريق إضافة سجل CNAME في إعدادات الدومين الخاص بك.
                    </p>
                  </div>
                </div>

                <div className="space-y-4 p-4 rounded-2xl bg-luxury-gold/5 border border-luxury-gold/20">
                  <h3 className="font-sans font-medium text-luxury-dark">خيارات النشر</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="glass rounded-xl p-4 text-center">
                      <Github className="w-8 h-8 text-luxury-gold mx-auto mb-3" />
                      <p className="font-sans font-medium text-luxury-dark mb-1">GitHub Pages</p>
                      <p className="font-sans text-xs text-luxury-dark/50 mb-3">نشر مجاني وسريع</p>
                      <code className="text-xs bg-luxury-dark/5 px-3 py-1 rounded-lg block">
                        username.github.io/repo
                      </code>
                    </div>
                    <div className="glass rounded-xl p-4 text-center">
                      <Globe className="w-8 h-8 text-luxury-gold mx-auto mb-3" />
                      <p className="font-sans font-medium text-luxury-dark mb-1">Vercel</p>
                      <p className="font-sans text-xs text-luxury-dark/50 mb-3">أفضل خيار لـ Next.js</p>
                      <code className="text-xs bg-luxury-dark/5 px-3 py-1 rounded-lg block">
                        vercel.com
                      </code>
                    </div>
                  </div>
                  <p className="font-sans text-xs text-luxury-dark/40 mt-2">
                    نصيحة: استخدم Vercel للحصول على أفضل أداء لموقع Next.js. فقط اربط مستودع GitHub وسيتم النشر تلقائياً.
                  </p>
                </div>

                <div className="space-y-4 p-4 rounded-2xl bg-luxury-gold/5 border border-luxury-gold/20">
                  <h3 className="font-sans font-medium text-luxury-dark">SEO وإعدادات المشاركة</h3>
                  <div>
                    <label className="block font-sans text-sm text-luxury-dark/70 mb-2">وصف الموقع (Meta Description)</label>
                    <textarea
                      className="input-luxury h-20 resize-none"
                      placeholder="موقع زفاف شخصي فاخر"
                      defaultValue="موقع زفاف شخصي فاخر لمشاركة لحظات الفرح مع الأهل والأصدقاء"
                    />
                  </div>
                  <div>
                    <label className="block font-sans text-sm text-luxury-dark/70 mb-2">رابط صورة المشاركة (OG Image)</label>
                    <input
                      type="url"
                      className="input-luxury"
                      placeholder="https://example.com/og-image.jpg"
                    />
                    <p className="font-sans text-xs text-luxury-dark/40 mt-2">
                      هذه الصورة ستظهر عند مشاركة الرابط في وسائل التواصل الاجتماعي.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {activeSection === 'music' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <h2 className="font-sans text-xl text-luxury-dark mb-6">إعدادات الموسيقى</h2>

                <div className="flex items-center justify-between p-4 rounded-xl bg-luxury-gold/5 border border-luxury-gold/20">
                  <div>
                    <p className="font-sans font-medium text-luxury-dark">تشغيل الموسيقى</p>
                    <p className="font-sans text-sm text-luxury-dark/50">تشغيل موسيقى خلفية في الموقع</p>
                  </div>
                  <button
                    onClick={() => setLocalSettings({ ...localSettings, musicEnabled: !localSettings.musicEnabled })}
                    className={`w-14 h-7 rounded-full transition-all duration-300 ${
                      localSettings.musicEnabled ? 'bg-luxury-gold' : 'bg-luxury-dark/20'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full bg-white shadow-md transition-all duration-300 ${
                      localSettings.musicEnabled ? 'translate-x-8' : 'translate-x-1'
                    }`} />
                  </button>
                </div>

                <div>
                  <label className="block font-sans text-sm text-luxury-dark/70 mb-2">رابط الموسيقى (MP3)</label>
                  <input
                    type="url"
                    value={localSettings.musicUrl}
                    onChange={(e) => setLocalSettings({ ...localSettings, musicUrl: e.target.value })}
                    className="input-luxury"
                    placeholder="https://example.com/music.mp3"
                  />
                  <p className="font-sans text-xs text-luxury-dark/40 mt-2">
                    يمكنك رفع ملف MP3 على أي خدمة استضافة والحصول على الرابط المباشر
                  </p>
                </div>
              </motion.div>
            )}

            {activeSection === 'security' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <h2 className="font-sans text-xl text-luxury-dark mb-6">إعدادات الأمان والخصوصية</h2>

                <div className="flex items-center justify-between p-4 rounded-xl bg-luxury-gold/5 border border-luxury-gold/20">
                  <div>
                    <p className="font-sans font-medium text-luxury-dark">منع التحميل</p>
                    <p className="font-sans text-sm text-luxury-dark/50">منع تحميل الصور والفيديوهات من الموقع</p>
                  </div>
                  <button
                    onClick={() => setLocalSettings({ ...localSettings, disableDownload: !localSettings.disableDownload })}
                    className={`w-14 h-7 rounded-full transition-all duration-300 ${
                      localSettings.disableDownload ? 'bg-luxury-gold' : 'bg-luxury-dark/20'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full bg-white shadow-md transition-all duration-300 ${
                      localSettings.disableDownload ? 'translate-x-8' : 'translate-x-1'
                    }`} />
                  </button>
                </div>

                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20">
                  <div className="flex items-start gap-3">
                    <Lock className="w-5 h-5 text-amber-600 mt-0.5" />
                    <div>
                      <p className="font-sans font-medium text-amber-700 mb-1">حماية الموقع</p>
                      <p className="font-sans text-sm text-amber-600/80">
                        الموقع محمي بكلمة مرور يمكنك تغييرها من ملف <code className="px-2 py-0.5 rounded bg-amber-500/20">.env.local</code>.
                        كلمة المرور الحالية: <strong>{process.env.NEXT_PUBLIC_SITE_PASSWORD || 'wedding2024'}</strong>
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            <div className="pt-6 border-t border-luxury-gold/20 flex items-center gap-3">
              <button
                onClick={handleSave}
                className="btn-luxury flex items-center gap-2"
              >
                {saved ? (
                  <>
                    <Check className="w-5 h-5" />
                    <span>تم الحفظ</span>
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    <span>حفظ الإعدادات</span>
                  </>
                )}
              </button>
              <button
                onClick={() => {
                  if (confirm('هل تريد استعادة الإعدادات الافتراضية؟')) {
                    localStorage.removeItem('wedding_settings');
                    window.location.reload();
                  }
                }}
                className="px-6 py-3 border-2 border-red-400/30 text-red-400 rounded-full hover:bg-red-500/10 transition-all duration-300 text-sm flex items-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                استعادة default
              </button>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
