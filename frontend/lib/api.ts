import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor — agrega el token automáticamente en cada request
api.interceptors.request.use((config) => {
    if (typeof window !== "undefined") {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
});

// Interceptor — maneja errores de autenticación globalmente
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401 && typeof window !== "undefined") {
            localStorage.removeItem("token");
            localStorage.removeItem("usuario");
            // Solo redirigir si no estamos ya en login o registro
            const path = window.location.pathname;
            if (path !== "/login" && path !== "/registro") {
                window.location.href = "/login";
            }
        }
        return Promise.reject(error);
    }
);

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

// Ventas físicas (POS)
export const ventasFisicasApi = {
    registrar: (venta: unknown) => api.post('/api/ventas-fisicas', venta),
};

// Reportes
export const reportesApi = {
    resumen: () => api.get('/api/reportes/resumen'),
    stockBajo: () => api.get('/api/reportes/stock-bajo'),
    ventasPorEstado: () => api.get('/api/reportes/ventas-por-estado'),
};

// Catálogo (para dropdowns de formularios)
export const catalogoApi = {
    marcas: () => api.get('/api/catalogo/marcas'),
    modelos: (marca: string) => api.get(`/api/catalogo/modelos?marca=${marca}`),
    colores: (marca: string, modelo: string) => api.get(`/api/catalogo/colores?marca=${marca}&modelo=${modelo}`),
    ramOpciones: () => api.get('/api/catalogo/ram-opciones'),
    almacenamientoOpciones: () => api.get('/api/catalogo/almacenamiento-opciones'),
    categoriasAccesorio: () => api.get('/api/catalogo/categorias-accesorio'),
};

// Chat IA (Gemini)
export const chatApi = {
    enviarMensaje: (mensaje: string, historial: { role: string; text: string }[]) =>
        api.post('/api/chat', { mensaje, historial }),
};

// Admin
export const adminApi = {
    clientes: () => api.get('/api/admin/clientes'),
};

// Configuración de la tienda
export const configuracionApi = {
    get: () => api.get('/api/configuracion'),
    actualizar: (config: unknown) => api.put('/api/configuracion', config),
};

export default api;