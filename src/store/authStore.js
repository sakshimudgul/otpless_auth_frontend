import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set) => ({
      token: null,
      user: null,
      userRole: null,
      identifier: null,
      setToken: (token) => {
        console.log('Setting token in store');
        set({ token });
      },
      setUser: (user) => {
        console.log('Setting user in store:', user?.name);
        set({ user });
      },
      setUserRole: (role) => {
        console.log('Setting role in store:', role);
        set({ userRole: role });
      },
      setIdentifier: (identifier) => set({ identifier }),
      logout: () => {
        console.log('Clearing store');
        localStorage.removeItem('token');
        localStorage.removeItem('auth-storage');
        set({ token: null, user: null, userRole: null, identifier: null });
      },
    }),
    { 
      name: 'auth-storage',
    }
  )
);