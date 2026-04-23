"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { productosApi } from "@/lib/api";
import { Producto } from "@/types";
import { ShoppingCart, Smartphone, ArrowLeft, Minus, Plus } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import Link from "next/link";

export default function ProductoDetallePage() {
    const [producto, setProducto] = useState<Producto | null>(null);
    const [cargando, setCargando] = useState(true);
    const [cantidad, setCantidad] = useState(1);
    const [imagenActiva, setImagenActiva] = useState(0);
    const params = useParams();
    const id = Number(Array.isArray(params.id) ? params.id[0] : params.id);
    const { agregar } = useCart();
    const { showToast } = useToast();

    useEffect(() => {
        productosApi.getById(id)
            .then(res => setProducto(res.data))
            .catch(() => showToast("Producto no encontrado", "error"))
            .finally(() => setCargando(false));
    }, [id, showToast]);

    const handleAgregar = () => {
        if (!producto) return;
        for (let i = 0; i < cantidad; i++) {
            agregar(producto);
        }
        showToast(`${cantidad}x ${producto.nombre} agregado al carrito`, "success");
        setCantidad(1);
    };

    if (cargando) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Smartphone className="text-blue-600 animate-pulse" size={48} />
            </div>
        );
    }

    if (!producto) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-400 text-lg mb-4">Producto no encontrado</p>
                    <Link href="/productos" className="text-blue-600 hover:underline">Volver a productos</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-4">
            <div className="max-w-5xl mx-auto">
                {/* Back */}
                <Link href="/productos" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-6 transition-colors">
                    <ArrowLeft size={18} />
                    Volver a productos
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    {/* Galería */}
                    <div>
                        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden mb-4">
                            <div className="bg-gradient-to-br from-blue-50 to-blue-100 h-80 flex items-center justify-center">
                                {producto.imagenes && producto.imagenes.length > 0 ? (
                                    <img
                                        src={producto.imagenes[imagenActiva]}
                                        alt={producto.nombre}
                                        className="h-72 w-72 object-contain"
                                    />
                                ) : (
                                    <Smartphone className="text-blue-300" size={120} />
                                )}
                            </div>
                        </div>
                        {producto.imagenes && producto.imagenes.length > 1 && (
                            <div className="flex gap-3">
                                {producto.imagenes.map((img, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setImagenActiva(i)}
                                        className={`w-16 h-16 rounded-xl border-2 overflow-hidden ${
                                            imagenActiva === i ? "border-blue-600" : "border-gray-200"
                                        }`}
                                    >
                                        <img src={img} alt="" className="w-full h-full object-contain bg-gray-50" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Info */}
                    <div>
                        <p className="text-sm font-medium text-blue-600 uppercase tracking-wide mb-1">{producto.marca}</p>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">{producto.nombre}</h1>
                        <p className="text-gray-500 mb-6">{producto.modelo}</p>

                        <p className="text-3xl font-bold text-gray-900 mb-6">
                            ${producto.precio.toLocaleString("es-AR")}
                        </p>

                        {/* Specs */}
                        <div className="grid grid-cols-2 gap-4 mb-6">
                            {producto.almacenamiento && (
                                <div className="bg-gray-50 rounded-xl p-4">
                                    <p className="text-xs text-gray-400 mb-1">Almacenamiento</p>
                                    <p className="font-semibold text-gray-900">{producto.almacenamiento} GB</p>
                                </div>
                            )}
                            {producto.ram && (
                                <div className="bg-gray-50 rounded-xl p-4">
                                    <p className="text-xs text-gray-400 mb-1">RAM</p>
                                    <p className="font-semibold text-gray-900">{producto.ram} GB</p>
                                </div>
                            )}
                            {producto.color && (
                                <div className="bg-gray-50 rounded-xl p-4">
                                    <p className="text-xs text-gray-400 mb-1">Color</p>
                                    <p className="font-semibold text-gray-900">{producto.color}</p>
                                </div>
                            )}
                            <div className="bg-gray-50 rounded-xl p-4">
                                <p className="text-xs text-gray-400 mb-1">Stock</p>
                                <p className={`font-semibold ${producto.stock < 5 ? "text-red-500" : "text-gray-900"}`}>
                                    {producto.stock === 0 ? "Sin stock" : `${producto.stock} unidades`}
                                </p>
                            </div>
                        </div>

                        {producto.descripcion && (
                            <div className="mb-6">
                                <h3 className="font-semibold text-gray-900 mb-2">Descripción</h3>
                                <p className="text-gray-500 text-sm leading-relaxed">{producto.descripcion}</p>
                            </div>
                        )}

                        {/* Cantidad + Agregar */}
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-3 border border-gray-200 rounded-xl px-3 py-2">
                                <button
                                    onClick={() => setCantidad(Math.max(1, cantidad - 1))}
                                    className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors"
                                >
                                    <Minus size={16} />
                                </button>
                                <span className="w-8 text-center font-medium">{cantidad}</span>
                                <button
                                    onClick={() => setCantidad(Math.min(producto.stock, cantidad + 1))}
                                    className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors"
                                >
                                    <Plus size={16} />
                                </button>
                            </div>
                            <button
                                onClick={handleAgregar}
                                disabled={producto.stock === 0}
                                className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white font-semibold py-3 rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                <ShoppingCart size={20} />
                                Agregar al carrito
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
