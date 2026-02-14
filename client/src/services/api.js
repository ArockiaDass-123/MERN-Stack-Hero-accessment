import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
        const { token } = JSON.parse(userInfo);
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const authService = {
    login: async (email, password) => {
        const response = await api.post('/auth/login', { email, password });
        if (response.data) {
            localStorage.setItem('userInfo', JSON.stringify(response.data));
        }
        return response.data;
    },
    signup: async (name, email, password) => {
        const response = await api.post('/auth/signup', { name, email, password });
        if (response.data) {
            localStorage.setItem('userInfo', JSON.stringify(response.data));
        }
        return response.data;
    },
    logout: () => {
        localStorage.removeItem('userInfo');
    }
};

export const eventService = {
    getEvents: async (params) => {
        const response = await api.get('/events', { params });
        return response.data;
    },
    getEvent: async (id) => {
        const response = await api.get(`/events/${id}`);
        return response.data;
    },
    register: async (id) => {
        const response = await api.post(`/events/${id}/register`);
        return response.data;
    },
    cancel: async (id) => {
        const response = await api.post(`/events/${id}/cancel`);
        return response.data;
    },
    getMyEvents: async () => {
        const response = await api.get('/events/user/my-events');
        return response.data;
    }
};

export default api;
