'use client';

import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Image, Video, File, Check, AlertCircle, Github } from 'lucide-react';
import { compressImage, getImageDataUrl, generateId } from '@/lib/utils';
import { uploadToGitHub, getGitHubConfig } from '@/lib/github-storage';
import type { StoredFile } from '@/lib/storage';

interface DragDropUploadProps {
  onFilesAdded: (files: StoredFile[]) => void;
  accept?: string;
  multiple?: boolean;
  maxSize?: number;
}

export default function DragDropUpload({
  onFilesAdded,
  accept = 'image/*,video/*',
  multiple = true,
  maxSize = 50 * 1024 * 1024,
}: DragDropUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<string>('');
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [storageMode, setStorageMode] = useState<'local' | 'github'>('local');
  const inputRef = useRef<HTMLInputElement>(null);

  const ghConfig = typeof window !== 'undefined' ? getGitHubConfig() : null;

  const handleFiles = useCallback(async (fileList: FileList) => {
    setUploadError(null);
    setUploading(true);
    setUploadProgress(0);
    setUploadStatus('جاري معالجة الملفات...');

    const files = Array.from(fileList);
    const validFiles: StoredFile[] = [];
    let processed = 0;

    for (const file of files) {
      if (file.size > maxSize) {
        setUploadError(`الملف ${file.name} كبير جداً (${(file.size / 1024 / 1024).toFixed(1)}MB)`);
        continue;
      }

      try {
        let dataUrl: string;
        const id = generateId();

        if (storageMode === 'github' && ghConfig) {
          setUploadStatus(`جاري رفع ${file.name} إلى GitHub...`);
          const url = await uploadToGitHub(file, (pct) => {
            setUploadProgress(Math.round((pct + processed * 100) / files.length));
          });
          dataUrl = url;
        } else {
          if (file.type.startsWith('image/')) {
            const compressed = await compressImage(file);
            dataUrl = await new Promise((resolve) => {
              const reader = new FileReader();
              reader.onload = () => resolve(reader.result as string);
              reader.readAsDataURL(compressed);
            });
          } else {
            dataUrl = await getImageDataUrl(file);
          }
        }

        validFiles.push({
          id,
          dataUrl,
          name: file.name,
          type: file.type,
          size: file.size,
          createdAt: new Date().toISOString(),
        });
      } catch (err: any) {
        setUploadError(`فشل في رفع ${file.name}: ${err.message}`);
      }

      processed++;
      setUploadProgress(Math.round((processed / files.length) * 100));
    }

    if (validFiles.length > 0) {
      setUploadStatus(`تم رفع ${validFiles.length} ملف بنجاح`);
      onFilesAdded(validFiles);
    }

    setUploading(false);
    setUploadProgress(0);
    setUploadStatus('');
  }, [maxSize, onFilesAdded, storageMode, ghConfig]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  }, [handleFiles]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-center gap-2 mb-4">
        <button
          onClick={() => setStorageMode('local')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm transition-all ${
            storageMode === 'local' ? 'bg-luxury-gold text-white' : 'glass text-luxury-dark/60'
          }`}
        >
          <Upload className="w-4 h-4" />
          تخزين محلي
        </button>
        <button
          onClick={() => setStorageMode('github')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm transition-all ${
            storageMode === 'github' ? 'bg-luxury-gold text-white' : 'glass text-luxury-dark/60'
          }`}
        >
          <Github className="w-4 h-4" />
          رفع على GitHub
        </button>
      </div>

      {storageMode === 'github' && !ghConfig && (
        <div className="mb-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-sm text-amber-600 text-center">
          ⚠️ لم يتم إعداد GitHub. اذهب إلى <strong>الإعدادات → التخزين</strong> وأضف التوكن.
        </div>
      )}

      <motion.div
        initial={false}
        animate={isDragging ? { scale: 1.02 } : { scale: 1 }}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => inputRef.current?.click()}
        className={`
          relative cursor-pointer rounded-2xl border-2 border-dashed p-8 md:p-12
          transition-all duration-300 text-center
          ${isDragging
            ? 'border-luxury-gold bg-luxury-gold/10'
            : 'border-luxury-gold/30 hover:border-luxury-gold/60 hover:bg-luxury-gold/5'
          }
          ${uploading ? 'pointer-events-none' : ''}
        `}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          className="hidden"
          onChange={handleInputChange}
        />

        <AnimatePresence mode="wait">
          {uploading ? (
            <motion.div
              key="uploading"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex flex-col items-center gap-4"
            >
              <div className="w-16 h-16 rounded-full glass-gold flex items-center justify-center">
                <Upload className="w-8 h-8 text-luxury-gold animate-bounce" />
              </div>
              <p className="font-sans text-luxury-dark/70">{uploadStatus || 'جاري الرفع...'}</p>
              <div className="w-full max-w-xs bg-white/30 rounded-full h-2 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${uploadProgress}%` }}
                  className="h-full gold-gradient rounded-full"
                />
              </div>
              <span className="text-sm text-luxury-dark/50">{uploadProgress}%</span>
            </motion.div>
          ) : (
            <motion.div
              key="idle"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex flex-col items-center gap-4"
            >
              <div className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 ${isDragging ? 'bg-luxury-gold/20 scale-110' : 'glass-gold'}`}>
                {storageMode === 'github' ? (
                  <Github className="w-10 h-10 text-luxury-gold" />
                ) : (
                  <Upload className="w-10 h-10 text-luxury-gold" />
                )}
              </div>
              <div>
                <p className="font-sans text-lg text-luxury-dark/80">
                  {isDragging ? 'أفلت الملفات هنا' : 'اسحب وأفلت الصور والفيديوهات هنا'}
                </p>
                <p className="font-sans text-sm text-luxury-dark/40 mt-2">
                  أو اضغط للاختيار من الجهاز
                </p>
              </div>
              <div className="flex items-center gap-4 text-xs text-luxury-dark/40">
                <span className="flex items-center gap-1"><Image className="w-4 h-4" /> صور</span>
                <span className="flex items-center gap-1"><Video className="w-4 h-4" /> فيديوهات</span>
                <span className="flex items-center gap-1"><File className="w-4 h-4" /> حتى 50MB</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {uploadError && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 flex items-center gap-2 text-red-500 bg-red-500/10 rounded-xl px-4 py-2"
          >
            <AlertCircle className="w-4 h-4" />
            <span className="text-sm">{uploadError}</span>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
