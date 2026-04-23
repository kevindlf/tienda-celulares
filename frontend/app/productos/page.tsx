"use client";

import { useEffect, useState } from "react";
import { productosApi } from "../../lib/api";
import { Producto } from "../../types";
import { ShoppingCart, Search, Smartphone } from "lucide-react";

export default function ProductosPage() {
    const [productos, setProductos] = useState<Producto[]>([]);
    const [filtrados, setFiltrados] = useState<Producto[]>([]);
    const [busqueda, setBusqueda] = useState("");
    const [cargando, setCargando] = useState(true);

    useEffect(() => {
        productosApi.getAll()
            .then(res => {
                setProductos(res.data);
                setFiltrados(res.data);
            })
            .finally(() => setCargando(false));
    }, []);

    useEffect(() => {
        const resultado = productos.filter(p =>
            p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
            p.marca.toLowerCase().includes(busqueda.toLowerCase())
        );
        setFiltrados(resultado);
    }, [busqueda, productos]);

    const agregarAlCarrito = (producto: Producto) => {
        const carrito = JSON.parse(localStorage.getItem("carrito") || "[]");
        const existente = carrito.find((item: { id: number }) => item.id === producto.id);
        if (existente) {
            existente.cantidad += 1;
        } else {
            carrito.push({ ...producto, cantidad: 1 });
        }
        localStorage.setItem("carrito", JSON.stringify(carrito));
        alert(`${producto.nombre} agregado al carrito!`);
    };

    if (cargando) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <Smartphone className="mx-auto text-blue-600 animate-pulse mb-4" size={48} />
                    <p className="text-gray-500">Cargando productos...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="bg-white border-b border-gray-100 py-8 px-4">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-3xl font-bold text-gray-900 mb-6">Nuestros celulares</h1>
                    <div className="relative max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            placeholder="Buscar por nombre o marca..."
                            value={busqueda}
                            onChange={(e) => setBusqueda(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-10">
                {filtrados.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-gray-400 text-lg">No se encontraron productos</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filtrados.map(producto => (
                            <div key={producto.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                                <div className="bg-gradient-to-br from-blue-50 to-blue-100 h-48 flex items-center justify-center">
                                    <Smartphone className="text-blue-300" size={64} />
                                </div>
                                <div className="p-5">
                                    <p className="text-xs font-medium text-blue-600 uppercase tracking-wide mb-1">{producto.marca}</p>
                                    <h3 className="font-semibold text-gray-900 mb-1">{producto.nombre}</h3>
                                    <p className="text-sm text-gray-500 mb-3">{producto.ram}GB RAM · {producto.almacenamiento}GB · {producto.color}</p>
                                    <div className="flex items-center justify-between mt-4">
                                        <div>
                                            <p className="text-xl font-bold text-gray-900">
                                                ${producto.precio.toLocaleString("es-AR")}
                                            </p>
                                            <p className="text-xs text-gray-400">Stock: {producto.stock}</p>
                                        </div>
                                        <button
                                            onClick={() => agregarAlCarrito(producto)}
                                            disabled={producto.stock === 0}
                                            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                                        >
                                            <ShoppingCart size={16} />
                                            Agregar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}