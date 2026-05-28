export interface Photo {
  id: string;
  src: string;
  alt: string;
  width: number;
  height: number;
  album: string;
  createdAt: string;
  caption?: string;
}

export interface Video {
  id: string;
  src: string;
  thumbnail?: string;
  title: string;
  description?: string;
  createdAt: string;
}

export interface Album {
  id: string;
  name: string;
  description?: string;
  coverPhoto?: string;
  createdAt: string;
}

export interface SiteSettings {
  brideName: string;
  groomName: string;
  weddingDate: string;
  weddingLocation: string;
  welcomeMessage: string;
  coverImage: string;
  theme: {
    primaryColor: string;
    accentColor: string;
    backgroundColor: string;
    textColor: string;
    fontFamily: string;
  };
  musicUrl: string;
  musicEnabled: boolean;
  disableDownload: boolean;
  albums: Album[];
}

export interface StorageConfig {
  type: 'local' | 'cloudinary' | 'supabase';
  cloudinary?: {
    cloudName: string;
    uploadPreset: string;
  };
  supabase?: {
    url: string;
    anonKey: string;
    bucket: string;
  };
  github?: {
    token: string;
    repoOwner: string;
    repoName: string;
    branch: string;
  };
}

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}
