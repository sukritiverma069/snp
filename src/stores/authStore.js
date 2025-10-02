import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      accessToken: null,
      refreshToken: null,
      tokenExpiry: null,
      isLoading: false,
      error: null,

      setLoading: (loading) => set({ isLoading: loading }),
      
      setError: (error) => set({ error }),
      
      clearError: () => set({ error: null }),

      setAuth: (loginData) => {
        const { accessToken, refreshToken, expiresIn } = loginData;
        const tokenExpiry = expiresIn ? Date.now() + (expiresIn * 1000) : null;
        
        set({
          isAuthenticated: true,
          accessToken,
          refreshToken,
          tokenExpiry,
          error: null,
          isLoading: false,
        });
      },

      clearAuth: () => {
        localStorage.removeItem('auth-storage');
        localStorage.removeItem('user-storage');
        localStorage.removeItem('timeOnMount');
        
        set({
          isAuthenticated: false,
          accessToken: null,
          refreshToken: null,
          tokenExpiry: null,
          error: null,
          isLoading: false,
        });
      },

      updateAccessToken: (accessToken, expiresIn) => {
        const tokenExpiry = expiresIn ? Date.now() + (expiresIn * 1000) : null;
        set({ accessToken, tokenExpiry });
      },

      extendSession: async () => {
        const { refreshToken } = get();
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        try {
          set({ isLoading: true, error: null });
          
          const { refreshAccessToken } = await import('../services/authService');
          const tokenData = await refreshAccessToken(refreshToken);
          
          const tokenExpiry = tokenData.expiresIn ? Date.now() + (tokenData.expiresIn * 1000) : null;
          set({
            accessToken: tokenData.accessToken,
            refreshToken: tokenData.refreshToken || refreshToken,
            isLoading: false,
            error: null
          });

          return tokenData;
        } catch (error) {
          console.error('Session extension failed:', error);
          set({ error: error.message, isLoading: false });
          throw error;
        }
      },

      isTokenExpired: () => {
        const { tokenExpiry } = get();
        if (!tokenExpiry) return false;
        return Date.now() >= tokenExpiry;
      },

      getAuthHeader: () => {
        const { accessToken, isTokenExpired } = get();
        if (!accessToken || isTokenExpired()) {
          return null;
        }
        return { Authorization: `Bearer ${accessToken}` };
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        tokenExpiry: state.tokenExpiry,
      }),
    }
  )
);