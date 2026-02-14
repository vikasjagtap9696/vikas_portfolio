import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api',
});

// Add a request interceptor to include the auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export const projectsApi = {
    getAll: () => api.get('/projects'),
    create: (data: any) => api.post('/projects', data),
    update: (id: string | number, data: any) => api.put(`/projects/${id}`, data),
    delete: (id: string | number) => api.delete(`/projects/${id}`),
};

export const skillsApi = {
    getAll: () => api.get('/skills'),
    create: (data: any) => api.post('/skills', data),
    update: (id: string | number, data: any) => api.put(`/skills/${id}`, data),
    delete: (id: string | number) => api.delete(`/skills/${id}`),
};

export const contactApi = {
    send: (data: any) => api.post('/contact', data),
    getAll: () => api.get('/contact'),
    delete: (id: string | number) => api.delete(`/contact/${id}`),
};

export const profileApi = {
    get: () => api.get('/profile'),
    update: (data: any) => api.put('/profile', data),
};

export const experienceApi = {
    getAll: () => api.get('/experience'),
    create: (data: any) => api.post('/experience', data),
    update: (id: string | number, data: any) => api.put(`/experience/${id}`, data),
    delete: (id: string | number) => api.delete(`/experience/${id}`),
};

export const certificatesApi = {
    getAll: () => api.get('/certificates'),
    create: (data: any) => api.post('/certificates', data),
    update: (id: string | number, data: any) => api.put(`/certificates/${id}`, data),
    delete: (id: string | number) => api.delete(`/certificates/${id}`),
};

export const authApi = {
    login: (credentials: any) => api.post('/auth/login', credentials),
    // register: (data: any) => api.post('/auth/register', data), // if needed
};

export const notificationsApi = {
    get: () => api.get('/notifications'),
    update: (data: any) => api.post('/notifications', data),
};

export const resumeApi = {
    get: () => api.get('/resume'),
    update: (data: any) => api.post('/resume', data),
};

export const uploadApi = {
    upload: (file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        return api.post('/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },
};

export default api;
