"use client";

import { useEffect, useState } from "react";
import { productosApi } from "@/lib/api";
import { Producto } from "@/types";
import { ShoppingCart, Smartphone, ArrowLeft, Minus, Plus, Headphones } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/context/ToastContext";
import Link from "next/link";

export default function ProductoDetalleClient({ id }: { id: number }) {
    const [producto, setProducto] = useState<Producto | null>(null);
    const [relacionados, setRelacionados] = useState<Producto[]>([]);
    const [cargando, setCargando] = useState(true);
    const [cantidad, setCantidad] = useState(1);
    const [imagenActiva, setImagenActiva] = useState(0);
    const { agregar } = useCart();
    const { showToast } = useToast();

    useEffect(() => {
        productosApi.getById(id)
            .then(res => {
                const prod = res.data;
                setProducto(prod);

                productosApi.getAll().then(allRes => {
                    const todos = allRes.data.filter((p: Producto) => p.activo && p.id !== prod.id);
                    let filtrados: Producto[] = [];

                    if (prod.tipoProducto === 'CELULAR') {
                        filtrados = todos.filter((p: Producto) =>
                            (p.tipoProducto === 'ACCESORIO' && (p.marca === prod.marca || p.marca === 'Genérico')) ||
                            (p.tipoProducto === 'CELULAR' && p.marca === prod.marca)
                        );
                    } else {
                        filtrados = todos.filter((p: Producto) => p.marca === prod.marca || p.categoria === prod.categoria);
                    }

                    setRelacionados(filtrados.sort(() => 0.5 - Math.random()).slice(0, 4));
                });
            })
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
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Smartphone className="text-blue-600 animate-pulse" size={48} />
            </div>
        );
    }

    if (!producto) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <p className="text-gray-400 text-lg mb-4">Producto no encontrado</p>
                    <Link href="/productos" className="text-blue-600 font-medium hover:underline">Volver al catálogo</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-4">
            <div className="max-w-5xl mx-auto">
                <Link href="/productos" className="inline-flex items-center gap-2 text-gray-500 hover:text-blue-600 mb-8 font-medium transition-colors">
                    <ArrowLeft size={18} />
                    Volver al catálogo
                </Link>

                <div className="bg-white rounded-3xl border border-gray-100 p-6 lg:p-10 shadow-sm mb-16">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Galería */}
                        <div>
                            <div className="bg-gray-50 rounded-2xl border border-gray-100 overflow-hidden mb-4 relative aspect-square flex items-center justify-center">
                                <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                                    {producto.condicion === 'USADO' && (
                                        <span className="bg-orange-100 text-orange-800 text-xs font-bold px-3 py-1.5 rounded-lg tracking-wider">
                                            EQUIPO USADO
                                        </span>
                                    )}
                                    {producto.tipoProducto === 'ACCESORIO' && (
                                        <span className="bg-purple-100 text-purple-800 text-xs font-bold px-3 py-1.5 rounded-lg tracking-wider">
                                            {producto.categoria?.toUpperCase() || 'ACCESORIO'}
                                        </span>
                                    )}
                                </div>

                                {producto.imagenes && producto.imagenes.length > 0 ? (
                                    <img
                                        src={producto.imagenes[imagenActiva]}
                                        alt={producto.nombre}
                                        className="h-[80%] w-[80%] object-contain mix-blend-multiply transition-transform duration-500 hover:scale-110"
                                    />
                                ) : (
                                    producto.tipoProducto === 'CELULAR'
                                        ? <Smartphone className="text-gray-300" size={120} />
                                        : <Headphones className="text-gray-300" size={120} />
                                )}
                            </div>

                            {producto.imagenes && producto.imagenes.length > 1 && (
                                <div className="flex gap-3 overflow-x-auto pb-2">
                                    {producto.imagenes.map((img, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setImagenActiva(i)}
                                            className={`w-20 h-20 flex-shrink-0 rounded-xl border-2 overflow-hidden transition-all ${
                                                imagenActiva === i ? "border-blue-600 shadow-md" : "border-gray-200 opacity-70 hover:opacity-100"
                                            }`}
                                        >
                                            <img src={img} alt="" className="w-full h-full object-contain bg-gray-50 p-2" />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Info */}
                        <div className="flex flex-col">
                            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-2">{producto.marca}</p>
                            <h1 className="text-3xl lg:text-4xl font-extrabold text-gray-900 mb-2 leading-tight">{producto.nombre}</h1>
                            <p className="text-gray-500 mb-8">{producto.modelo !== "N/A" ? producto.modelo : ""}</p>

                            <div className="mb-8">
                                <p className="text-4xl font-black text-gray-900 tracking-tight">
                                    ${producto.precio.toLocaleString("es-AR")}
                                </p>
                                <p className="text-sm text-gray-500 mt-2">Pagá con tarjetas, transferencia o efectivo vía Mercado Pago.</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-8">
                                {producto.almacenamiento && (
                                    <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Almacenamiento</p>
                                        <p className="font-bold text-gray-900 text-lg">{producto.almacenamiento} GB</p>
                                    </div>
                                )}
                                {producto.ram && (
                                    <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Memoria RAM</p>
                                        <p className="font-bold text-gray-900 text-lg">{producto.ram} GB</p>
                                    </div>
                                )}
                                {producto.color && (
                                    <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Color</p>
                                        <p className="font-bold text-gray-900 text-lg capitalize">{producto.color}</p>
                                    </div>
                                )}
                                <div className={`rounded-2xl p-4 border ${producto.stock < 5 ? "bg-orange-50 border-orange-100" : "bg-gray-50 border-gray-100"}`}>
                                    <p className={`text-xs font-semibold uppercase tracking-wider mb-1 ${producto.stock < 5 ? "text-orange-600" : "text-gray-400"}`}>Stock</p>
                                    <p className={`font-bold text-lg ${producto.stock < 5 ? "text-orange-700" : "text-gray-900"}`}>
                                        {producto.stock === 0 ? "Sin stock" : `${producto.stock} disponibles`}
                                    </p>
                                </div>
                            </div>

                            {producto.condicion === 'USADO' && (
                                <div className="bg-orange-50 rounded-2xl p-5 border border-orange-100 mb-8 flex items-center justify-between">
                                    <div>
                                        <h4 className="font-bold text-orange-900 mb-1">Estado de batería</h4>
                                        <p className="text-sm text-orange-800">El equipo fue testeado y funciona correctamente.</p>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-2xl font-black text-orange-600">{producto.nivelBateria}%</div>
                                        <div className="text-xs font-semibold text-orange-700 mt-1">{producto.ciclosCarga} ciclos</div>
                                    </div>
                                </div>
                            )}

                            {producto.descripcion && (
                                <div className="mb-10">
                                    <h3 className="font-bold text-gray-900 mb-3 text-lg">Descripción</h3>
                                    <p className="text-gray-600 leading-relaxed whitespace-pre-line">{producto.descripcion}</p>
                                </div>
                            )}

                            <div className="mt-auto pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center gap-4">
                                <div className="flex items-center justify-between w-full sm:w-auto bg-gray-50 border border-gray-200 rounded-2xl p-2">
                                    <button
                                        onClick={() => setCantidad(Math.max(1, cantidad - 1))}
                                        className="w-10 h-10 rounded-xl bg-white shadow-sm border border-gray-100 hover:border-gray-300 text-gray-700 flex items-center justify-center transition-all active:scale-95"
                                    >
                                        <Minus size={18} />
                                    </button>
                                    <span className="w-12 text-center font-bold text-lg">{cantidad}</span>
                                    <button
                                        onClick={() => setCantidad(Math.min(producto.stock, cantidad + 1))}
                                        className="w-10 h-10 rounded-xl bg-white shadow-sm border border-gray-100 hover:border-gray-300 text-gray-700 flex items-center justify-center transition-all active:scale-95"
                                    >
                                        <Plus size={18} />
                                    </button>
                                </div>
                                <button
                                    onClick={handleAgregar}
                                    disabled={producto.stock === 0}
                                    className="flex-1 w-full flex items-center justify-center gap-2 bg-blue-600 text-white font-bold py-4 rounded-2xl hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/30 transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
                                >
                                    <ShoppingCart size={20} />
                                    Agregar al carrito
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Relacionados */}
                {relacionados.length > 0 && (
                    <div className="mb-10">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">También te puede interesar</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {relacionados.map((rel) => (
                                <Link href={`/productos/${rel.id}`} key={rel.id} className="group flex flex-col bg-white border border-gray-100 rounded-2xl p-4 hover:shadow-xl hover:border-blue-100 transition-all hover:-translate-y-1">
                                    <div className="relative aspect-square w-full rounded-xl bg-gray-50 mb-4 overflow-hidden flex items-center justify-center p-6">
                                        {rel.condicion === 'USADO' && (
                                            <span className="absolute top-3 left-3 bg-orange-100 text-orange-800 text-[10px] font-bold px-2 py-1 rounded-md z-10">
                                                USADO
                                            </span>
                                        )}
                                        {rel.imagenes && rel.imagenes.length > 0 ? (
                                            <img
                                                src={rel.imagenes[0]}
                                                alt={rel.nombre}
                                                className="w-full h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500"
                                            />
                                        ) : (
                                            rel.tipoProducto === 'CELULAR'
                                                ? <Smartphone className="w-12 h-12 text-gray-300 group-hover:scale-110 transition-transform duration-500" />
                                                : <Headphones className="w-12 h-12 text-gray-300 group-hover:scale-110 transition-transform duration-500" />
                                        )}
                                    </div>
                                    <div className="flex-1 flex flex-col">
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">{rel.marca}</p>
                                        <h3 className="text-sm font-semibold text-gray-900 leading-tight mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">{rel.nombre}</h3>
                                        <div className="mt-auto pt-3 flex items-center justify-between border-t border-gray-50">
                                            <span className="font-bold text-gray-900">
                                                ${rel.precio.toLocaleString("es-AR")}
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
