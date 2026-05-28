export interface WeddingUser {
  id: string;
  username: string;
  password: string;
  name: string;
  allowedAlbums: string[];
  createdAt: string;
}

const USERS_KEY = 'wedding_users';
const CURRENT_USER_KEY = 'wedding_current_user';

export const userStorage = {
  getUsers: (): WeddingUser[] => {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem(USERS_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },

  saveUsers: (users: WeddingUser[]): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  },

  addUser: (user: WeddingUser): WeddingUser[] => {
    const users = userStorage.getUsers();
    users.push(user);
    userStorage.saveUsers(users);
    return users;
  },

  removeUser: (id: string): WeddingUser[] => {
    const users = userStorage.getUsers().filter((u) => u.id !== id);
    userStorage.saveUsers(users);
    return users;
  },

  updateUser: (id: string, updates: Partial<WeddingUser>): WeddingUser[] => {
    const users = userStorage.getUsers().map((u) =>
      u.id === id ? { ...u, ...updates } : u
    );
    userStorage.saveUsers(users);
    return users;
  },

  getUserByUsername: (username: string): WeddingUser | undefined => {
    return userStorage.getUsers().find(
      (u) => u.username.toLowerCase() === username.toLowerCase()
    );
  },

  login: (username: string, password: string): WeddingUser | null => {
    const user = userStorage.getUserByUsername(username);
    if (user && user.password === password) {
      sessionStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
      return user;
    }
    return null;
  },

  getCurrentUser: (): WeddingUser | null => {
    if (typeof window === 'undefined') return null;
    try {
      const data = sessionStorage.getItem(CURRENT_USER_KEY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  logout: (): void => {
    sessionStorage.removeItem(CURRENT_USER_KEY);
  },

  clearAll: (): void => {
    localStorage.removeItem(USERS_KEY);
    sessionStorage.removeItem(CURRENT_USER_KEY);
  },
};
