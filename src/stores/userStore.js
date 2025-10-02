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

      updateUser: (updates) => set((state) => ({
        user: state.user ? { ...state.user, ...updates } : updates,
      })),

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

      getUserInitials: () => {
        const { user } = get();
        if (!user) return 'G';
        
        if (user.firstName && user.lastName) {
          return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
        }
        
        if (user.username) {
          return user.username.substring(0, 2).toUpperCase();
        }
        
        if (user.email) {
          return user.email.substring(0, 2).toUpperCase();
        }
        
        return 'U';
      },

      hasRole: (role) => {
        const { user } = get();
        return user?.roles?.includes(role) || false;
      },

      isProfileComplete: () => {
        const { user } = get();
        if (!user) return false;
        
        const requiredFields = ['firstName', 'lastName', 'email'];
        return requiredFields.every(field => user[field] && user[field].trim() !== '');
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