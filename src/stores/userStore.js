import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useUserStore = create(
  persist(
    (set, get) => ({
      user: null,
      isLoading: false,
      error: null,
      setLoading: (loading) => set({ isLoading: loading }),
      
      setError: (error) => set({ error }),
      
      clearError: () => set({ error: null }),

      setUser: (userData) => set({
        user: userData,
        error: null,
        isLoading: false,
      }),

      clearUser: () => set({
        user: null,
        error: null,
        isLoading: false,
      }),

      getUserDisplayName: () => {
        const { user } = get();
        if (!user) return 'Guest';
        return user.firstName && user.lastName 
          ? `${user.firstName} ${user.lastName}`
          : user.username || user.email || 'User';
      },

    }),
    {
      name: 'user-storage', // localStorage key
      partialize: (state) => ({
        user: state.user,
      }),
    }
  )
);