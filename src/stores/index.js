
import { useAuthStore } from './authStore';
import { useUserStore } from './userStore';

export const useAuth = () => {
  const authStore = useAuthStore();
  const userStore = useUserStore();

  return {
    isAuthenticated: authStore.isAuthenticated,
    accessToken: authStore.accessToken,
    refreshToken: authStore.refreshToken,
    isLoading: authStore.isLoading || userStore.isLoading,
    isUserLoading: userStore.isLoading,
    error: authStore.error || userStore.error,
    
    user: userStore.user,
    
    // Combined actions
    login: async (loginData, userData) => {
      authStore.setAuth(loginData);
      userStore.setUser(userData);
    },
    
    logout: () => {
      authStore.clearAuth();
      userStore.clearUser();
    },
    
    getUserInitials: userStore.getUserInitials,
    isTokenExpired: authStore.isTokenExpired,
    
    authActions: {
      setLoading: authStore.setLoading,
      setError: authStore.setError,
      clearError: authStore.clearError,
      setAuth: authStore.setAuth,
      clearAuth: authStore.clearAuth,
      updateAccessToken: authStore.updateAccessToken,
    },
    
    userActions: {
      setLoading: userStore.setLoading,
      setError: userStore.setError,
      clearError: userStore.clearError,
      setUser: userStore.setUser,
      clearUser: userStore.clearUser,
    },
  };
};