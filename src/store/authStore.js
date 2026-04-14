// frontend/src/store/authStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set) => ({
      token: null,
      user: null,
      identifier: null,
      tempUserInfo: null,  // Make sure this exists
      setToken: (token) => set({ token }),
      setUser: (user) => set({ user }),
      setIdentifier: (identifier) => set({ identifier }),
      setUserInfo: (info) => set({ tempUserInfo: info }),
      logout: () => set({ token: null, user: null, identifier: null, tempUserInfo: null }),
    }),
    {
      name: 'auth-storage',
    }
  )
);