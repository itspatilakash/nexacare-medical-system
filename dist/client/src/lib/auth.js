import { apiRequest } from "./queryClient";
export const authApi = {
    register: async (data) => {
        const response = await apiRequest('POST', '/api/auth/register', data);
        return response.json();
    },
    verifyOtp: async (data) => {
        const response = await apiRequest('POST', '/api/auth/verify-otp', data);
        return response.json();
    },
    login: async (data) => {
        const response = await apiRequest('POST', '/api/auth/login', data);
        return response.json();
    },
    getProfile: async () => {
        const response = await apiRequest('GET', '/api/auth/me');
        return response.json();
    },
    logout: () => {
        localStorage.removeItem('auth-token');
        window.location.href = '/';
    },
};
export const getAuthToken = () => {
    return localStorage.getItem('auth-token');
};
export const setAuthToken = (token) => {
    localStorage.setItem('auth-token', token);
};
export const isAuthenticated = () => {
    return !!getAuthToken();
};
export const decodeToken = (token) => {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64)
            .split('')
            .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
            .join(''));
        return JSON.parse(jsonPayload);
    }
    catch (error) {
        return null;
    }
};
export const getUserFromToken = () => {
    const token = getAuthToken();
    if (!token)
        return null;
    return decodeToken(token);
};
