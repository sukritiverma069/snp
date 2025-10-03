
import { apiGet } from '../utils/apiHelper';

export const getCurrentUserData = async (accessToken) => {
    try {
        const userData = await apiGet('/auth/me', {
            'Authorization': `Bearer ${accessToken}`,
        });
        
        return userData;
    } catch (error) {
        console.error('Failed to get current user:', error);
        throw error;
    }
};