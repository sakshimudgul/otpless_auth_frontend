import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set) => ({
      token: null,
      user: null,
      identifier: null,
      tempUserInfo: null,
      setToken: (token) => {
        if (token) {
          localStorage.setItem('auth-token', token);
        } else {
          localStorage.removeItem('auth-token');
        }
        set({ token });
      },
      setUser: (user) => set({ user }),
      setIdentifier: (identifier) => set({ identifier }),
      setUserInfo: (info) => set({ tempUserInfo: info }),
      logout: () => {
        localStorage.removeItem('auth-token');
        set({ token: null, user: null, identifier: null, tempUserInfo: null });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);