import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set) => ({
      token: null,
      user: null,
      identifier: null,
      setToken: (token) => set({ token }),
      setUser: (user) => set({ user }),
      setIdentifier: (identifier) => set({ identifier }),
      logout: () => set({ token: null, user: null, identifier: null }),
    }),
    {
      name: 'auth-storage', // unique name for localStorage
    }
  )
);