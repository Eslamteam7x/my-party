import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEYS = {
  PHOTOS: 'wedding_photos',
  VIDEOS: 'wedding_videos',
  SETTINGS: 'wedding_settings',
  ALBUMS: 'wedding_albums',
};

export interface StoredFile {
  id: string;
  dataUrl: string;
  name: string;
  type: string;
  size: number;
  createdAt: string;
  album?: string;
  caption?: string;
}

export const storage = {
  getPhotos: (): StoredFile[] => {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PHOTOS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  savePhotos: (photos: StoredFile[]): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.PHOTOS, JSON.stringify(photos));
  },

  addPhoto: (file: StoredFile): StoredFile[] => {
    const photos = storage.getPhotos();
    photos.push(file);
    storage.savePhotos(photos);
    return photos;
  },

  removePhoto: (id: string): StoredFile[] => {
    const photos = storage.getPhotos().filter((p) => p.id !== id);
    storage.savePhotos(photos);
    return photos;
  },

  updatePhoto: (id: string, updates: Partial<StoredFile>): StoredFile[] => {
    const photos = storage.getPhotos().map((p) =>
      p.id === id ? { ...p, ...updates } : p
    );
    storage.savePhotos(photos);
    return photos;
  },

  getVideos: (): StoredFile[] => {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem(STORAGE_KEYS.VIDEOS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveVideos: (videos: StoredFile[]): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.VIDEOS, JSON.stringify(videos));
  },

  addVideo: (file: StoredFile): StoredFile[] => {
    const videos = storage.getVideos();
    videos.push(file);
    storage.saveVideos(videos);
    return videos;
  },

  removeVideo: (id: string): StoredFile[] => {
    const videos = storage.getVideos().filter((v) => v.id !== id);
    storage.saveVideos(videos);
    return videos;
  },

  getSettings: () => {
    if (typeof window === 'undefined') return null;
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  saveSettings: (settings: Record<string, unknown>): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  },

  getAlbums: () => {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ALBUMS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveAlbums: (albums: unknown[]): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.ALBUMS, JSON.stringify(albums));
  },

  getTotalSize: (): number => {
    const photos = storage.getPhotos();
    const videos = storage.getVideos();
    return [...photos, ...videos].reduce((acc, f) => acc + f.size, 0);
  },

  clearAll: (): void => {
    Object.values(STORAGE_KEYS).forEach((key) => localStorage.removeItem(key));
  },

  addAlbum: (album: { id: string; name: string; description?: string }) => {
    const albums = storage.getAlbums();
    albums.push(album);
    storage.saveAlbums(albums);
    return albums;
  },

  removeAlbum: (id: string) => {
    const albums = storage.getAlbums().filter((a: any) => a.id !== id);
    storage.saveAlbums(albums);
    const photos = storage.getPhotos().map((p) =>
      p.album === id ? { ...p, album: undefined } : p
    );
    storage.savePhotos(photos);
    return albums;
  },

  updateAlbum: (id: string, updates: Record<string, unknown>) => {
    const albums = storage.getAlbums().map((a: any) =>
      a.id === id ? { ...a, ...updates } : a
    );
    storage.saveAlbums(albums);
    return albums;
  },

  getPhotosByAlbum: (albumId: string) => {
    return storage.getPhotos().filter((p) => p.album === albumId);
  },

  exportData: () => {
    return {
      photos: storage.getPhotos(),
      videos: storage.getVideos(),
      settings: storage.getSettings(),
      albums: storage.getAlbums(),
    };
  },
};
