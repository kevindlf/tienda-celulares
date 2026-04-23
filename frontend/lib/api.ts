import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor - agrega el token automáticamente en cada request
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Interceptor - maneja errores globalmente
api.interceptors.request.use((config) => {
    if (typeof window !== "undefined") {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
});

// Productos
export const productosApi = {
    getAll: () => api.get('/api/productos'),
    getById: (id: number) => api.get(`/api/productos/${id}`),
    crear: (producto: unknown) => api.post('/api/productos', producto),
    actualizar: (id: number, producto: unknown) => api.put(`/api/productos/${id}`, producto),
    eliminar: (id: number) => api.delete(`/api/productos/${id}`),
};

// Auth
export const authApi = {
    login: (email: string, password: string) =>
        api.post('/api/auth/login', { email, password }),
    registro: (datos: unknown) => api.post('/api/auth/registro', datos),
};

// Ordenes
export const ordenesApi = {
    crear: (orden: unknown) => api.post('/api/ordenes', orden),
    misOrdenes: () => api.get('/api/ordenes/mis-ordenes'),
    todas: () => api.get('/api/ordenes'),
    pagar: (id: number) => api.post(`/api/ordenes/${id}/pagar`),
    actualizarEstado: (id: number, estado: string) =>
        api.patch(`/api/ordenes/${id}/estado`, { estado }),
};

export default api;