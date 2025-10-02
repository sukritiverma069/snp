const API_BASE_URL = 'https://dummyjson.com';

export const apiRequest = async (endpoint, options = {}) => {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const defaultOptions = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    };

    const config = {
        ...defaultOptions,
        ...options,
        headers: {
            ...defaultOptions.headers,
            ...options.headers,
        },
    };

    try {
        const response = await fetch(url, config);
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            
            if (response.status === 400 && errorData.message?.toLowerCase().includes('invalid credentials')) {
                throw new Error('Invalid username or password');
            }
            
            const message = errorData.message || `Request failed with status ${response.status}`;
            throw new Error(message);
        }

        return await response.json();
    } catch (error) {
        throw error instanceof Error ? error : new Error('Request failed');
    }
};

export const apiGet = (endpoint, headers = {}) => {
    return apiRequest(endpoint, {
        method: 'GET',
        headers,
    });
};

export const apiPost = (endpoint, data, headers = {}) => {
    return apiRequest(endpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify(data),
    });
};
