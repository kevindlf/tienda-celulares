"use client";

import { useEffect, useState } from "react";
import { Trash2, ShoppingCart, ArrowLeft, Smartphone, Plus, Headphones } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { productosApi } from "@/lib/api";
import { Producto } from "@/types";
import { useToast } from "@/context/ToastContext";
import Link from "next/link";

export default function CarritoPage() {
    const { items, total, eliminar, cambiarCantidad, agregar } = useCart();
    const { isAuthenticated } = useAuth();
    const router = useRouter();
    const { showToast } = useToast();
    const [sugeridos, setSugeridos] = useState<Producto[]>([]);

    useEffect(() => {
        if (items.length > 0) {
            // Cargar accesorios sugeridos basados en las marcas del carrito
            productosApi.getAll().then(res => {
                const marcasEnCarrito = items.map(item => item.marca);
                
                const accesorios = res.data.filter((p: Producto) => 
                    p.activo && 
                    p.tipoProducto === 'ACCESORIO' &&
                    !items.some(item => item.id === p.id) && // que no esté en el carrito
                    (marcasEnCarrito.includes(p.marca) || p.marca === 'Genérico')
                );
                
                // Mezclar y tomar 3
                setSugeridos(accesorios.sort(() => 0.5 - Math.random()).slice(0, 3));
            }).catch(err => console.error("Error cargando sugeridos:", err));
        } else {
            setSugeridos([]);
        }
    }, [items]);

    const irACheckout = () => {
        if (!isAuthenticated) {
            router.push("/login");
            return;
        }
        router.push("/checkout");
    };

    const agregarSugerido = (producto: Producto) => {
        agregar(producto);
        showToast(`${producto.nombre} agregado al carrito`, "success");
    };

    if (items.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
                <div className="text-center">
                    <ShoppingCart className="mx-auto text-gray-300 mb-4" size={64} />
                    <h2 className="text-2xl font-bold text-gray-700 mb-2">Tu carrito está vacío</h2>
                    <p className="text-gray-400 mb-8">Agregá productos para continuar</p>
                    <Link
                        href="/productos"
                        className="inline-block bg-blue-600 text-white font-semibold px-8 py-3 rounded-xl hover:bg-blue-700 transition-colors"
                    >
                        Ver productos
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-4 pb-24">
            <div className="max-w-5xl mx-auto">

                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <Link href="/productos" className="p-2 bg-white border border-gray-200 hover:bg-gray-50 rounded-xl transition-colors">
                        <ArrowLeft size={20} className="text-gray-600" />
                    </Link>
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Tu carrito</h1>
                    <span className="text-gray-500 font-medium bg-gray-200 px-3 py-1 rounded-full text-sm">{items.length} ítems</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Lista de items */}
                    <div className="lg:col-span-2 flex flex-col gap-5">
                        {items.map(item => (
                            <div key={item.id} className="bg-white rounded-3xl border border-gray-100 p-5 lg:p-6 flex flex-col sm:flex-row gap-6 shadow-sm">
                                <div className="w-full sm:w-32 h-32 bg-gray-50 rounded-2xl flex items-center justify-center flex-shrink-0 overflow-hidden relative">
                                    {item.tipoProducto === 'ACCESORIO' && (
                                        <span className="absolute top-2 left-2 bg-purple-100 text-purple-800 text-[9px] font-bold px-2 py-1 rounded-md">
                                            ACC
                                        </span>
                                    )}
                                    {item.imagenes && item.imagenes.length > 0 ? (
                                        <img src={item.imagenes[0]} alt={item.nombre} className="w-24 h-24 object-contain mix-blend-multiply" />
                                    ) : (
                                        item.tipoProducto === 'CELULAR' ? <Smartphone className="text-gray-300" size={40} /> : <Headphones className="text-gray-300" size={40} />
                                    )}
                                </div>

                                <div className="flex-1 flex flex-col justify-between">
                                    <div>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{item.marca}</p>
                                        <h3 className="font-bold text-gray-900 text-lg leading-tight mb-2">{item.nombre}</h3>
                                        <p className="text-xs text-gray-500">
                                            {item.tipoProducto === 'CELULAR' ? (
                                                <>{item.ram && `${item.ram}GB RAM`}{item.almacenamiento && ` · ${item.almacenamiento}GB`}</>
                                            ) : (
                                                <>{item.categoria || 'Accesorio'}</>
                                            )}
                                        </p>
                                    </div>

                                    <div className="flex items-center justify-between mt-4">
                                        <p className="font-black text-gray-900 text-xl">
                                            ${(item.precio * item.cantidad).toLocaleString("es-AR")}
                                        </p>
                                        <div className="flex items-center gap-3">
                                            <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl p-1">
                                                <button
                                                    onClick={() => cambiarCantidad(item.id, item.cantidad - 1)}
                                                    className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white hover:shadow-sm text-gray-600 transition-all"
                                                >
                                                    -
                                                </button>
                                                <span className="w-8 text-center font-bold text-gray-900">{item.cantidad}</span>
                                                <button
                                                    onClick={() => cambiarCantidad(item.id, Math.min(item.stock, item.cantidad + 1))}
                                                    className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white hover:shadow-sm text-gray-600 transition-all"
                                                >
                                                    +
                                                </button>
                                            </div>
                                            <button
                                                onClick={() => eliminar(item.id)}
                                                className="w-10 h-10 flex items-center justify-center text-red-500 hover:text-white hover:bg-red-500 rounded-xl transition-all"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Cross-selling */}
                        {sugeridos.length > 0 && (
                            <div className="mt-8 pt-8 border-t border-gray-200">
                                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                    <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-md">TIP</span> 
                                    Complementá tu compra
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {sugeridos.map(sugerido => (
                                        <div key={sugerido.id} className="bg-white border border-gray-100 rounded-2xl p-4 flex flex-col hover:border-blue-200 hover:shadow-lg transition-all group">
                                            <div className="h-24 bg-gray-50 rounded-xl mb-3 flex items-center justify-center p-2 relative">
                                                {sugerido.imagenes && sugerido.imagenes.length > 0 ? (
                                                    <img src={sugerido.imagenes[0]} className="h-full object-contain mix-blend-multiply group-hover:scale-110 transition-transform" />
                                                ) : (
                                                    <Headphones className="text-gray-300" size={32} />
                                                )}
                                                <button 
                                                    onClick={() => agregarSugerido(sugerido)}
                                                    className="absolute -bottom-3 -right-3 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-blue-700 hover:scale-110 transition-all"
                                                    title="Agregar al carrito"
                                                >
                                                    <Plus size={16} />
                                                </button>
                                            </div>
                                            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">{sugerido.marca}</p>
                                            <h4 className="font-semibold text-gray-900 text-sm leading-tight mb-2 line-clamp-2">{sugerido.nombre}</h4>
                                            <p className="font-bold text-blue-600 mt-auto">${sugerido.precio.toLocaleString("es-AR")}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Resumen */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-3xl border border-gray-100 p-8 sticky top-24 shadow-sm">
                            <h2 className="font-bold text-gray-900 text-xl mb-6">Resumen de compra</h2>

                            <div className="flex flex-col gap-4 mb-6">
                                {items.map(item => (
                                    <div key={item.id} className="flex justify-between text-sm">
                                        <span className="text-gray-500 font-medium">
                                            <span className="text-gray-900">{item.cantidad}x</span> {item.nombre}
                                        </span>
                                        <span className="font-bold text-gray-900">${(item.precio * item.cantidad).toLocaleString("es-AR")}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t border-dashed border-gray-200 pt-6 mb-8">
                                <div className="flex justify-between items-end">
                                    <span className="text-gray-500 font-medium">Total a pagar</span>
                                    <span className="text-3xl font-black text-gray-900 tracking-tight">${total.toLocaleString("es-AR")}</span>
                                </div>
                                <p className="text-xs text-gray-400 text-right mt-2">Los envíos se calculan en el siguiente paso.</p>
                            </div>

                            <button
                                onClick={irACheckout}
                                className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/30 transition-all active:scale-95 text-lg"
                            >
                                Continuar compra
                            </button>
                            
                            <div className="mt-6 flex justify-center items-center gap-2 grayscale opacity-50">
                                <img src="https://logospng.org/download/mercado-pago/logo-mercado-pago-icone-1024.png" alt="Mercado Pago" className="h-4" />
                                <span className="text-xs font-semibold text-gray-600">Pago 100% seguro</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}