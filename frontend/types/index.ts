export interface Producto {
    id: number;
    nombre: string;
    marca: string;
    modelo: string;
    descripcion: string;
    precio: number;
    stock: number;
    almacenamiento: number;
    ram: number;
    color: string;
    imagenes: string[];
    activo: boolean;
}

export interface Usuario {
    id: number;
    nombre: string;
    email: string;
    telefono: string;
    direccion: string;
    ciudad: string;
    provincia: string;
    rol: string;
}

export interface OrdenItem {
    id: number;
    productoId: number;
    productoNombre: string;
    productoMarca: string;
    cantidad: number;
    precioUnitario: number;
    subtotal: number;
}

export interface Orden {
    id: number;
    usuario: Usuario;
    items: OrdenItem[];
    estado: string;
    total: number;
    direccionEnvio: string;
    ciudadEnvio: string;
    provinciaEnvio: string;
    telefonoContacto: string;
    fechaCreacion: string;
}

export interface AuthResponse {
    token: string;
    rol: string;
    nombre: string;
}