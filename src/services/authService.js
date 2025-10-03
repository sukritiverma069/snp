
import { apiPost, apiGet } from '../utils/apiHelper';

export const loginUser = async (username, password) => {
    try {
        const loginData = await apiPost('/auth/login', {
            username,
            password,
        });
        
        return loginData;
    } catch (error) {
        console.error('Login failed:', error);
        throw error;
    }
};


export const refreshAccessToken = async (refreshToken) => {
    try {
        const tokenData = await apiPost('/auth/refresh', {
            refreshToken,
        });
        
        return tokenData;
    } catch (error) {
        console.error('Token refresh failed:', error);
        throw error;
    }
};
